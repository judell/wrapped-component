const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3033');

  // Navigate to the Slider vs SliderW page
  await page.click('text=Slider vs SliderW');
  await page.waitForTimeout(1000);

  // --- Test SliderW with aria-label ---
  // The aria-label card has SliderW with aria-label="Volume"
  const sliderW = page.getByRole('slider', { name: 'Volume' });

  console.log('Looking for SliderW with aria-label="Volume"...');
  const count = await sliderW.count();
  console.log(`Found ${count} slider(s) with name "Volume"`);

  if (count > 0) {
    // Get current value
    const valueBefore = await sliderW.first().inputValue().catch(() =>
      sliderW.first().getAttribute('aria-valuenow')
    );
    console.log(`SliderW value before: ${valueBefore}`);

    // Use keyboard to change value
    await sliderW.first().click();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowRight');
    }

    const valueAfter = await sliderW.first().getAttribute('aria-valuenow');
    console.log(`SliderW value after 5 ArrowRight presses: ${valueAfter}`);

    // Now try to find the plain Slider by the same aria-label
    // It should NOT be findable since Slider drops aria-label
    console.log('\n--- Trying to find Slider (hand-written) by aria-label ---');
    // Both sliders set aria-label="Volume" in the markup, but only SliderW forwards it
    // The hand-written Slider drops it, so getByRole won't find it
    const allVolumeSliders = page.getByRole('slider', { name: 'Volume' });
    const totalCount = await allVolumeSliders.count();
    console.log(`Total sliders with aria-label="Volume": ${totalCount}`);
    console.log(totalCount === 1
      ? 'PASS: Only SliderW is findable — Slider dropped aria-label'
      : `UNEXPECTED: Found ${totalCount} (expected 1)`);
  }

  // Check trace events
  console.log('\n--- Checking trace events ---');
  const logs = await page.evaluate(() => window._xsLogs || []);
  const valueChanges = logs.filter(e => e.kind === 'value:change');
  const focusChanges = logs.filter(e => e.kind === 'focus:change');
  console.log(`value:change events: ${valueChanges.length}`);
  console.log(`focus:change events: ${focusChanges.length}`);
  for (const vc of valueChanges) {
    console.log(`  ${vc.kind} ${vc.component} "${vc.displayLabel}"`);
  }

  await browser.close();
})();
