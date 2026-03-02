# Wrapping plan: next phase

## TL;DR: what just happened

We built a component-wrapping pipeline for XMLUI that eliminates hand-written boilerplate, adds automatic state lifecycle management, CSS and option-level theming bridges, and semantic trace/event capture for opaque third-party libraries.

The key abstractions are:

- **`wrapComponent`** — generates the XMLUI renderer from a declarative config. Props forward by default; you declare only the exceptions (booleans, events, renames).

- **`wrapCompound`** — adds generic state lifecycle on top of `wrapComponent`. It handles `initialValue` parsing, external value sync, `updateState`, and API registration. Your render component is pure React: it receives `value`, `onChange`, `registerApi` and knows nothing about XMLUI.

- **`captureNativeEvents`** — bridges library-internal events into XMLUI's trace system. For opaque surfaces (canvas charts, rich-text transaction layers), this is the only way to see what happened inside the component.

Each wrapped component ships as an **extension package** — an independent UMD `.js` file that auto-registers via a script tag. Apps include only the extensions they need. The core standalone dropped from ~13MB to ~5MB; each extension bundles only its own third-party dependencies.

Six components are wrapped and shipping as extensions: EChart, Gauge, TiptapEditor, CodeEditor, Slider, Knob. The wrapping procedure is documented in [EXTENSION_PACKAGING.md](EXTENSION_PACKAGING.md).

## What this unlocks

XMLUI can now wrap arbitrary React component libraries with:

- No hand-written renderer boilerplate
- Automatic prop forwarding (no silent drops)
- Generic state lifecycle (no duplicated plumbing)
- CSS-level theming (for libraries with CSS custom properties)
- Option-level theming (for libraries that style via JS config)
- Semantic native-event capture (for opaque/canvas-based libraries)
- Independent packaging (each component is a separate CDN-hostable JS file)

The question is: **what should we wrap next, and in what order?**

## Selection criteria

Prioritize by: **pattern value x popularity x strategic fit**

For each candidate, consider:

| Dimension | What to ask |
|---|---|
| **State model** | Controlled/uncontrolled? Async? Range values? Large internal state? |
| **Portal / overlay** | Popovers, menus, drawers, focus traps? |
| **Theming mode** | Tailwind tokens? CSS-vars bridge? Runtime option injection? Vendor-owned styles? |
| **Opacity** | Are semantics visible in DOM/ARIA, or hidden behind canvas/editors/engines? |
| **Data gravity** | Server interaction? Virtualization? Uploads? Streaming? |
| **API shape** | Does solving it yield a reusable XMLUI wrapping pattern? |

The goal is not to wrap the most components. It is to **sample the major integration shapes** so the team builds general-purpose wrapper machinery.

## Two buckets

### Bucket A: upgrade existing XMLUI components

XMLUI already ships Table, DatePicker, AutoComplete, Select, FileUploadDropZone, Slider, and many others. Several of these would benefit from rewrapping with the new mechanism:

| Component | Why rewrap |
|---|---|
| **Table** (TanStack Table) | Highest leverage. Headless engine + new wrapper = better prop coverage, state normalization, semantic trace events (sort:change, filter:change, page:change, selection:change, row:expand). See detailed notes below. |
| **DatePicker** | Date/time semantics are subtle. Timezone handling, range selection, presets, locale — rewrapping is a chance to define a stronger XMLUI contract. |
| **AutoComplete / Select** | Searchable popup compounds with trigger + list + filter + selection. Good test of overlay/focus behavior in the new wrapper model. |
| **FileUploadDropZone** | Upload flows have async/progress/error state that benefits from a stronger wrapper. Event vocabulary: queued, uploading, progress, complete, error, remove. |

### Bucket B: add new pattern coverage

These are libraries not currently in the XMLUI catalog that would teach the team new integration patterns.

## Tier 1: recommended next wraps

### 1. D3

What it is: the canonical low-level JavaScript library for bespoke data visualization — scales, layouts, transitions, selections, brushing, zooming. Not a widget; a construction kit.

What it teaches XMLUI: the hardest visualization case. How do you wrap something that is mostly imperative DOM/SVG manipulation rather than a packaged component? Likely approach: wrap specific high-value D3 patterns (force graph, sankey, timeline with brush/zoom) rather than a generic "D3 wrapper."

Pattern: **visualization toolkit integration** — imperative rendering, imposed semantics, SVG/canvas hybrid.

Popularity: very high. Cultural standard for custom data viz.

Risk: medium-high. Easy to scope too broadly. Pick one D3 pattern and nail it.

### 2. MapLibre / react-map-gl

What it is: MapLibre GL JS is a WebGL map engine for interactive vector-tile maps. react-map-gl is the React wrapper layer, supporting both MapLibre and Mapbox GL JS. It gives you a controlled React surface over the map engine: viewport state, sources, layers, markers, popups, controls.

What it teaches XMLUI: engine-backed interactive surface with rich event/state semantics — viewport:change, marker:click, popup:open, layer:toggle, bounds:change. Maps style via map style specs rather than CSS or JS config, which is a new theming axis. Natural next test of native-event capture after ECharts.

Pattern: **opaque spatial engine** — WebGL rendering, external tiles/assets, portal-based markers/popups.

Popularity: high. Maps are common in business apps.

Risk: medium. Well-scoped if you start with basic map + markers + events.

### 3. dnd-kit

What it is: a modern drag-and-drop toolkit for React. Built around DndContext, sensors (pointer, keyboard, touch), sortable helpers, collision detection, and accessibility support. Not the older HTML5 drag-and-drop model.

What it teaches XMLUI: interaction engine wrapping. Drag/drop is not "another widget" — it is a gesture/state system with meaningful semantic transitions: drag:start, drag:over, drag:end, reorder, cancel. It has an explicit accessibility story with keyboard interaction and screen-reader announcements. XMLUI can impose a much cleaner declarative model than raw React composition.

Pattern: **gesture/interaction engine** — sensor abstraction, collision strategies, semantics derived from motion.

Popularity: high. Sortable lists, kanban boards, reorderable layouts are common.

Risk: low-medium. Well-defined scope; clear demo targets (sortable list, kanban board).

### 4. Lexical

What it is: Meta's extensible text editor framework. Built around editor state, nodes (RootNode, ElementNode, TextNode, DecoratorNode), commands, and plugins. Emphasizes reliability, accessibility, and performance.

What it teaches XMLUI: a different rich-text architecture from Tiptap/ProseMirror. Tiptap taught transaction-based event bridging; Lexical teaches node/editor-state/plugin-based integration. The comparison is high learning value: what should XMLUI normalize across editor frameworks, and what should remain library-specific?

Pattern: **alternate editor engine** — editor-state-driven integration, plugin architecture, command/selection semantics.

Popularity: high and growing. Meta-backed, increasingly adopted.

Risk: medium. Scoped well if you target the same capabilities as the existing Tiptap wrap.

### 5. React Hook Form

What it is: a form-state and validation engine. Provides useForm, field registration, submission state, validation integration via resolver ecosystem, and context helpers (FormProvider, useFormContext). Works with native inputs and schema validation libraries.

What it teaches XMLUI: form-state orchestration — touched/dirty/valid/invalid, field registration, submission lifecycle, schema validation, nested forms. This is less "wrap a widget" and more "learn from or interoperate with a dominant form-state model."

Pattern: **form-state engine** — validation lifecycle, field contracts, schema binding.

Popularity: very high. One of the dominant React form solutions.

Risk: low. But treat it as a design/reference influence rather than a literal component wrap. The question is whether XMLUI Form should adopt RHF-like semantics, not whether to wrap RHF as a component.

## Tier 2: important but more expensive or overlapping

| Library | What it is | Pattern | Notes |
|---|---|---|---|
| **AG Grid** | Full-featured data grid engine | Heavyweight grid with virtualization, editing, grouping | Consider after Table rewrap if TanStack coverage is insufficient |
| **React Aria / React Aria Components** | Adobe's accessibility-first primitive library | Headless accessible widgets | Good reference for XMLUI's ARIA story; may overlap with existing Radix-based components |
| **MUI** | Major React design system | Token/theme-provider integration, css-in-js interop | Pick 1-2 representative components, not the whole system |
| **Ant Design** | Major enterprise React design system | Token system, css-in-js | Same approach — representative components only |

## Tier 3: later or specialized

| Library | What it is | Pattern | Notes |
|---|---|---|---|
| **Leaflet / react-leaflet** | Classic open-source map library | Tile-based maps with plugin ecosystem | Consider if MapLibre is too heavy; simpler but less modern |
| **react-three-fiber** | Declarative React renderer for Three.js | 3D scene graph, non-DOM rendering | Very distinct pattern; strong demo value; niche |
| **AI chat / tool UI kits** | assistant-ui, Tool UI, AI Elements from shadcn orbit | Streaming state, tool-result rendering, agent workflows | Strategically important for XMLUI but easy to sprawl; phase 2 |

## Deep dive: rewrapping Table

XMLUI already wraps TanStack Table as its Table component. TanStack Table is headless — it provides table logic/state (sorting, filtering, grouping, pagination, selection, expansion) but no DOM or styles. That makes it unusually well-suited to the new wrapper architecture.

### Why rewrap

1. **Prop coverage.** The hand-written wrapper likely has an explicit prop forwarding list. The new mechanism forwards by default, reducing silent feature omissions for sorting, filtering, pagination, grouping, selection, expansion, column visibility, pinning.

2. **State normalization.** Tables have a lot of internal and external state. A new wrapper can establish a cleaner XMLUI contract for which state is controlled by XMLUI, which is internal by default, which is externally settable, and which is exposed through APIs or emitted as events.

3. **Semantic tracing.** This is probably the biggest win. A rewrapped Table could emit:
   - `sort:change` — column, direction
   - `filter:change` — column, value
   - `page:change` — page number, page size
   - `selection:change` — selected row IDs
   - `columnVisibility:change` — column, visible/hidden
   - `row:expand` — row ID, expanded/collapsed
   - `row:activate` — row ID

4. **Cleaner render separation.** Push XMLUI lifecycle/plumbing into the generic wrapper; keep the React render layer focused on header groups, row rendering, cell rendering, empty/loading states, and styling hooks.

5. **Stronger XMLUI-level abstraction.** TanStack Table is powerful but low-level. Rewrapping is a chance to decide what XMLUI Table semantics really are:
   - Simple mode: `data` + `columns`
   - Richer mode: sortable/filterable/pageable options
   - High-value APIs: `setFilter`, `clearFilters`, `setSorting`, `goToPage`, `selectRow`
   - Semantic events rather than TanStack internals leaking out

### Approach

**Phase A:** Document the current XMLUI Table — props, events, APIs, internal state handling, gaps.

**Phase B:** Map onto the new wrapper architecture — what belongs in generic wrapper machinery, what belongs in a TableRender, what belongs in XMLUI-specific metadata/config.

**Phase C:** Define the semantic event model and rewrap.

## Recommended sequence

If the goal is maximum learning for minimum work:

1. **Table rewrap** — highest leverage; immediate product impact; proves the wrapper architecture on an existing high-value component
2. **D3** (one specific pattern, e.g. force graph or timeline) — hardest visualization case; teaches toolkit integration
3. **MapLibre** — opaque spatial engine; extends native-event capture to a new domain
4. **dnd-kit** — interaction engine; distinct pattern from everything else
5. **Lexical** — comparative editor test; validates that the wrapper model generalizes across editor architectures
6. **React Hook Form** — design reference track; influences XMLUI Form semantics

After each, ask: **what new wrapper primitives fell out?**

Expected discoveries:

- portal/overlay tracing patterns
- value normalization for domain objects (dates, geo coordinates, editor state)
- async progress state patterns
- native-event bridging for engine-backed views
- theme bridges across Tailwind, CSS vars, runtime APIs, and map style specs
