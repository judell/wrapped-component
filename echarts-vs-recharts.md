# ECharts vs Recharts: Two Wrapping Strategies

## The Recharts approach: abstract the library

XMLUI's Recharts wrappers provide 6 separate components (BarChart, LineChart, PieChart, AreaChart, RadarChart, DonutChart), each with its own Native file, its own sizing logic, its own tick rendering code. The commit history shows ~40 commits touching the Native layer, roughly 70% addressing sizing, layout, and tick measurement — the impedance mismatch between Recharts' container measurement and XMLUI's layout engine.

The wrappers abstract away Recharts' API behind XMLUI-specific props (`dataKeys`, `xKey`, `hideX`, `tickFormatterY`). Every feature needs explicit support, every missing prop is a silent drop, and the wrapper author has to anticipate what users will need. You still can't do a composite chart, can't control per-series colors, can't add click handlers.

## The EChart approach: pass through the library

One component, 187 lines total across 3 files. The XMLUI author gets the entire ECharts API — every chart type (bar, line, pie, scatter, radar, tree, sankey, heatmap, funnel, candlestick...) through a single `option` prop. The wrapper only adds two things: theming and resize handling.

Theme colors are injected automatically via `useTheme()`. Any color the user specifies in the option overrides the theme default. A `ResizeObserver` handles container-aware resizing.

## The tradeoff

The XMLUI author needs to know ECharts' option syntax. With Recharts, you write `<BarChart data="{d}" yKeys="revenue,expenses" />`. With EChart, you write the option object. ECharts has excellent documentation, but it's more to learn. User-defined components are a great way to bridge the gap — `SimpleBarChart`, `SimpleLineChart`, and `SimplePieChart` each map a simple `data`/`xKey`/`yKeys` API to an ECharts option in a single `.xmlui` file, giving you Recharts-level simplicity backed by ECharts. When you outgrow them, the full API is one `option` prop away.

## The sizing story

The Recharts wrappers reimplemented container measurement in every Native file. That's where 70% of the bug-fix commits went:

- `BarChart - size management` (#1657) — +171/-107 lines
- `Bar- & LineChart sizing in Table` (#1546) — +105/-82
- `line & barchart not fitting in Table` (#1972) — +60/-38
- `LineChart - sizing issue` (#1933) — +8/-5
- `height properly applies to Pie- & DonutChart` (#1480) — +40/-36
- `LineChart, PieChart - layout issues` (#1316) — +23/-6
- `line/bar chart spacing` (#2280) — +49/-33

The EChart wrapper uses one `ResizeObserver` and it just works. This strongly supports the LayoutBridge hypothesis in PENDING.md: the problem isn't library-specific, it's a generic container-measurement challenge that should be solved once.

## What this suggests for wrapper design

The pass-through pattern (expose the library's native API, add theming and resize handling) scales better than the abstraction pattern (rewrite the API in XMLUI-specific props). It eliminates the "silently dropped props" problem, eliminates per-component sizing code, and gives users the full power of the underlying library.

The abstraction pattern makes sense when you want to simplify a complex API for a specific use case. But if the library already has a good API (ECharts' option object is well-documented and declarative), wrapping it thinly and adding XMLUI integration is both less work and more capable.
