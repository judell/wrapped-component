# Standalone selective bundling

The monolithic `xmlui-standalone.umd.js` (9.9MB) includes every XMLUI component. Most apps use a fraction of them. Selective bundling produces a smaller file containing only what the app needs.

## How it works

Every XMLUI component registration in `ComponentProvider.tsx` is gated by an env var:

```ts
if (process.env.VITE_USED_COMPONENTS_Gauge !== "false") {
  this.registerCoreComponent(gaugeComponentRenderer);
}
```

Setting `VITE_USED_COMPONENTS_Gauge=false` before `vite build --mode standalone` eliminates the Gauge component and, through tree shaking, its entire dependency chain (smart-webcomponents-react). The `vite.config.ts` standalone mode passes `VITE_USED_COMPONENTS_*` env vars through to the define block so they take effect at build time.

There are 86 component groups, each with its own env var. The `chunk-manifest.json` maps every XMLUI tag name to its group and env var.

## What drives bundle size

The XMLUI runtime (React, React Router, lodash-es, immer, @tanstack/react-query, framer-motion) is always present — it's shared across all components and survives tree shaking. There is no explicit "core" to define; tree shaking naturally retains whatever the included components actually import.

The savings come from eliminating heavy third-party dependency chains:

- smart-webcomponents-react (Gauge)
- @monaco-editor/react (CodeEditor)
- @tiptap/* + tiptap-markdown (TiptapEditor) — 8 packages, ProseMirror underneath
- recharts (Charts — BarChart, LineChart, PieChart, etc.)
- @radix-ui/* — ~10 packages used by individual components (Slider, Select, Tabs, etc.)

Small XMLUI-native components (Badge, Avatar, Checkbox, etc.) save almost nothing individually because they share dependencies with the rest of the framework.

## Measured results

| App | Groups used | Excludable | Bundle | Savings |
|---|---|---|---|---|
| Baseline (all components) | 86 | 0 | 9,907 KB | -- |
| wrapped (heavy) | 32 | 54 | 9,746 KB | 161 KB (1.6%) |
| community-calendar | 27 | 59 | 4,649 KB | 5,258 KB (53%) |
| core-ssh-server-ui | 36 | 50 | 4,667 KB | 5,240 KB (53%) |
| myWorkDrive-Client | 30 | 56 | 4,681 KB | 5,226 KB (53%) |

wrapped uses EChart, TiptapEditor, CodeEditor, Gauge, Slider — all the heavy dependencies — so it can't exclude them. The other three apps use only core XMLUI components and drop to ~4.7MB. All four apps were tested and run correctly with their selective builds.

## Repos and branches

| Repo | Branch | What changes |
|---|---|---|
| **xmlui** | `judell/wrap-component` | `ComponentProvider.tsx` env var guards, `vite.config.ts` env var passthrough, `scripts/build-standalone-selective.mjs`, `scripts/chunk-manifest.json` |
| **xmlui-cli** | `judell/standalone-selective-bundler` | `commands/buildcmd/` package (tag scanner, manifest resolver, `xmlui build` subcommand) |
| **myWorkDrive-Client** | `judell/standalone` | Lib-to-standalone conversion (see below) |
| **wrapped**, **community-calendar**, **core-ssh-server-ui** | `main` | Unchanged — consumers of the optimized bundle |

## Repeatable procedure

### Step 1: Analyze the app

The `xmlui build --analyze` command scans `.xmlui` files, extracts component tags, and maps them to groups via `chunk-manifest.json`. It reports which groups are needed and which can be excluded.

```
cd ~/community-calendar
xmlui build --analyze
```

Output:

```
Analyzing XMLUI files in /Users/jonudell/community-calendar...

Found 48 unique tags → 27 of 86 component groups needed
Excluding 59 unused groups: accordion, accordionitem, avatar, backdrop, ...

--- Analysis Report ---

Required component groups:
  app                  → App
  button               → Button
  card                 → Card
  ...

Excludable groups (59):
  accordion            (VITE_USED_COMPONENTS_Accordion=false)
  avatar               (VITE_USED_COMPONENTS_Avatar=false)
  ...
```

The tag scanner strips `<Script>` blocks, CDATA sections, and XML comments before extracting tags, so inline JavaScript and commented-out markup don't cause false positives. Tags that aren't in the manifest (user-defined components, infrastructure like `AppState`, `DataSource`, `Component`) are reported separately and ignored for bundling.

The CLI is pure Go with no runtime dependencies. The manifest is embedded in the binary via `go:embed`.

### Step 2: Run the selective Vite build

In the xmlui repo, run the selective build script with the excluded groups:

```
cd ~/xmlui/xmlui
node scripts/build-standalone-selective.mjs \
  --exclude accordion,accordionitem,avatar,backdrop,blog,...
```

This script:
1. Reads `scripts/chunk-manifest.json` to map chunk IDs to env var names
2. Sets each excluded group's env var to `"false"` (e.g. `VITE_USED_COMPONENTS_Accordion=false`)
3. Runs `npx vite build --mode standalone`

The `vite.config.ts` standalone mode collects all `VITE_USED_COMPONENTS_*` and `VITE_INCLUDE_*` env vars from `process.env` and injects them into the Vite `define` block:

```ts
const componentEnvVars: Record<string, any> = {};
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("VITE_USED_COMPONENTS_") || key.startsWith("VITE_INCLUDE_")) {
    componentEnvVars[key] = String(value);
  }
}
define = {
  "process.env": {
    NODE_ENV: env.NODE_ENV,
    ...componentEnvVars,
  },
};
```

When `process.env.VITE_USED_COMPONENTS_Gauge` is replaced with `"false"` at build time, the `!== "false"` guard evaluates to `false`, the `registerCoreComponent` call is eliminated as dead code, and Rollup tree-shakes the entire import chain (smart-webcomponents-react in this case).

Output lands in `dist/standalone/xmlui-standalone.umd.js`. UMD format means one file — Rollup can't code-split UMD, so the approach is one build with exclusions, not chunked assembly.

Use `--dry-run` to see the env vars without building:

```
node scripts/build-standalone-selective.mjs --exclude charts,codeeditor --dry-run
```

### Step 3: Deploy the bundle

Copy the output to the app's `xmlui/` directory:

```
cp ~/xmlui/xmlui/dist/standalone/xmlui-standalone.umd.js ~/community-calendar/xmlui/0.12.1.js
```

The filename depends on how the app's `index.html` loads XMLUI. community-calendar uses `<script src="xmlui/0.12.1.js">`, wrapped uses `<script src="xmlui/xmlui-standalone.umd.js">`.

### Step 4: Test

Run the app with `xmlui run` (or any HTTP server like `npx http-server .`) and verify it works.

## Converting a lib-mode app to standalone

Lib-mode apps import xmlui as an npm dependency and use Vite's dev server. Standalone apps load a pre-built UMD bundle via `<script>` tag. An XMLUI app developer writes `.xmlui` files, not TypeScript — standalone is the natural deployment model.

### Conversion steps

1. **Create `config.json`** from `config.ts` — move `appGlobals`, `resources`, and `defaultTheme` into JSON format:

```json
{
  "name": "MyApp",
  "appGlobals": {
    "apiUrl": "http://localhost:8357/api/v3"
  },
  "resources": {
    "favicon": "resources/favicon.ico"
  },
  "defaultTheme": "myTheme"
}
```

2. **Create `themes/*.json`** from `themes/*.ts` — convert the TypeScript `ThemeDefinition` to JSON with `name`, `id`, `themeVars`, and `resources` fields.

3. **Flatten component layout** — standalone expects `Main.xmlui` at the project root and all components flat in `components/`. If the lib-mode app has subdirectories like `components/filesView/FilesTableView.xmlui`, move the files up to `components/FilesTableView.xmlui`.

4. **Add `codeBehind` attributes** — standalone does not auto-discover `.xs` companion files. Every `<Component>` with an `.xs` file needs an explicit attribute:

```xml
<Component name="MyComponent" codeBehind="MyComponent.xmlui.xs">
```

`Main.xmlui.xs` is the exception — standalone auto-discovers it by convention.

5. **Fix relative import paths** — flattening changes the directory depth. Update `<script>` imports:

```xml
<!-- Before (in subdirectory) -->
<script>
  import { myFunc } from "../../shared.xs";
</script>

<!-- After (flat in components/) -->
<script>
  import { myFunc } from "../shared.xs";
</script>
```

6. **Link resources** — if resources were under `public/resources/` (served at root by Vite), symlink or copy to `resources/` at the project root.

7. **Swap the entry point** in `index.html`:

```html
<!-- Before -->
<script type="module" src="/index.ts"></script>

<!-- After -->
<script src="xmlui/xmlui-standalone.umd.js"></script>
```

8. **Copy the standalone UMD bundle** into `xmlui/`.

### Gotchas

- Bare function calls that worked in lib mode via scope (e.g. `getFileExtension(path)`) may need `window.MwdHelpers.getFileExtension(path)` in standalone — `.xs` scripts run in a different scope.
- `npx http-server .` must be run from the project root, not from `public/`.
- The lib-mode `index.ts` entry point (`import { startApp } from "xmlui"`) and its HMR handling are not needed in standalone.

## Development escape hatch: `--chunks-dir`

The CLI embeds a copy of `chunk-manifest.json` (and eventually the core bundle and chunk files) via Go's `go:embed`. This is what ships to users. During development, you can bypass the embedded files and point the CLI at a local directory:

```
xmlui build --chunks-dir ~/xmlui/xmlui/scripts ./my-app
```

The `readFile` function in `build.go` checks `ChunksDir` first:

```go
func readFile(chunksDir string, name string) ([]byte, error) {
    if chunksDir != "" {
        return os.ReadFile(filepath.Join(chunksDir, name))
    }
    return embeddedFiles.ReadFile("embedded/" + name)
}
```

This lets you iterate on the manifest or build artifacts in the xmlui repo without recompiling the CLI.

## MCP server and the repo cache

The `xmlui mcp` subcommand starts the XMLUI MCP server, which caches the xmlui repo locally. The cache lives at:

- macOS: `~/Library/Caches/xmlui/xmlui-mcp/xmlui-repos/xmlui@<version>/`
- Linux: `$XDG_CACHE_HOME/xmlui/xmlui-mcp/xmlui-repos/xmlui@<version>/`

The MCP server downloads the repo from GitHub on first use (or when a new version is requested), validates it (checks for `/docs` and `/xmlui` subdirs), and stores it atomically with file-based locking. An LRU policy keeps at most 5 cached versions.

This cache contains the full source tree — including `scripts/chunk-manifest.json` and `scripts/build-standalone-selective.mjs`. The CLI can use `--chunks-dir` to point at the cached repo's `scripts/` directory, making the MCP server the distribution channel for manifest updates without requiring a CLI rebuild.

```
# Use the manifest from the MCP server's cached repo
xmlui build --chunks-dir ~/Library/Caches/xmlui/xmlui-mcp/xmlui-repos/xmlui@0.12.4/xmlui/scripts ./my-app
```

The MCP server can be started with a specific version:

```
xmlui mcp --xmlui-version 0.12.4
```

## How this works in the GitHub Actions release

The existing `release-packages.yml` workflow in the xmlui repo already builds the standalone bundle and uploads it as a release asset:

```yaml
- name: Prepare standalone js file
  run: |
    XMLUI_VERSION=$(jq -r .version xmlui/package.json)
    STANDALONE_FILENAME="xmlui-${XMLUI_VERSION}.js"
    cp xmlui/dist/standalone/xmlui-standalone.umd.js $STANDALONE_FILENAME

- name: Upload standalone js file
  uses: softprops/action-gh-release@v1
  with:
    files: "${{ steps.prepare_standalone.outputs.filename }}"
    tag_name: xmlui@${{ steps.prepare_standalone.outputs.version }}
```

Today this builds the full 9.9MB bundle. To produce a selective build for a specific app, the workflow would:

1. Run `xmlui build --analyze` against the app to get the exclude list
2. Pass the exclude list to `build-standalone-selective.mjs`
3. Upload the result as a release asset (or deploy it directly)

This can be tested on the feature branches (`judell/wrap-component` in xmlui, `judell/standalone-selective-bundler` in xmlui-cli) by triggering the workflow from those branches. Branch-based workflows can deposit artifacts back into the repo or as release assets tagged with the branch name.

## Building and testing the CLI locally

```
# Build the CLI from the feature branch
cd ~/xmlui-cli
git checkout judell/standalone-selective-bundler
go build -o xmlui-test .

# Analyze an app
./xmlui-test build --analyze ~/community-calendar

# Analyze with a local manifest (dev escape hatch)
./xmlui-test build --analyze --chunks-dir ~/xmlui/xmlui/scripts ~/community-calendar
```

The CLI binary has no runtime dependencies — the manifest is compiled in via `go:embed`. The `--chunks-dir` flag overrides this for development.

## Running a selective build end to end

```bash
# 1. Analyze
cd ~/xmlui-cli
./xmlui-test build --analyze ~/community-calendar 2>&1 | grep "^Excluding"
# Excluding 59 unused groups: accordion,accordionitem,avatar,...

# 2. Build (in the xmlui repo, on the judell/wrap-component branch)
cd ~/xmlui/xmlui
node scripts/build-standalone-selective.mjs \
  --exclude accordion,accordionitem,avatar,backdrop,blog,carousel,carouselitem,changelistener,charts,codeeditor,colorpicker,contentseparator,datepicker,echart,emojiselector,fileinput,fileuploaddropzone,flowlayout,formsection,gauge,hovercard,htmltags,iframe,image,includemarkup,markdown,nestedapp,noresult,option,pagemetatitle,pagination,positionedcontainer,progressbar,qrcode,queue,radiogroup,ratinginput,realtimeadapter,redirect,responsivebar,scrollviewer,selectionstore,slider,spacefiller,splitter,stickybox,switch,textarea,tiptapeditor,toast,tonecontrols,tree,treedisplay

# 3. Deploy
cp dist/standalone/xmlui-standalone.umd.js ~/community-calendar/xmlui/0.12.1.js

# 4. Test
cd ~/community-calendar
xmlui run
```
