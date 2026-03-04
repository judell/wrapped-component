# Orientation

This document walks you through the wrapping infrastructure assembled in this repo and two companion repos. The goal: understand how third-party React components get wrapped for XMLUI to:

- expose all underlying props
- expose selected native events
- show up as traces in the inspector
- provide enhanced info to screen readers
- participate in theming
- participate in whole-application tests

The relevant comparison for existing components is Slider (hand-written) vs SliderW (wrapped). The same principles apply to as-yet-unwrapped React components.

## Prerequisites

```
git clone https://github.com/xmlui-org/xmlui.git
cd xmlui
git checkout judell/wrap-component
npm install
```

```
git clone https://github.com/judell/wrapped-component.git
```

```
git clone https://github.com/xmlui-org/trace-tools.git
```

The trace-tools repo (https://github.com/xmlui-org/trace-tools) is the upstream source for `xs-diff.html` and the trace pipeline tools (`compare-traces.js`, `generate-playwright.js`, etc.). Apps like `wrapped` clone trace-tools and consume its files read-only as a local copy — they don't modify or push to trace-tools. Only develop in the trace-tools repo itself when working on the tools themselves.

## Exercise 1: Compare Slider vs SliderW (internal component, same library)

### Understand the hand-written approach

Read `xmlui/src/components/Slider/Slider.tsx` — the 40-line renderer that manually lists every prop via `extractValue`, `lookupEventHandler`, `lookupSyncCallback`. Every prop the XMLUI author can use must appear explicitly in this file. If a prop isn't listed, it's silently dropped — the XMLUI author writes `inverted="{true}"` and nothing happens.

Read `xmlui/src/components/Slider/SliderNative.tsx` — the 347-line native component with `useState`/`useEffect` for `initialValue` parsing, value syncing, `updateState`, `registerComponentApi`, and Radix assembly.

### Understand the wrapped approach

Each wrapped component has two files:

- `*Wrapped.tsx` — the config file that tells `wrapCompound` how to bridge XMLUI to the React component. Declares prop types, events, renames.
- `*Render.tsx` — the React component that actually renders the third-party library's UI. This is what we call the "render component" throughout this document.

Read `xmlui/src/components/Slider/SliderWrapped.tsx` — the `wrapCompound` config (~30 lines). The config only declares exceptions: which props are booleans (need special extraction), which are events, which need renaming (`minValue` → `min`). Everything else passes through automatically.

Read `xmlui/src/components/Slider/SliderRender.tsx` — the render component, pure React (~109 lines). No XMLUI imports. Receives `value`, `onChange`, `registerApi`. This separation matters: the render component is just a React component that any React developer can write, test, and understand without learning XMLUI internals. All the XMLUI plumbing (state lifecycle, event tracing, API registration) lives in the wrapper config, not in the render component. A React developer contributing a new wrapped component only needs to write the React part.

### How props flow through

In the hand-written renderer, the prop pipeline is: XMLUI markup → renderer (explicit `extractValue` per prop) → React component. If the renderer doesn't mention a prop, it's gone.

In the wrapped approach, the pipeline is: XMLUI markup → `wrapComponent` (calls `extractValue` on every prop it finds in `node.props`) → React component. Unrecognized props aren't dropped — they flow through as-is. The render component receives them via `...rest` and can spread them onto its DOM element.

This is why SliderW supports `inverted`, `title`, `aria-label`, and `tabIndex` without any config changes — the wrapper forwards them automatically, and `SliderRender.tsx` spreads `...rest` onto its outer `<div>`.

### See how the wrapper works

Read `xmlui/src/components-core/wrapComponent.tsx` — this is the engine. `wrapComponent` generates the renderer automatically. `wrapCompound` adds the `StateWrapper` that handles the value lifecycle.

The StateWrapper is a React component that `wrapCompound` generates for you. In the hand-written `SliderNative.tsx`, you'll see ~100 lines of boilerplate that every stateful component repeats: parse `initialValue` with `useEffect`, sync when the external value changes, call `updateState` so XMLUI knows the new value, register component APIs (`getValue`, `setValue`, `focus`). None of that is slider-specific — it's the same pattern in every stateful component.

The StateWrapper does all of this generically. It takes two optional hooks in the config — `parseInitialValue` (for component-specific parsing, e.g. Slider needs to parse JSON arrays and clamp to min/max) and `formatExternalValue` (to normalize incoming values). Everything else is handled. Your render component receives three clean props: `value`, `onChange`, and `registerApi`. It never imports anything from XMLUI — it's pure React.

### See both registered

Read `xmlui/src/components/ComponentProvider.tsx` — search for `Slider` to see the hand-written version registered in core. The wrapped SliderW lives in `packages/xmlui-slider/` and registers itself as an extension package via `xmlui build-lib`. Both are available in the app — the hand-written one from the core bundle, the wrapped one from `xmlui/xmlui-slider.js` loaded as a script tag in `index.html`.

### Run it and compare

```bash
cd xmlui/xmlui
npm run build:xmlui-standalone
```

Copy the built standalone to the wrapped app:

```bash
cp dist/standalone/xmlui-standalone.umd.js /path/to/wrapped-component/xmlui/
```

Open the wrapped app (or visit https://wrap-and-theme.netlify.app/). Go to "Slider and SliderW" — they behave identically. Go to "Slider vs SliderW" — SliderW forwards props that Slider drops (`inverted`, `title`, `aria-label`, `tabIndex`).

### See the trace difference

Click the cog icon (top right) to open the inspector. Move each slider. Slider produces only `handler:start/complete`. SliderW also produces `value:change SliderW "60"` and `focus:change` — the semantic events that trace-tools needs.

## Exercise 2: Look at a third-party component (EChart)

### Read the wrapper config

`xmlui/src/components/EChart/EChartWrapped.tsx` — `wrapComponent` config with `captureNativeEvents: true`.

XMLUI's trace system already captures its own events — component lifecycle, `value:change`, `handler:start/complete`. But a library like ECharts fires its own events (bar clicks with data values, legend toggles, zoom changes) that are invisible to XMLUI. ECharts renders on canvas, so there's no DOM for the trace system or a screen reader to inspect. A click on a bar is just a click on a `<canvas>` element — the fact that it hit "Revenue → May = 2800" is locked inside the library.

`captureNativeEvents: true` tells the wrapper to inject an `onNativeEvent` callback into the render component's props. The render component calls this callback whenever a library-native event fires, and the wrapper traces it with a `native:` prefix (`native:click`, `native:legendselectchanged`, `native:datazoom`). This makes opaque interactions visible to the trace system, to screen readers (via the structured labels), and to application-level tests that can now assert on chart content, not just chart presence.

### Read the render component

`xmlui/src/components/EChart/EChartRender.tsx` — pure React. Note:
- `useTheme()` reads XMLUI tokens and injects them into the ECharts option (Phase 4: option-level theming)
- `ECHARTS_EVENTS` list + `onEvents` map forwards native events to `onNativeEvent` (Phase 5: native event capture)
- `ResizeObserver` on the container div for responsive sizing

### See it used in markup

In `wrapped-component/Main.xmlui`, search for `<EChart` — it's just a tag with an `option` prop. The XMLUI author doesn't know about `useTheme`, `onNativeEvent`, or `ResizeObserver`.

### See native events in the inspector

Visit the ECharts page. Click a bar, toggle a legend, zoom. Open the inspector and filter for `native:` — you'll see `native:click cat-bar "Revenue → Mon = 120"`, `native:legendselectchanged`, `native:datazoom`.

## Exercise 3: Theme bridging

Third-party components have their own styling systems that don't know about XMLUI's design tokens. When you switch themes or toggle light/dark mode, wrapped components should respond automatically. Two patterns handle this, depending on how the library exposes its styling.

### Pattern 1: CSS-level bridging (Gauge)

Some libraries style via CSS custom properties. Smart UI Gauge uses `--smart-background`, `--smart-primary`, etc. The bridge is an SCSS module that maps XMLUI theme variables to these properties.

Read `xmlui/src/components/Gauge/Gauge.module.scss` — it declares XMLUI theme variables using `createThemeVar` and assigns them to Smart UI's CSS custom properties:

```scss
$backgroundColor-Gauge: createThemeVar("Input:backgroundColor-#{$componentName}");
$primaryColor-Gauge:    createThemeVar("Input:primaryColor-#{$componentName}");

:global(smart-gauge) {
  --smart-background: #{$backgroundColor-Gauge};
  --smart-primary:    #{$primaryColor-Gauge};
}
```

Read `xmlui/src/components/Gauge/GaugeWrapped.tsx` — the `defaultThemeVars` section maps each SCSS variable to an XMLUI design token:

```typescript
defaultThemeVars: {
  "backgroundColor-Gauge": "$color-surface-50",
  "textColor-Gauge":       "$textColor-primary",
  "primaryColor-Gauge":    "$color-primary",
},
```

These tokens automatically resolve differently in light vs dark mode. The render component (`GaugeRender.tsx`) is pure React — it imports the SCSS module and applies it via `classnames`, but contains no theme logic. The CSS cascade does the work.

### Pattern 2: Option-level bridging (ECharts)

Some libraries control all styling through a JavaScript config object, not CSS. ECharts has no `--echart-*` CSS custom properties to bridge to — colors, fonts, and visual properties are all fields in the `option` object passed to the chart.

Read `xmlui/src/components/EChart/EChartRender.tsx` — the render component calls `useTheme()` (the same React context hook used by 35+ XMLUI components) to read design tokens at runtime and merge them into the ECharts option:

```typescript
const { getThemeVar } = useTheme();

const palette = [
  getThemeVar("color-primary-500"),
  getThemeVar("color-success-500"),
  getThemeVar("color-warn-500"),
  // ...
].filter(Boolean);

const themedOption = deepMerge({
  color: palette,
  textStyle: { color: getThemeVar("textColor-primary") },
  tooltip: { backgroundColor: getThemeVar("color-surface-50") },
}, userOption);  // user option wins
```

When the theme changes, `useTheme()` triggers a React re-render, the option is rebuilt with new colors, and the chart updates. Any color the XMLUI author specifies explicitly in their option overrides the theme default.

### Which pattern when

| | CSS-level (Gauge) | Option-level (ECharts) |
|---|---|---|
| Library styles via | CSS custom properties | JavaScript config object |
| Bridge lives in | SCSS module | Render component |
| Theme changes via | CSS cascade (automatic) | React re-render (rebuilds config) |
| Render component imports | SCSS module only | `useTheme` from XMLUI |

Both connect to the same XMLUI design token system. The choice depends on how the third-party library exposes its styling API. Other libraries will likely need variants of these — the point is that the pattern is identified, not that these two cover every case.

### See it in action

Visit the Gauge or ECharts pages. Use the theme selector to switch between "default" and "earthtone." Toggle the tone switch for light/dark mode. Both components adapt automatically.

## Exercise 4: Capture a trace and turn it into a test

### Configure for tracing

Already done in `config.json`:

```json
{
  "appGlobals": {
    "xsVerbose": true,
    "xsVerboseLogMax": 500,
    "captureNativeEvents": true
  }
}
```

### Capture a journey

1. Open the app, interact with SliderW (move it to value 55)
2. Open inspector (cog icon), export the trace as JSON
3. Save it as a baseline:

```bash
./test.sh save exported-trace.json slider-pass
```

### Generate and run a test from the baseline

```bash
./test.sh run slider-pass
```

This does four things:
1. Resets fixtures
2. Runs `generate-playwright.js` to convert the baseline into a Playwright test (using `aria-role`/`aria-name` selectors)
3. Executes the generated test
4. Runs `compare-traces.js --semantic` to compare the captured trace against the baseline

### See it fail on a regression

Save a second baseline where the slider stops at 60 instead of 55. The semantic comparison will flag the value mismatch.

```bash
./test.sh run slider-fail
```

The test fails with the correct value mismatch — `expected 55, got 60`.

### Write a hand-written spec instead

For more control, write a Playwright spec directly:

```bash
# Look at existing examples
ls wrapped-component/traces/specs/
```

Read one of the existing specs to see the pattern, then:

```bash
./test.sh spec your-spec-name
```

