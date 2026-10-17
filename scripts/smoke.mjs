// End-to-end smoke test against a running server.
// Usage: node scripts/smoke.mjs [baseUrl]
// Needs a Chromium binary: CHROME_PATH, or the Playwright browser cache path below.
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'http://localhost:3000';
const executablePath = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const gl = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

let failures = 0;
function check(name, ok, detail = '') {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
    if (!ok) failures++;
}

const sceneSettled = (page) =>
    page.waitForFunction(() => ['ready', 'failed', 'unsupported', 'off'].includes(document.documentElement.dataset.scene), null, { timeout: 30000 });
const scene = (page) => page.evaluate(() => document.documentElement.dataset.scene);
const focused = (page) => page.evaluate(() => document.activeElement?.id || document.activeElement?.textContent?.trim().slice(0, 40));

const browser = await chromium.launch({ executablePath, args: gl });

// ---------- Desktop, full motion ----------
{
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(base, { waitUntil: 'networkidle' });
    await sceneSettled(page);
    check('3D scene renders', (await scene(page)) === 'ready', await scene(page));

    const h1 = await page.locator('h1').innerText();
    check('first screen names the designer', /Anoof/i.test(h1), h1.replace(/\s+/g, ' '));
    const headings = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3')].map((h) => Number(h.tagName[1])));
    check('one h1, no skipped heading levels', headings.filter((l) => l === 1).length === 1 && headings.every((l, i) => i === 0 || l <= headings[i - 1] + 1));

    const navTargets = await page.evaluate(() => [...document.querySelectorAll('header nav a')].map((a) => a.getAttribute('href')));
    const missing = await page.evaluate((t) => t.filter((h) => !document.querySelector(h)), navTargets);
    check('every index link has a destination', missing.length === 0, missing.join(', '));

    const dead = await page.evaluate(() =>
        [...document.querySelectorAll('a, button')]
            .filter((el) => (el.tagName === 'A' ? !el.getAttribute('href') || el.getAttribute('href') === '#' : false) || !(el.textContent.trim() || el.getAttribute('aria-label')))
            .map((el) => el.outerHTML.slice(0, 80))
    );
    check('no dead or unnamed controls', dead.length === 0, dead.join(' | '));

    // Keyboard: skip link first, then work previews.
    await page.keyboard.press('Tab');
    check('first Tab reaches the skip link', (await focused(page)) === 'Skip to work');

    await page.locator('#project-blinkit-seller-hub').focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    check('project preview opens with focus on its title', (await focused(page)) === 'project-preview-title');
    const preview = await page.locator('#project-preview').innerText();
    check('preview shows title, role and a case-study action', /Seller Hub/.test(preview) && /Role/i.test(preview) && /Open case study/.test(preview));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    check('Escape closes the preview and returns focus', (await focused(page)) === 'project-blinkit-seller-hub', await focused(page));

    await page.locator('#concept-accessibility').click();
    await page.waitForTimeout(200);
    check('concept opens its explanation', await page.locator('#concept-detail').isVisible());
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    check('concept closes and focus returns', (await focused(page)) === 'concept-accessibility');

    // Body as navigation: click the head in the 3D scene.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    // The face sits here in the arrival framing at 1440×900 (see choreography.ts).
    await page.mouse.move(828, 430);
    await page.waitForTimeout(400);
    const label = await page.locator('[aria-hidden="true"] >> text=Head — how I think').count();
    check('hovering the head shows its label', label > 0);
    await page.mouse.click(828, 430);
    await page.waitForTimeout(2500);
    const arrived = await page.evaluate(() => location.hash === '#mind' && Math.abs(document.getElementById('mind').getBoundingClientRect().top) < 120);
    check('clicking the head in the scene travels to Thinking', arrived);

    check('no runtime errors (desktop)', errors.length === 0, errors.join(' | '));

    // 3D switch persists.
    await page.getByRole('button', { name: /^3D on$/ }).first().click();
    await page.waitForTimeout(300);
    check('3D can be switched off', (await scene(page)) === 'off');
    await page.reload({ waitUntil: 'networkidle' });
    await sceneSettled(page);
    check('3D-off choice persists across visits', (await scene(page)) === 'off');
    const staticArt = await page.locator('[data-variant="bust"]').first().isVisible();
    check('static character shown when 3D is off', staticArt);
    await page.getByRole('button', { name: /^3D off$/ }).first().click();
    await sceneSettled(page);
    await page.close();
}

// ---------- Case studies ----------
{
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/work/"]')].map((a) => a.getAttribute('href')))]);
    for (const href of links) {
        const res = await page.goto(base + href);
        const title = await page.locator('h1').innerText();
        check(`case study ${href}`, res.status() === 200 && title.length > 0, title);
    }
    const ledger = await page.locator('text=Not yet documented').count();
    check('case studies list undocumented parts instead of inventing them', ledger > 0);
    await page.close();
}

// ---------- Mobile, touch, reduced motion ----------
{
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    await sceneSettled(page);
    check('mobile + reduced motion still renders the character', (await scene(page)) === 'ready');
    const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    check('reduced-motion preference detected', reduced);

    await page.getByRole('button', { name: 'Index' }).tap();
    await page.waitForTimeout(200);
    check('index sheet opens as a dialog', await page.getByRole('dialog', { name: 'Index' }).isVisible());
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    check('index sheet closes with Escape, focus restored', (await focused(page)) === 'Index');

    await page.getByRole('button', { name: 'Index' }).tap();
    await page.getByRole('dialog').getByRole('link', { name: /Work/ }).tap();
    await page.waitForTimeout(800);
    const atWork = await page.evaluate(() => Math.abs(document.getElementById('work').getBoundingClientRect().top) < 80);
    check('index navigates to Work on touch', atWork);

    await page.locator('#project-windows-accessibility-focus-mode').tap();
    await page.waitForTimeout(300);
    check('project preview opens on tap (no hover needed)', await page.locator('#project-preview').isVisible());

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check('no horizontal overflow on mobile', !overflow);
    await page.close();
}

// ---------- No WebGL ----------
{
    const noGl = await chromium.launch({ executablePath, args: ['--disable-webgl', '--disable-3d-apis'] });
    const page = await noGl.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await sceneSettled(page);
    check('without WebGL the site reports unsupported', (await scene(page)) === 'unsupported');
    check('without WebGL all work is still listed', (await page.locator('[id^="project-"]').count()) >= 6);
    check('without WebGL the static character shows', await page.locator('[data-variant="bust"]').first().isVisible());
    await noGl.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
