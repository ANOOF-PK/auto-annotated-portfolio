// Visual inspection: screenshots each section at a given viewport.
// Usage: node scripts/inspect.mjs <baseUrl> <outDir> [desktop|mobile] [reduce]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [base = 'http://localhost:3000', out = 'shots', device = 'desktop', motion = 'no-preference'] = process.argv.slice(2);
const viewport = device === 'mobile' ? { width: 390, height: 844 } : device === 'tablet' ? { width: 820, height: 1180 } : { width: 1440, height: 900 };
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport, reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference', hasTouch: device === 'mobile', isMobile: device === 'mobile' });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(base, { waitUntil: 'networkidle' });
const status = await page.waitForFunction(() => ['ready', 'failed', 'unsupported', 'off'].includes(document.documentElement.dataset.scene), null, { timeout: 30000 }).then(() => page.evaluate(() => document.documentElement.dataset.scene)).catch(() => 'timeout');
console.log('scene:', status);
for (const id of ['arrival', 'mind', 'work', 'observations', 'playground', 'journey', 'contact']) {
    await page.evaluate((id) => window.scrollTo(0, document.getElementById(id).getBoundingClientRect().top + window.scrollY), id);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${out}/${device}-${id}.png` });
}
console.log('errors:', errors.length ? errors.join('\n') : 'none');
await browser.close();
