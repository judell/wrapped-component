# Improving Recharts: useContainerSize Experiment

## Hypothesis

The 7 sizing/layout commits in BarChartNative.tsx (~570 lines) are largely fighting Recharts' `ResponsiveContainer`, which measures its parent DOM element and races with XMLUI's layout engine. Replacing `ResponsiveContainer` with explicit dimensions from a `ResizeObserver` may eliminate most of this complexity.

## Experiment

1. Create a `useContainerSize()` hook — returns `{ width, height }`, backed by ResizeObserver with debounce. No grander abstraction.

2. Retrofit BarChartNative.tsx: remove `ResponsiveContainer`, use `<BarChart width={w} height={h}>` with dimensions from the hook.

3. Test in the scenarios that generated bug fixes: charts in Table cells, sidebar toggle, window resize, stacked bars.

4. If it works, repeat for LineChartNative, PieChartNative.

5. If it keeps working across libraries, extract as a shared utility. Only then consider whether it earns a name like LayoutBridge.

## What this doesn't solve

- Tick label measurement and margin calculation — this is Recharts-specific logic that may still be needed
- Chart-specific layout quirks (stacked bar offsets, pie label positioning)
- The ~340 lines of tick rendering code

## On the judell/wrap-component branch

This work would happen on the existing branch alongside the other wrapping improvements.
