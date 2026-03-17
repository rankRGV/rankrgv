// scripts/capture-og.js
// Usage: node scripts/capture-og.js
// Captures the og-preview.html canvas to a 1200x630 PNG

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 630 });

  const htmlPath = path.resolve(__dirname, '../public/og-preview.html');
  await page.goto('file://' + htmlPath);

  // Wait for fonts + canvas render
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForTimeout(800);

  const canvas = await page.$('canvas#og');
  await canvas.screenshot({
    path: path.resolve(__dirname, '../public/images/og-default.png'),
    omitBackground: false,
  });

  console.log('✓ Saved: public/images/og-default.png (1200×630)');
  await browser.close();
})();
