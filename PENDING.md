# Pending: Smarter Wrappers

## The Recharts Evidence

The commit history for XMLUI's Recharts wrappers tells a clear story. Of ~40 commits touching the chart Native layer, roughly 70% address sizing, layout, and tick measurement — the impedance mismatch between Recharts' container measurement and XMLUI's layout engine.

### Commits by category

**Sizing and layout (7 commits, ~570 lines changed)**
- `sizing in Table` (#1546) — charts not fitting inside Table cells
- `size management` (#1657) — major BarChart rewrite (+171/-107)
- `sizing issue` (#1933) — LineChart sizing
- `not fitting in Table` (#1972) — second round of Table fitting
- `height properly applies` (#1480) — PieChart/DonutChart height
- `layout issues` (#1316) — LineChart/PieChart layout
- `spacing` (#2280) — LineChart/BarChart/PieChart spacing

**Tick rendering (3 commits, ~340 lines)**
- `tick rendering` (#1576) — major tick overhaul for both Bar/Line (+227/-55)
- `tick labels not appearing` (#1973) — BarChart tick fix
- `tick color` (#880) — tick color support

**Tooltip (1 commit, ~120 lines)**
- `tooltip position tracking` (#2011) — BarChart tooltip positioning

**Coloring and theming (2 commits, ~195 lines)**
- `coloring reconsidered` (#1051) — optional fill field in data
- `themeVars for default palette` (#1061) — theme-based color palette

**Label layout (2 commits, ~86 lines)**
- `chart label layout` (#993) — PieChart label positioning
- `PieChart label nameKey` (#958) — label display fix

### The core problem

Third-party components that measure their own DOM container to decide how to render (Recharts' `ResponsiveContainer`, Monaco's `automaticLayout`, any canvas/SVG library) collide with XMLUI's layout engine. They race: the component measures before XMLUI has finished layout, or XMLUI resizes after the component has already rendered.

### Proposed: LayoutBridge

A layout negotiation layer between XMLUI's container and the third-party component's DOM element.

**1. Observe, then render.** Use `ResizeObserver` on the XMLUI container. Don't mount the third-party component until the container has a stable size. When the container resizes, provide new dimensions. This replaces each library's own container-measurement strategy with a single consistent one.

**2. Provide explicit dimensions.** Instead of letting the third-party component measure the DOM (fragile and timing-dependent), pass it explicit `width` and `height` derived from the observed container size minus reserved space (margins, labels, legends).

**3. Debounce and batch.** Resize events fire rapidly. The bridge debounces observations and batches dimension updates so the third-party component re-renders once, not on every pixel.

**The hard part:** reserved space isn't static. You don't know axis label height until you measure the tick labels, which depend on data and formatter. The bridge needs a two-pass cycle: render once to measure reserved elements, calculate remaining space, render again with final dimensions.

**Where it generalizes:** any chart library, Monaco, map components, canvas-based components.

**Where it breaks down:** components that must own measurement (virtual scroll), components that render incrementally, and the two-pass cycle adds one frame of latency.

**Estimated impact:** would eliminate ~60% of the sizing/layout commits. The remaining 40% is library-specific (Recharts margin calculation, stacked bar handling, tick rotation).

### Integration with wrapComponent

Could be declared in wrapper config:

```
wrapCompound("BarChart", BarChartRender, BarChartMd, {
  layout: {
    observe: true,
    reserve: { bottom: "xAxisHeight", left: "yAxisWidth" },
    debounce: 100,
  },
})
```

## Other wrapper improvements identified

### Template/render props (high priority)
Standardize the pattern for custom tooltip renderers, cell renderers, item renderers. Currently copy-pasted as `MemoizedItem` boilerplate in every component that supports custom rendering.

### Child slot mapping (medium priority)
Declarative routing of XMLUI child elements to React child components. Most relevant for libraries that use React children composition (Recharts, Radix). Less relevant for config-object libraries (ECharts).

### Structured data props (lower priority)
Type-aware parsing/coercion for complex props (arrays of objects, nested config). The expression engine already handles most cases; the remaining gaps are better solved by transform functions.

## ECharts: Results

The ECharts wrapper is built and working. Key findings:

### LayoutBridge hypothesis: partially validated

The EChart render component uses one `ResizeObserver` on its container div, debounced to 100ms. It calls `chart.resize()` when the container changes size. This is the same pattern that the Recharts wrappers implement per-component across 7 sizing commits (~570 lines). The EChart version is 15 lines and works for every chart type.

The difference: the EChart wrapper doesn't fight the library's layout system. It provides explicit container dimensions and lets ECharts handle its own internal layout. The Recharts wrappers try to measure tick labels, calculate margins, and pass adjusted dimensions to `ResponsiveContainer` — that's where the complexity and bugs come from.

What the ECharts evidence actually proves: ResizeObserver + explicit dimensions works well for a library designed to accept explicit dimensions and handle its own internal layout. It doesn't prove that wrapping a generic LayoutBridge around Recharts would fix Recharts' problems, because many of those bugs are internal to Recharts (margin calculation, tick measurement, stacked bar handling) rather than container-measurement issues.

**Experiment that would provide evidence:** take the BarChart wrapper (the most bug-prone), bypass `ResponsiveContainer` entirely, and pass explicit `width`/`height` from a ResizeObserver to the `<BarChart>` component directly. If the sizing bugs from the commit history (#1657, #1546, #1972) don't reproduce, a LayoutBridge helps Recharts. If they still reproduce, the bugs are Recharts-internal and a LayoutBridge wouldn't help.

**The deeper question:** if ECharts can replace Recharts entirely, does a LayoutBridge for Recharts matter? The stronger case for LayoutBridge is other container-measuring libraries (Monaco, map components, canvas renderers) rather than fixing Recharts specifically.

### Pass-through vs abstraction

The Recharts wrappers abstract the library's API behind XMLUI-specific props. This requires 6 components, each with its own Native file, and every feature needs explicit support. The EChart wrapper passes through the library's native `option` object. One component, 187 lines total, full API surface.

The pass-through pattern eliminates the "silently dropped props" problem entirely. It also eliminates per-component sizing code, tick rendering code, and color management code. See `echarts-vs-recharts.md` for the full comparison.

### Canvas vs DOM: a new theming wrinkle

XMLUI's `getThemeVar()` returns CSS `var()` references (e.g., `var(--xmlui-const-color-primary-500)`). This works for DOM/SVG-based libraries (Recharts, Smart UI) where CSS variables resolve natively. But ECharts renders on a **canvas**, which doesn't understand CSS variables. The render component resolves them via `getComputedStyle(root).getPropertyValue(varName)`.

This is a general concern for any canvas-based library (Plotly, Chart.js, Three.js). A `useResolvedThemeVar()` hook that handles this resolution would be useful.

### Structured data props: not needed

The ECharts `option` object passes through `extractValue` and arrives as a JavaScript object. The XMLUI expression engine handles the parsing. No special structured-data handling was required.

### Could ECharts replace Recharts entirely?

Yes. The six Recharts chart types (bar, line, pie, area, radar, donut) are a subset of what ECharts provides through the single `<EChart>` component. The simplicity gap is bridgeable at the XMLUI layer: user-defined components like `SimpleBarChart`, `SimpleLineChart`, and `SimplePieChart` provide the same `data`/`xKey`/`yKeys` DX as the Recharts wrappers, each in a single `.xmlui` file.

What you'd gain: one wrapper replaces six, 40+ chart types available with zero additional wrapping, composite charts work naturally, and the sizing bugs disappear. What you might lose: bundle size (ECharts ~300KB gzipped vs Recharts ~45KB, mitigable with tree-shaking) and the React-children composition style (less relevant in XMLUI's XML-attribute model). See `echarts-vs-recharts.md` for the full assessment.

## Revised priorities

1. **LayoutBridge** — partially validated. The pattern (ResizeObserver + debounce + explicit dimensions) works for ECharts, but ECharts is designed to accept it. Whether it would fix Recharts' sizing bugs is unproven — many are Recharts-internal. More relevant for other container-measuring libraries (Monaco, maps, canvas renderers), or moot if ECharts replaces Recharts.

2. **useResolvedThemeVar()** — a hook that resolves CSS var() references to actual color strings for canvas-based libraries. Small utility, high value.

3. **Template/render props** — still relevant for the Recharts tooltip pattern and similar. Not needed for ECharts (option-based).

4. **Child slot mapping** — relevant for Recharts/Radix but not for config-object libraries. Lower priority given the pass-through pattern works better.

5. **Structured data props** — not needed. The expression engine handles it.
