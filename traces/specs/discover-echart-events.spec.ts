/**
 * Playwright spec to exercise eCharts interactions and discover events.
 * Run: ./test.sh spec discover-echart-events --video
 *
 * Requires the app to be running and the discovery monkey-patch to be
 * active in EChartRender.tsx.
 *
 * Collects:
 * 1. Unknown events from [xs:echart-discovery] console logs
 * 2. Known events from the trace system (_xsLogs)
 *
 * Results are written to traces/runs/echart-discovery-results.json
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const RENDER_WAIT = 2000;
const ACTION_WAIT = 150;

test.setTimeout(240_000);

// ── Helpers to get eCharts instance via React fiber ──────────────────

/** Reusable script fragment: find eCharts instance from canvas index */
const FIND_INSTANCE = `
  function findInstance(i) {
    const canvas = document.querySelectorAll("canvas")[i];
    if (!canvas) return null;
    let container = canvas.parentElement;
    while (container) {
      if (container.getAttribute && container.getAttribute("_echarts_instance_")) break;
      container = container.parentElement;
    }
    if (!container) return null;
    const key = Object.keys(container).find((k) => k.startsWith("__reactFiber$"));
    if (!key) return null;
    let fiber = container[key];
    for (let depth = 0; fiber && depth < 20; depth++) {
      const ref = fiber.ref?.current || fiber.stateNode;
      if (ref?.getEchartsInstance) return ref.getEchartsInstance();
      fiber = fiber.return;
    }
    return null;
  }
`;

/** Dispatch an action on the eCharts instance at canvas index */
async function dispatchAction(page: any, idx: number, action: any) {
  try {
    return await page.evaluate(
      ({ i, act, script }: any) => {
        eval(script);
        const inst = (findInstance as any)(i);
        if (inst?.dispatchAction) { inst.dispatchAction(act); return true; }
        return false;
      },
      { i: idx, act: action, script: FIND_INSTANCE },
    );
  } catch (_) { return false; }
}

/** Get option metadata from eCharts instance */
async function getOptionInfo(page: any, idx: number): Promise<any> {
  return page.evaluate(
    ({ i, script }: any) => {
      eval(script);
      const inst = (findInstance as any)(i);
      if (!inst?.getOption) return null;
      const opt = inst.getOption();
      return {
        hasLegend: !!opt?.legend?.length,
        legendItems:
          opt?.legend?.[0]?.data ||
          opt?.series?.map((s: any) => s.name).filter(Boolean) || [],
        seriesCount: opt?.series?.length || 0,
        hasVisualMap: !!opt?.visualMap?.length,
        hasDataZoom: !!opt?.dataZoom?.length,
        hasTimeline: !!opt?.timeline,
        hasToolbox: !!opt?.toolbox,
        hasBrush: !!opt?.brush,
        seriesTypes: [...new Set(opt?.series?.map((s: any) => s.type) || [])],
      };
    },
    { i: idx, script: FIND_INSTANCE },
  );
}

// ── Exercise functions ───────────────────────────────────────────────

async function exerciseLegend(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.hasLegend || !info.legendItems.length) return;
  for (const name of info.legendItems) {
    await dispatchAction(page, idx, { type: "legendToggleSelect", name });
    await page.waitForTimeout(ACTION_WAIT);
    await dispatchAction(page, idx, { type: "legendToggleSelect", name });
    await page.waitForTimeout(ACTION_WAIT);
  }
}

async function exerciseDataZoom(page: any, idx: number) {
  await dispatchAction(page, idx, { type: "dataZoom", start: 20, end: 80 });
  await page.waitForTimeout(ACTION_WAIT);
  await dispatchAction(page, idx, { type: "dataZoom", start: 0, end: 100 });
  await page.waitForTimeout(ACTION_WAIT);
}

async function exerciseSelection(page: any, idx: number) {
  await dispatchAction(page, idx, { type: "highlight", seriesIndex: 0, dataIndex: 0 });
  await dispatchAction(page, idx, { type: "select", seriesIndex: 0, dataIndex: 0 });
  await dispatchAction(page, idx, { type: "unselect", seriesIndex: 0, dataIndex: 0 });
  await dispatchAction(page, idx, { type: "downplay", seriesIndex: 0, dataIndex: 0 });
  await page.waitForTimeout(ACTION_WAIT);
}

async function exerciseTooltip(page: any, idx: number) {
  try {
    await page.evaluate(
      ({ i, script }: any) => {
        eval(script);
        const inst = (findInstance as any)(i);
        if (!inst?.dispatchAction) return;
        try {
          inst.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: 0 });
          inst.dispatchAction({ type: "hideTip" });
        } catch (_) {}
      },
      { i: idx, script: FIND_INSTANCE },
    );
  } catch (_) {}
  await page.waitForTimeout(100);
}

async function exerciseVisualMap(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.hasVisualMap) return;
  await dispatchAction(page, idx, { type: "selectDataRange", selected: [20, 80] });
  await page.waitForTimeout(ACTION_WAIT);
  await dispatchAction(page, idx, { type: "selectDataRange", selected: [0, 50] });
  await page.waitForTimeout(ACTION_WAIT);
  await dispatchAction(page, idx, { type: "selectDataRange", selected: [0, 100] });
  await page.waitForTimeout(ACTION_WAIT);
}

/** Click toolbox icons by targeting the top-right corner of the chart */
async function exerciseToolbox(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.hasToolbox) return;

  const canvas = page.locator("canvas").nth(idx);
  const box = await canvas.boundingBox();
  if (!box) return;

  console.log(`  [toolbox] dispatching magicType and restore`);
  // Don't pixel-click toolbox icons — dataView opens a modal overlay that
  // blocks all further interaction. Use dispatchAction instead.
  await dispatchAction(page, idx, { type: "magicType", seriesType: "bar" });
  await page.waitForTimeout(ACTION_WAIT);
  await dispatchAction(page, idx, { type: "magicType", seriesType: "line" });
  await page.waitForTimeout(ACTION_WAIT);
  await dispatchAction(page, idx, { type: "restore" });
  await page.waitForTimeout(ACTION_WAIT);
}

/** Drag graph nodes and pan/zoom to trigger graph events */
async function exerciseGraphNodes(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.seriesTypes?.includes("graph")) return;

  const canvas = page.locator("canvas").nth(idx);
  const box = await canvas.boundingBox();
  if (!box) return;

  // Drag at positions where nodes are likely rendered (center area of the graph)
  // Force layout places nodes semi-randomly, so we sweep a grid
  console.log(`  [graph] dragging at node positions`);
  const nodePositions = [
    [0.3, 0.3], [0.5, 0.4], [0.7, 0.5], [0.4, 0.6], [0.6, 0.3],
  ];
  for (const [xf, yf] of nodePositions) {
    const startX = box.x + box.width * xf;
    const startY = box.y + box.height * yf;
    await page.mouse.move(startX, startY);
    await page.waitForTimeout(50);
    await page.mouse.down();
    await page.mouse.move(startX + 40, startY + 30, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(ACTION_WAIT);
  }

  // Pan the whole graph (graphroam)
  console.log(`  [graph] panning to trigger graphroam`);
  const panStartX = box.x + box.width * 0.85;
  const panStartY = box.y + box.height * 0.85;
  await page.mouse.move(panStartX, panStartY);
  await page.mouse.down();
  await page.mouse.move(panStartX - 80, panStartY - 60, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(ACTION_WAIT);

  // Scroll to zoom (graphroam zoom)
  console.log(`  [graph] scrolling to zoom`);
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(ACTION_WAIT);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(ACTION_WAIT);
}

/** Drag the dataZoom slider handle */
async function exerciseDataZoomSlider(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.hasDataZoom) return;

  const canvas = page.locator("canvas").nth(idx);
  const box = await canvas.boundingBox();
  if (!box) return;

  console.log(`  [datazoom] dragging slider handle`);
  // eCharts dataZoom slider sits at the very bottom of the chart.
  // The slider bar is ~30px tall, centered roughly 15px from the bottom edge.
  const sliderY = box.y + box.height - 15;
  // Drag the left handle rightward
  await page.mouse.move(box.x + box.width * 0.05, sliderY);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, sliderY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  // Drag the right handle leftward
  await page.mouse.move(box.x + box.width * 0.95, sliderY);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, sliderY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  // Drag the middle of the slider to pan
  await page.mouse.move(box.x + box.width * 0.5, sliderY);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, sliderY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
}

/** Drag a brush selection on the brush chart */
async function exerciseBrush(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.hasBrush) return;

  const canvas = page.locator("canvas").nth(idx);
  const box = await canvas.boundingBox();
  if (!box) return;

  console.log(`  [brush] dragging rect selection`);
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.7, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(ACTION_WAIT);

  // Clear brush
  await dispatchAction(page, idx, { type: "brush", command: "clear", areas: [] });
  await page.waitForTimeout(ACTION_WAIT);
}

/** Click timeline dots and dispatch timeline actions */
async function exerciseTimeline(page: any, idx: number) {
  const info = await getOptionInfo(page, idx);
  if (!info?.hasTimeline) return;

  const canvas = page.locator("canvas").nth(idx);
  const box = await canvas.boundingBox();
  if (!box) return;

  console.log(`  [timeline] clicking timeline dots`);
  const tlY = box.y + box.height * 0.92;
  for (const xFrac of [0.25, 0.42, 0.58, 0.75]) {
    await page.mouse.click(box.x + box.width * xFrac, tlY);
    await page.waitForTimeout(ACTION_WAIT);
  }

  // Dispatch timeline change programmatically
  for (let ci = 0; ci < 4; ci++) {
    await dispatchAction(page, idx, { type: "timelineChange", currentIndex: ci });
    await page.waitForTimeout(ACTION_WAIT);
  }

  // Play/pause
  await dispatchAction(page, idx, { type: "timelinePlayChange", playState: true });
  await page.waitForTimeout(600);
  await dispatchAction(page, idx, { type: "timelinePlayChange", playState: false });
  await page.waitForTimeout(ACTION_WAIT);
}

/** Full exercise routine for one chart */
async function exerciseChart(page: any, idx: number, label: string) {
  const canvas = page.locator("canvas").nth(idx);
  const box = await canvas.boundingBox();
  if (!box) {
    console.log(`  [${label}] no bounding box, skipping`);
    return;
  }
  console.log(`  [${label}] exercising (${Math.round(box.width)}x${Math.round(box.height)})`);

  // Clicks on data items
  for (const [x, y] of [[0.2, 0.5], [0.5, 0.5], [0.8, 0.5], [0.5, 0.3], [0.5, 0.7]]) {
    await canvas.click({ position: { x: box.width * x, y: box.height * y } });
    await page.waitForTimeout(100);
  }

  // Double-click
  await canvas.dblclick({ position: { x: box.width * 0.5, y: box.height * 0.5 } });
  await page.waitForTimeout(ACTION_WAIT);

  // Common API-driven interactions
  await exerciseLegend(page, idx);
  await exerciseDataZoom(page, idx);
  await exerciseSelection(page, idx);
  await exerciseTooltip(page, idx);
  await exerciseVisualMap(page, idx);

  // Feature-specific interactions
  await exerciseToolbox(page, idx);
  await exerciseGraphNodes(page, idx);
  await exerciseDataZoomSlider(page, idx);
  await exerciseBrush(page, idx);
  await exerciseTimeline(page, idx);

  // Hover sweep
  for (let x = 0.1; x <= 0.9; x += 0.15) {
    await canvas.hover({ position: { x: box.width * x, y: box.height * 0.5 } });
    await page.waitForTimeout(60);
  }
}

// ── Main test ────────────────────────────────────────────────────────

test("discover eCharts events via catalog page", async ({ page, baseURL }) => {
  const appURL = baseURL || "http://localhost:3033";
  const unknownEvents: string[] = [];
  const allConsoleEvents: string[] = [];
  const allNativeEvents: { kind: string; label: string; component: string }[] = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[xs:echart-discovery]")) {
      allConsoleEvents.push(text);
      const match = text.match(/unknown event: "([^"]+)"/);
      if (match) unknownEvents.push(match[1]);
    }
  });

  // ─── Navigate to catalog ───────────────────────────────────────────
  console.log("\n=== Page: #echarts-catalog ===");
  await page.goto(`${appURL}/#echarts-catalog`);
  await page.waitForTimeout(RENDER_WAIT);

  // Scroll to bottom and back to ensure all charts mount
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const count = await page.locator("canvas").count();
  console.log(`Found ${count} charts`);

  const labels = [
    "bar", "line", "pie", "scatter", "area",
    "heatmap", "funnel", "treemap", "sankey", "radar",
    "gauge", "candlestick", "boxplot", "graph",
    "datazoom", "toolbox", "brush", "timeline",
    "parallel", "sunburst",
  ];

  let prevLogCount = 0;

  for (let i = 0; i < count; i++) {
    const canvas = page.locator("canvas").nth(i);
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await exerciseChart(page, i, labels[i] || `chart-${i}`);

    // Collect new trace entries produced by this chart
    const snapshot = await page.evaluate((offset: number) => {
      const logs = (window as any)._xsLogs || [];
      return logs.slice(offset)
        .filter((e: any) => e.kind?.startsWith("native:"))
        .map((e: any) => ({
          kind: e.kind.replace("native:", ""),
          label: e.displayLabel || "",
          component: e.componentLabel || "",
        }));
    }, prevLogCount);
    allNativeEvents.push(...snapshot);

    // Update offset to current log length
    prevLogCount = await page.evaluate(() => ((window as any)._xsLogs || []).length);
  }

  // ─── Build results ──────────────────────────────────────────────────
  const uniqueUnknown = [...new Set(unknownEvents)].sort();
  const uniqueNativeKinds = [...new Set(allNativeEvents.map((e) => e.kind))].sort();
  const counts: Record<string, number> = {};
  allNativeEvents.forEach((e) => { counts[e.kind] = (counts[e.kind] || 0) + 1; });

  const results = {
    timestamp: new Date().toISOString(),
    chartsExercised: count,
    unknownEvents: uniqueUnknown,
    knownEventTypes: uniqueNativeKinds,
    eventCounts: counts,
    sampleTraces: allNativeEvents.slice(0, 50),
    discoveryMessages: [...new Set(allConsoleEvents)].sort(),
    summary: `${uniqueUnknown.length} unknown, ${uniqueNativeKinds.length} known event types`,
  };

  // Write results file
  const resultsDir = path.resolve(__dirname, "..", "traces", "runs");
  fs.mkdirSync(resultsDir, { recursive: true });
  const resultsPath = path.join(resultsDir, "echart-discovery-results.json");
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to: ${resultsPath}`);
});
