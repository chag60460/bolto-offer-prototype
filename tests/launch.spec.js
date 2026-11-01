import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

for (const width of [1440, 1024, 393]) {
  test.describe(`${width}px launch section`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('meets WCAG 2.2 AA rules, fits the width and uses the white logo on blue', async ({ page }) => {
      await page.goto('/launch.html');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map(v => ({ rule: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const logo = page.getByRole('img', { name: 'Bolto', exact: true });
      await expect(logo).toHaveAttribute('src', 'assets/brand/full-logo-white.svg');
      expect(await logo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      const ratio = await logo.evaluate(img => img.getBoundingClientRect().width / img.getBoundingClientRect().height);
      expect(Math.abs(ratio - 186 / 40)).toBeLessThan(0.05);
      expect(await page.locator('.hero').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(41, 102, 255)');
    });

    test('callouts never cover the letter text, each other or the screen edge', async ({ page }) => {
      await page.goto('/launch.html');
      await page.waitForTimeout(2000);
      const result = await page.evaluate(() => {
        const text = [...document.querySelectorAll('.letter p')].flatMap(el => { const r = document.createRange(); r.selectNodeContents(el); return [...r.getClientRects()]; });
        const notes = [...document.querySelectorAll('.note')].map(n => n.getBoundingClientRect());
        const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        return {
          coversText: notes.some(n => text.some(t => hit(n, t))),
          overlap: notes.some((a, i) => notes.some((b, j) => i < j && hit(a, b))),
          offscreen: notes.some(n => n.left < 0 || n.right > innerWidth),
        };
      });
      expect(result).toEqual({ coversText: false, overlap: false, offscreen: false });
    });

    test('keyboard reaches the call to action with a visible white focus ring', async ({ page, browserName }) => {
      await page.goto('/launch.html');
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      const cta = page.getByRole('link', { name: "See what's new" });
      await expect(cta).toBeFocused();
      expect(await cta.evaluate(n => { const s = getComputedStyle(n); return [s.outlineStyle, s.outlineColor, parseFloat(s.outlineWidth)]; })).toEqual(['solid', 'rgb(255, 255, 255)', 3]);
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Start with the right letter.');
    });
  });
}

test('the illustration has a text alternative and its decorative parts are hidden', async ({ page }) => {
  await page.goto('/launch.html');
  await expect(page.getByRole('figure')).toHaveAccessibleName(/offer letter for Alex Rivera.*role details reused, nothing missing, and FLSA Exempt recommended/);
  await expect(page.locator('.scene')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Offers out the door in minutes.');
  await expect(page.locator('.proof li')).toHaveCount(3);
});

test('the entrance plays once and finishes in under 2 seconds', async ({ page }) => {
  await page.goto('/launch.html');
  await expect(page.locator('html')).toHaveClass(/will-play/);
  const timing = await page.evaluate(() => document.getAnimations().map(a => a.effect.getComputedTiming()));
  expect(timing.length).toBe(4);
  expect(Math.max(...timing.map(t => t.delay + t.activeDuration))).toBeLessThan(2000);
  expect(timing.every(t => t.iterations === 1)).toBe(true);
});

test('with reduced motion, the finished scene shows immediately', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/launch.html');
  await expect(page.locator('html')).not.toHaveClass(/will-play/);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  for (const note of await page.locator('.note').all()) await expect(note).toHaveCSS('opacity', '1');
  await context.close();
});

test('the logo files are the unmodified exports from the brand kit', () => {
  for (const [file, fill] of [['full-logo-ink.svg', '#1A1A1A'], ['full-logo-white.svg', 'white']]) {
    const svg = readFileSync(new URL(`../assets/brand/${file}`, import.meta.url), 'utf8');
    expect(svg).toMatch(/^<svg width="186" height="40" viewBox="0 0 186 40"/);
    expect([...new Set(svg.match(/fill="(?!none)[^"]+"/g))]).toEqual([`fill="${fill}"`]);
  }
});

for (const width of [1440, 393]) {
  test.describe(`${width}px early access`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('the hero link jumps to early access, and the form validates and confirms by keyboard alone', async ({ page, browserName }) => {
      const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const requests = [];
      page.on('request', r => { if (r.method() !== 'GET') requests.push(r.url()); });
      await page.goto('/launch.html');
      await page.getByRole('link', { name: 'Get early access' }).click();
      await expect(page.getByRole('heading', { name: 'Be first to send offers in minutes.', level: 2 })).toBeInViewport();
      await expect(page.locator('.early')).toHaveCSS('background-color', 'rgb(41, 102, 255)');
      await expect(page.locator('.early h2')).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(page.locator('.early-form')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(page.locator('.early-form')).toHaveCSS('color', 'rgb(26, 26, 26)');
      const email = page.getByRole('textbox', { name: 'Work email' });
      await expect(email).toHaveCSS('border-top-color', 'rgb(138, 138, 138)');
      await email.focus();
      await page.keyboard.press(tab);
      const join = page.getByRole('button', { name: 'Join early access' });
      await expect(join).toBeFocused();
      await expect(join).toHaveCSS('background-color', 'rgb(41, 102, 255)');
      await expect(join).toHaveCSS('outline-color', 'rgb(41, 102, 255)');
      await expect(join).toHaveCSS('outline-width', '3px');
      await page.keyboard.press('Enter');
      await expect(email).toBeFocused();
      await expect(email).toHaveCSS('outline-color', 'rgb(41, 102, 255)');
      await expect(email).toHaveAttribute('aria-invalid', 'true');
      await expect(email).toHaveAccessibleDescription(/^Enter your work email\. Demo only/);
      await email.fill('sam@');
      await page.keyboard.press('Enter');
      await expect(email).toHaveAccessibleDescription(/^Enter an email like you@company\.com\./);
      await email.fill('sam@northstar.studio');
      await expect(email).toHaveAttribute('aria-invalid', 'false');
      await page.keyboard.press('Enter');
      await expect(page.locator('[data-form-success]')).toBeFocused();
      await expect(page.locator('[data-form-success]')).toHaveCSS('outline-color', 'rgb(41, 102, 255)');
      await expect(page.locator('[data-form-success]')).toContainText("You're on the list.");
      await expect(page.getByRole('status')).toHaveText("You're on the list. We'll email sam@northstar.studio on December 1.");
      await expect(email).toBeHidden();
      expect(requests).toEqual([]);
      const results = await new AxeBuilder({ page }).include('.early').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map(v => v.id)).toEqual([]);
    });
  });
}

test('the early-access error state meets WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/launch.html#early-access');
  await page.getByRole('button', { name: 'Join early access' }).click();
  await expect(page.locator('.early-error')).toHaveCSS('color', 'rgb(196, 39, 26)');
  const results = await new AxeBuilder({ page }).include('.early').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
});
