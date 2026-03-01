# Selective bundling

XMLUI ships a monolithic `xmlui-standalone.umd.js` that includes every component. Today that's ~4.7MB. On the `judell/wrap-component` branch, which adds TipTap, ECharts, Gauge, and other wrapped libraries, it's 9.4MB — and the catalog will keep growing. Selective bundling decouples catalog size from app size: each app gets a bundle containing only what it uses.

Tested end-to-end on four apps: wrapped, community-calendar, core-ssh-server-ui, and myWorkDrive-Client.

## Why standalone is the default mode

Unless you're hacking the XMLUI engine itself, there's no reason to run the Vite dev server. The dev server exists for engine developers who need HMR while modifying React components, the parser, or the renderer. Everyone else — app developers writing `.xmlui` files — should be in standalone mode. Your app doesn't hot-reload, but it refreshes on every browser reload, and you're not paying for a Node toolchain you don't need.

Standalone mode also means you own your bundle. It's one file you drop into your project, version in git, and deploy anywhere a static file server runs. Selective bundling makes that file as small as it can be.

## Who does what

### The XMLUI team (CI)

CI builds the component catalog once per release. The output is a set of pre-built chunks: the XMLUI runtime (React, parser, renderer, state management) plus one chunk per component group. These chunks land in the source tree and flow to app developers through the MCP server's repo cache.

The catalog can include anything: core XMLUI components, wrapped third-party libraries (ECharts, TipTap, Monaco, smart-webcomponents), future additions (D3, Leaflet, etc.). Most of them sit unused in the MCP cache, but they're available if needed.

### The app developer

Runs `xmlui build` in their app directory. The CLI scans `.xmlui` files, identifies which components the app uses, and assembles a bundle with exactly those components. The developer doesn't choose what to include or exclude — the CLI figures it out from the markup.

```bash
xmlui build ~/my-app
cd ~/my-app && xmlui run
```

That's it. No Node, no Vite, no npm, no env vars. The CLI is a single Go binary.

### The engine developer

Occasionally needs to hack the XMLUI core while working on an app. In that case, use the Vite dev server with HMR as before.

## Assembly: the app developer's path

CI pre-builds the entire component catalog as IIFE chunks. The CLI concatenates the runtime plus whichever component chunks the app needs. Pure Go file I/O — no JavaScript toolchain on the developer's machine.

### Why assembly bundles can be larger than monolithic — and why it doesn't matter

The monolithic UMD is one Rollup compilation that tree-shakes across the entire dependency graph. The chunked build shares code via ~160 intermediate chunks (React, router, lodash, etc.), but once converted to self-contained IIFEs there's no cross-chunk dead code elimination — a shared chunk is included whole even if only a fraction of its exports are used. Full assembly of all 86 groups is 12.4MB vs 9.4MB monolithic (32% overhead).

But the win isn't fine-grained tree shaking — it's coarse-grained exclusion. Drop a component group, drop everything only it pulled in. community-calendar excludes 59 groups and lands at 7.4MB because ECharts, TipTap, Monaco, Gauge, and their transitive dependencies are gone entirely.

## Subtraction: the CI path

A CI pipeline that already has Node can do better. Instead of concatenating pre-built chunks, it runs a Vite build with env vars that exclude unused components. Rollup tree-shakes within a single compilation unit, producing the smallest possible bundle. The CLI computes the exclude list; CI passes it to `build-standalone-selective.mjs`.

This is for release pipelines, not for developers sitting at their laptops. An app developer should never need Node installed.

## Measured results

### Assembly (app developer)

| App | Groups used | Excluded | Files included | Bundle | vs Monolithic |
|---|---|---|---|---|---|
| wrapped | 32 | 54 | 147/204 | 13,269 KB | +41% |
| core-ssh-server-ui | 36 | 50 | 145/204 | 5,819 KB | -38% |
| myWorkDrive-Client | 30 | 56 | 135/204 | 5,805 KB | -38% |
| community-calendar | 27 | 59 | 134/204 | 5,457 KB | -42% |

The wrapped app is larger than the monolith because it uses ECharts (2.7MB), TipTap (1.1MB), Gauge (793KB), and Recharts (890KB) — IIFE wrapping adds overhead that tree shaking would otherwise eliminate. The other three apps exclude all heavy third-party libraries and see significant savings.

### Subtraction (CI pipeline)

| App | Groups used | Excludable | Bundle | Savings |
|---|---|---|---|---|
| Baseline (all components) | 86 | 0 | 9,907 KB | -- |
| wrapped | 32 | 54 | 9,746 KB | 161 KB (1.6%) |
| community-calendar | 27 | 59 | 4,649 KB | 5,258 KB (53%) |
| core-ssh-server-ui | 36 | 50 | 4,667 KB | 5,240 KB (53%) |
| myWorkDrive-Client | 30 | 56 | 4,681 KB | 5,226 KB (53%) |

Subtraction produces smaller bundles because Rollup tree-shakes across the entire compilation. This is what a CI release pipeline would use.

## What drives bundle size

The XMLUI runtime (React, React Router, lodash-es, immer, @tanstack/react-query, framer-motion) is always present. It's the shared foundation that all components build on.

The savings come from excluding heavy third-party dependency chains:

- smart-webcomponents-react (Gauge)
- @monaco-editor/react (CodeEditor)
- @tiptap/* + tiptap-markdown (TiptapEditor) — 8 packages, ProseMirror underneath
- recharts (Charts — BarChart, LineChart, PieChart, etc.)
- @radix-ui/* — ~10 packages used by individual components (Slider, Select, Tabs, etc.)

Small XMLUI-native components (Badge, Avatar, Checkbox, etc.) save almost nothing individually because they share dependencies with the rest of the framework. The wins come from dropping entire third-party ecosystems the app doesn't use.

## How the catalog is built

This runs once per release, in CI or by an engine developer.

### 1. Chunked Vite build

```bash
cd ~/xmlui/xmlui
node scripts/generate-chunk-entries.mjs
npx vite build --mode standalone-chunked
node scripts/esm-to-iife.mjs
```

`generate-chunk-entries.mjs` reads `chunk-manifest.json` and produces 86 `register-*.ts` files, each of which imports its component renderers and self-registers via the existing `StandaloneExtensionManager`:

```ts
import { appRenderer } from "../components/App/App";
(window as any).Xmlui?.registerExtension({
  namespace: "#xmlui-core-ns",
  components: [appRenderer],
});
```

This reuses the same pub/sub registration mechanism that XMLUI's packages system uses. ComponentProvider subscribes to the extension manager and replays any registrations that happened before it mounted.

Vite builds the runtime (`xmlui-core`) plus all 86 entry points. Rollup produces shared intermediate chunks (React, router, etc.) as ESM modules.

### 2. ESM-to-IIFE conversion

`esm-to-iife.mjs` converts the ESM chunks to concatenable IIFEs. Each chunk becomes `var _filename_hash = (function() { ... return exports; })();` with unique global names based on the full filename hash. The script also:

- Inlines CSS imports as runtime `<style>` tag injection (matching how the monolithic UMD handles component CSS via `vite-plugin-lib-inject-css`)
- Generates a `css-layer-order.js` bootstrap that injects `@layer reset,base,components,dynamic;` before any component styles — this is critical because CSS layers are ordered by first appearance, and without the explicit declaration, shared chunks that inject `@layer components` CSS before the core would give `components` the lowest priority
- Computes a topological sort and writes:
  - `chunk-order.json` — concatenation order (bootstrap first, then shared chunks and runtime, then component entries)
  - `chunk-deps.json` — dependency graph for selective inclusion

### 3. CSS handling

Each IIFE chunk inlines its CSS imports as runtime `<style>` tag injection — the same mechanism the monolithic UMD uses. The CLI also assembles a `xmlui-standalone.css` file from all chunk CSS files, prepended with the `@layer` order declaration. Apps can optionally load this via a `<link>` tag for faster initial paint, but it's not required since the JS handles CSS injection.

```html
<!-- Both work: -->
<script src="xmlui/xmlui-standalone.umd.js"></script>

<!-- Optional CSS link for faster initial paint: -->
<link rel="stylesheet" href="xmlui/xmlui-standalone.css">
<script src="xmlui/xmlui-standalone.umd.js"></script>
```

Output lands in `dist/chunks/`: ~203 JS files, CSS files, `css-layer-order.js`, `chunk-order.json`, and `chunk-deps.json`.

## How the CLI assembles a bundle

```bash
xmlui build ~/community-calendar
```

The CLI:
1. Scans all `.xmlui` files for component tags (stripping `<Script>` blocks, CDATA, and comments)
2. Maps tags to chunk IDs via `chunk-manifest.json`
3. Computes the transitive closure of dependencies from `chunk-deps.json`
4. Always includes primitives that are invisible to the tag scanner: Fragment, Stack, SpaceFiller, Text, FlowLayout (referenced by name at runtime via `{ type: "Fragment" }` etc.), HtmlTags (HTML elements inside Markdown content), and Link (Markdown renders `<a>` tags as Link components)
5. Always includes the `css-layer-order.js` bootstrap
6. Concatenates the needed chunks in dependency order from `chunk-order.json`
7. Concatenates all CSS files (prepended with `@layer` order declaration)
8. Writes `xmlui-standalone.umd.js` and `xmlui-standalone.css` to the app's `xmlui/` directory

To see what would be included without writing files:

```bash
xmlui build --analyze ~/community-calendar
```

## Component registration

Every XMLUI component registration in `ComponentProvider.tsx` is gated by an env var:

```ts
if (process.env.VITE_USED_COMPONENTS_Gauge !== "false") {
  this.registerCoreComponent(gaugeComponentRenderer);
}
```

In the chunked build, ALL component env vars are set to `"false"`. The core contains only the framework runtime. Each component registers itself via its chunk entry point.

The `chunk-manifest.json` maps every XMLUI tag name to its group and env var:

- `tagToChunk`: maps tag names to group IDs (e.g., `"Stack" → "stack"`, `"VStack" → "stack"`)
- `chunkEnvVars`: maps group IDs to env vars (e.g., `"stack" → "VITE_USED_COMPONENTS_Stack"`)
- `infrastructureTags`: engine plumbing (DataSource, AppState, Component, Script, etc.) — always present, not selectable

When a new component is added to `ComponentProvider.tsx`, the developer adds an env var guard and updates `chunk-manifest.json`. The manifest mirrors the registration code.

## Distribution: MCP server as the channel

The MCP server caches the xmlui repo locally:

- macOS: `~/Library/Caches/xmlui/xmlui-mcp/xmlui-repos/xmlui@<version>/xmlui/`
- Linux: `$XDG_CACHE_HOME/xmlui/xmlui-mcp/xmlui-repos/xmlui@<version>/xmlui/`

This cache contains the full source tree, including `scripts/chunk-manifest.json` and `dist/chunks/`. The CLI reads from this cache by default, so when CI builds new chunks and tags a release, app developers get the updated catalog automatically through the MCP server — no CLI rebuild required.

For development with a local xmlui checkout:

```bash
xmlui build --xmlui-dir ~/xmlui/xmlui ~/community-calendar
```

## CI integration

The existing release workflow builds the monolithic standalone bundle. To support selective bundling, CI adds the chunked build:

```yaml
- name: Build component catalog
  run: |
    cd xmlui
    node scripts/generate-chunk-entries.mjs
    npx vite build --mode standalone-chunked
    node scripts/esm-to-iife.mjs
```

The chunked output (`dist/chunks/`) is committed to the source tree and distributed via the MCP server's repo cache. No per-app build step runs in CI — the CLI assembles per-app bundles locally.

## Converting a lib-mode app to standalone

Lib-mode apps import xmlui as an npm dependency and use Vite's dev server. Standalone apps load a pre-built UMD bundle via `<script>` tag. An XMLUI app developer writes `.xmlui` files, not TypeScript — standalone is the natural deployment model.

### Conversion steps

1. **Create `config.json`** from `config.ts` — move `appGlobals`, `resources`, and `defaultTheme` into JSON format.

2. **Create `themes/*.json`** from `themes/*.ts` — convert the TypeScript `ThemeDefinition` to JSON with `name`, `id`, `themeVars`, and `resources` fields.

3. **Add `codeBehind` attributes** — standalone does not auto-discover `.xs` companion files. Every `<Component>` with an `.xs` file needs an explicit attribute:

```xml
<Component name="MyComponent" codeBehind="MyComponent.xmlui.xs">
```

`Main.xmlui.xs` is the exception — standalone auto-discovers it by convention.

4. **Fix relative import paths** — if you reorganize component directories, update `<script>` imports to match.

5. **Link resources** — if resources were under `public/resources/` (served at root by Vite), symlink or copy to `resources/` at the project root.

6. **Swap the entry point** in `index.html`:

```html
<!-- Before (lib mode) -->
<script type="module" src="/index.ts"></script>

<!-- After (standalone — monolithic or selective, same tag) -->
<script src="xmlui/xmlui-standalone.umd.js"></script>
```

### Gotchas

- Bare function calls that worked in lib mode via scope (e.g. `getFileExtension(path)`) may need `window.MwdHelpers.getFileExtension(path)` in standalone — `.xs` scripts run in a different scope.
- `npx http-server .` must be run from the project root, not from `public/`.
- The lib-mode `index.ts` entry point (`import { startApp } from "xmlui"`) and its HMR handling are not needed in standalone.

## Repos and branches

| Repo | Branch | What changes |
|---|---|---|
| **xmlui** | `judell/wrap-component` | `ComponentProvider.tsx` env var guards, `vite.config.ts` standalone-chunked mode, `src/chunks/register-*.ts` (86 entry points), `scripts/esm-to-iife.mjs` (CSS inlining, layer order bootstrap), `scripts/generate-chunk-entries.mjs`, `scripts/chunk-manifest.json`, `src/index-standalone.ts` (tree-shaken core), `src/components-core/StandaloneApp.tsx` (lazy MetadataProvider), `src/components-core/StandaloneExtensionManager.ts` (metadata support) |
| **xmlui-cli** | `judell/standalone-selective-bundler` | `commands/buildcmd/` package (tag scanner, manifest resolver, chunk assembler with always-include primitives and CSS layer order, `xmlui build` subcommand) |
| **myWorkDrive-Client** | `judell/standalone` | Lib-to-standalone conversion |
| **wrapped**, **community-calendar**, **core-ssh-server-ui** | `main` | Unchanged — consumers of the optimized bundle |
