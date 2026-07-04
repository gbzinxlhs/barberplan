const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  for (let i = 1; i <= 6; i++) {
    const scene = String(i).padStart(2, '0');
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(`file:///C:/Users/gabri/Downloads/paineis/barberplan/demo-output/scenes/scene-${scene}.html`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `C:/Users/gabri/Downloads/paineis/barberplan/demo-output/frames/scene-${scene}.png`,
      fullPage: false,
    });
    console.log(`Captured scene-${scene}`);
    await page.close();
  }

  await browser.close();
  console.log('Done!');
})();
