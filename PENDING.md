# Pending: Smarter Wrappers

## The core problem

Third-party components that measure their own DOM container to decide how to render (Monaco's `automaticLayout`, canvas/SVG libraries) collide with XMLUI's layout engine. They race: the component measures before XMLUI has finished layout, or XMLUI resizes after the component has already rendered.

## Proposed: LayoutBridge

A layout negotiation layer between XMLUI's container and the third-party component's DOM element.

**1. Observe, then render.** Use `ResizeObserver` on the XMLUI container. Don't mount the third-party component until the container has a stable size. When the container resizes, provide new dimensions.

**2. Provide explicit dimensions.** Instead of letting the third-party component measure the DOM (fragile and timing-dependent), pass it explicit `width` and `height` derived from the observed container size minus reserved space (margins, labels, legends).

**3. Debounce and batch.** Resize events fire rapidly. The bridge debounces observations and batches dimension updates so the third-party component re-renders once, not on every pixel.

**The hard part:** reserved space isn't static. The bridge may need a two-pass cycle: render once to measure reserved elements, calculate remaining space, render again with final dimensions.

**Where it generalizes:** Monaco, map components, canvas-based components.

**Where it breaks down:** components that must own measurement (virtual scroll), components that render incrementally, and the two-pass cycle adds one frame of latency.

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
Declarative routing of XMLUI child elements to React child components. Most relevant for libraries that use React children composition (Radix). Less relevant for config-object libraries (ECharts).

## ECharts: Results

The ECharts wrapper is built and working. Key findings:

### LayoutBridge hypothesis: validated for ECharts

The EChart render component uses one `ResizeObserver` on its container div, debounced to 100ms. It calls `chart.resize()` when the container changes size. 15 lines, works for every chart type.

The EChart wrapper provides explicit container dimensions and lets ECharts handle its own internal layout. ResizeObserver + explicit dimensions works well for a library designed to accept them. The case for a generalized LayoutBridge is other container-measuring libraries (Monaco, map components, canvas renderers).

### Pass-through vs abstraction

The EChart wrapper passes through the library's native `option` object. One component, 187 lines total, full API surface. The pass-through pattern eliminates the "silently dropped props" problem entirely. It also eliminates per-component sizing code, tick rendering code, and color management code. See `echarts-vs-recharts.md` for the comparison.

### Canvas vs DOM: a new theming wrinkle

XMLUI's `getThemeVar()` returns CSS `var()` references (e.g., `var(--xmlui-const-color-primary-500)`). This works for DOM/SVG-based libraries (Recharts, Smart UI) where CSS variables resolve natively. But ECharts renders on a **canvas**, which doesn't understand CSS variables. The render component resolves them via `getComputedStyle(root).getPropertyValue(varName)`.

This is a general concern for any canvas-based library (Plotly, Chart.js, Three.js). A `useResolvedThemeVar()` hook that handles this resolution would be useful.

### Structured data props: not needed

The ECharts `option` object passes through `extractValue` and arrives as a JavaScript object. The XMLUI expression engine handles the parsing. No special structured-data handling was required.

## Priorities

1. **LayoutBridge** — validated for ECharts, relevant for other container-measuring libraries (Monaco, maps, canvas renderers).

2. **useResolvedThemeVar()** — a hook that resolves CSS var() references to actual color strings for canvas-based libraries. Small utility, high value.

3. **Template/render props** — standardize the pattern for custom renderers. Not needed for ECharts (option-based) but relevant for other wrapped components.

4. **Child slot mapping** — relevant for Radix and similar React-children-composition libraries. Lower priority given the pass-through pattern works better.
