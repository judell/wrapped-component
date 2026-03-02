# Extension packaging for wrapped components

Each wrapped React component ships as an independent XMLUI extension package. The package bundles the third-party library and its dependencies into a single UMD `.js` file that auto-registers when loaded via a `<script>` tag.

## Package structure

```
packages/xmlui-echart/
  package.json
  src/
    index.tsx              # default export: { namespace, components }
    EChartWrapped.tsx      # wrapComponent/wrapCompound config + metadata
    EChartRender.tsx       # pure React render component
    EChart.module.scss     # optional: XMLUI theme bridge
```

## Creating a package

### 1. package.json

```json
{
  "name": "xmlui-echart",
  "version": "0.1.0",
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "build:extension": "xmlui build-lib",
    "build-watch": "xmlui build-lib --watch",
    "build:meta": "xmlui build-lib --mode=metadata"
  },
  "devDependencies": {
    "xmlui": "*"
  },
  "dependencies": {
    "echarts": "6.0.0",
    "echarts-for-react": "3.0.6",
    "classnames": "2.5.1"
  },
  "main": "./dist/xmlui-echart.js",
  "module": "./dist/xmlui-echart.mjs",
  "exports": {
    ".": {
      "import": "./dist/xmlui-echart.mjs",
      "require": "./dist/xmlui-echart.js"
    },
    "./*.css": {
      "import": "./dist/*.css",
      "require": "./dist/*.css"
    }
  },
  "files": ["dist"],
  "engines": { "node": ">=18.0.0" }
}
```

Key points:
- `"xmlui": "*"` as a devDependency — resolved from the monorepo workspace
- Third-party libraries go in `dependencies` — they get bundled into the UMD
- `build:extension` runs `xmlui build-lib`, which externalizes `react`, `react-dom`, `react/jsx-runtime`, and `xmlui`

### 2. src/index.tsx — entry point

```tsx
import { echartComponentRenderer } from "./EChartWrapped";

export default {
  namespace: "XMLUIExtensions",
  components: [echartComponentRenderer],
};
```

The default export must have `namespace` and `components`. The namespace is arbitrary; `"XMLUIExtensions"` is conventional for wrapped components.

### 3. src/*Wrapped.tsx — wrapper config + metadata

```tsx
import { EChartRender } from "./EChartRender";
import { wrapComponent, createMetadata, d } from "xmlui";

const COMP = "EChart";

export const EChartMd = createMetadata({
  status: "experimental",
  description: "...",
  props: {
    option: { description: "The ECharts option object." },
    width: d("Width of the chart container.", undefined, "string", "100%"),
    height: d("Height of the chart container.", undefined, "string", "400px"),
  },
});

export const echartComponentRenderer = wrapComponent(COMP, EChartRender, EChartMd, {
  strings: ["width", "height", "renderer"],
  captureNativeEvents: true,
});
```

All XMLUI utilities come from `"xmlui"`:
- `wrapComponent` / `wrapCompound` — generates the renderer and optional state wrapper
- `createMetadata`, `d`, `dDidChange`, `dInitialValue` — metadata helpers
- `Tooltip`, `useTheme`, `parseScssVar` — if the render component needs them

### 4. src/*Render.tsx — pure React

The render component has no XMLUI imports. It receives props from the wrapper:
- `value`, `onChange` — for stateful components (via `wrapCompound`)
- `registerApi` — to expose component APIs
- `onNativeEvent` — if `captureNativeEvents: true` in the wrapper config
- All declared props (booleans, strings, etc.) after type conversion
- `className`, `ref`, and any HTML attributes the XMLUI author passes through

### 5. SCSS theming (optional)

If the third-party library uses CSS custom properties for styling, bridge them to XMLUI tokens via an SCSS module:

```scss
@use "xmlui/themes.scss" as t;

$themeVars: ();
@function createThemeVar($componentVariable) {
  $themeVars: t.appendThemeVar($themeVars, $componentVariable) !global;
  @return t.getThemeVar($themeVars, $componentVariable);
}

$componentName: "Gauge";

// Map XMLUI tokens to the library's CSS custom properties
.gaugeContainer {
  --smart-gauge-default-height: 200px;
  --smart-gauge-needle-color: #{createThemeVar("backgroundColor-Gauge-needle")};
  // ...
}
```

The `@use` path is `"xmlui/themes.scss"` — not a relative path into the xmlui source tree.

If the library styles via JS config objects (like ECharts), use `useTheme()` in the render component instead:

```tsx
import { useTheme } from "xmlui";

export const EChartRender = forwardRef((props, ref) => {
  const theme = useTheme();
  const colors = theme.themeVars;
  // Inject colors into the ECharts option object
});
```

## Import rewrites

When moving a component from the xmlui source tree into an extension package, rewrite all internal imports to `"xmlui"`:

| Original (in-tree) | Extension package |
|---|---|
| `from "../../components-core/wrapComponent"` | `from "xmlui"` |
| `from "../metadata-helpers"` | `from "xmlui"` |
| `from "../../components-core/theming/themeVars"` | `from "xmlui"` |
| `from "../../components-core/theming/ThemeContext"` | `from "xmlui"` |
| `from "../Tooltip/TooltipNative"` | `from "xmlui"` |
| `@use "../../components-core/theming/themes" as t` | `@use "xmlui/themes.scss" as t` |

## Building

```bash
cd packages/xmlui-echart
npm install
npm run build:extension
```

This produces `dist/xmlui-echart.js` (UMD) and `dist/xmlui-echart.mjs` (ESM).

## Deploying to a standalone app

Copy the UMD file and add a `<script>` tag:

```bash
cp packages/xmlui-echart/dist/xmlui-echart.js ~/my-app/xmlui/
```

```html
<!-- index.html -->
<script src="xmlui/xmlui-standalone.umd.js"></script>
<script src="xmlui/xmlui-echart.js"></script>
```

The standalone bundle must load first — it sets `window.xmlui` which the extension packages need at load time.

## How auto-registration works

When `xmlui build-lib` produces the UMD, it appends a footer:

```js
window.xmlui.standalone.registerExtension({
  namespace: "XMLUIExtensions",
  components: [echartComponentRenderer],
});
```

The standalone bundle's `index-standalone.ts` sets up the global:

```js
window.xmlui = { ...xmluiExports, standalone: Xmlui };
```

This serves two purposes:
1. **Module resolution** — Rollup maps `import { createMetadata } from "xmlui"` to `window.xmlui.createMetadata`. This runs at UMD evaluation time, before registration.
2. **Extension registration** — The footer calls `window.xmlui.standalone.registerExtension(...)` to add the component to the XMLUI runtime. `ComponentProvider` subscribes to the extension manager and replays registrations.

## Excluding from the core build

If a wrapped component was previously built into the core standalone bundle, exclude it with an env var in `ComponentProvider.tsx`:

```ts
if (process.env.VITE_USED_COMPONENTS_EChart !== "false") {
  this.registerCoreComponent(echartComponentRenderer);
}
```

Set the env var to `"false"` when building standalone to remove the component and its dependency chain from the core bundle.

## Current extension packages

| Package | Component tag | Third-party deps | Bundle size |
|---|---|---|---|
| xmlui-echart | `<EChart>` | echarts, echarts-for-react | 1.1 MB |
| xmlui-gauge | `<Gauge>` | smart-webcomponents-react | 2.4 MB |
| xmlui-tiptap-editor | `<TiptapEditor>` | @tiptap/react + 9 extensions | 545 KB |
| xmlui-slider | `<SliderW>` | @radix-ui/react-slider | 30 KB |
| xmlui-knob | `<Knob>` | react-knob-headless | 29 KB |
| xmlui-code-editor | `<CodeEditor>` | @monaco-editor/react | 16 KB |
