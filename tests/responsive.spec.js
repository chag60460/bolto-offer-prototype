import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

const screens = ['template', 'candidate', 'compensation', 'hire', 'terms', 'review'];
for (const width of [320, 393, 600, 760, 761, 768, 1024, 1280, 1440, 1920]) {
  test(`${width}px all sections reflow and align their footer actions`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const screen of screens) {
      for (const preset of ['invalid', 'ready']) {
        await page.goto(`/offer.html?screen=${screen}&preset=${preset}`);
        await page.evaluate(() => document.fonts.ready);
        const result = await page.evaluate(() => {
          const footer = document.getElementById('app-footer'), bounds = footer.getBoundingClientRect();
          const style = getComputedStyle(footer);
          const primary = footer.querySelector('.footer-right .btn-primary').getBoundingClientRect();
          const back = footer.querySelector('.footer-left button')?.getBoundingClientRect();
          return {
            overflow: document.documentElement.scrollWidth - innerWidth,
            left: primary.left - bounds.left,
            right: bounds.right - primary.right,
            width: primary.width,
            paddingLeft: parseFloat(style.paddingLeft),
            paddingRight: parseFloat(style.paddingRight),
            backLeft: back ? back.left - bounds.left : null,
            ownRow: !back || primary.top >= back.bottom,
            clippedButtons: [...footer.querySelectorAll('button')].filter(node => {
              const box = node.getBoundingClientRect();
              return box.left < bounds.left - 1 || box.right > bounds.right + 1 || node.scrollWidth > node.clientWidth + 2;
            }).map(node => node.textContent.trim()),
          };
        });
        const label = `${width} / ${screen} / ${preset}`;
        expect(result.overflow, label).toBeLessThanOrEqual(1);
        expect(result.clippedButtons, label).toEqual([]);
        expect(Math.abs(result.right - result.paddingRight), label).toBeLessThanOrEqual(1);
        if (result.backLeft !== null) expect(Math.abs(result.backLeft - result.paddingLeft), label).toBeLessThanOrEqual(1);
        if (width <= 760) {
          expect(Math.abs(result.left - 16), label).toBeLessThanOrEqual(1);
          expect(Math.abs(result.width - (width - 32)), label).toBeLessThanOrEqual(1);
          expect(result.ownRow, label).toBe(true);
        }
      }
    }
  });
}

for (const width of [320, 393, 768, 1440]) {
  test(`${width}px increased text spacing does not clip controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const screen of ['candidate', 'review']) {
      await page.goto(`/offer.html?screen=${screen}&preset=invalid`);
      await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        clipped: [...document.querySelectorAll('button')].filter(node => node.getClientRects().length && node.scrollWidth > node.clientWidth + 2).map(node => node.textContent.trim()),
      }));
      expect(result.overflow).toBeLessThanOrEqual(1);
      expect(result.clipped).toEqual([]);
    }
  });
}

test('short desktop viewport uses readable page scrolling instead of tiny review panes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.goto('/offer.html?screen=review&preset=invalid');
  const pane = page.locator('.summary-panel');
  expect((await pane.boundingBox()).height).toBeGreaterThan(220);
  await page.getByRole('button', { name: 'Edit personal note', exact: true }).click();
  await expect(page.locator('#field-note')).toBeFocused();
  const field = await page.locator('#field-note').boundingBox(), footer = await page.locator('#app-footer').boundingBox();
  expect(field.y + field.height).toBeLessThanOrEqual(footer.y + 1);
});

test('resize keeps the currently focused letter pane accessible', async ({ page }) => {
  await page.goto('/offer.html?screen=candidate&preset=partial');
  const letterSwitch = page.getByRole('switch', { name: 'Show highlights', exact: true });
  await letterSwitch.focus();
  await page.setViewportSize({ width: 393, height: 900 });
  await expect(letterSwitch).toBeVisible();
  await expect(letterSwitch).toBeFocused();
  await expect(page.getByRole('button', { name: 'Letter preview', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Details', exact: true }).click();
  await expect(page.locator('#field-firstName')).toHaveValue('Alex');
});

for (const width of [393, 1440]) {
  test(`${width}px keyboard focus is visible and not covered by the footer`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/offer.html?screen=candidate&preset=ready');
    let reachedContinue = false;
    for (let index = 0; index < 80; index++) {
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      await page.evaluate(() => new Promise(requestAnimationFrame));
      const result = await page.evaluate(() => {
        const node = document.activeElement;
        if (node === document.body) return { browserChrome: true };
        const box = node.getBoundingClientRect();
        const footer = document.querySelector('.app-footer');
        const bottom = footer.getBoundingClientRect().top;
        const style = getComputedStyle(node);
        const ring = element => { const s = getComputedStyle(element); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; };
        const card = node.closest('.worker-card, .template-option, .role-setup-option, .radio-option');
        return {
          browserChrome: false,
          forward: node.dataset.action === 'continue',
          label: node.getAttribute('aria-label') || node.id || node.textContent.trim(),
          visible: box.width > 0 && box.height > 0 && box.top >= -1 && box.bottom <= innerHeight + 1 && box.left >= -1 && box.right <= innerWidth + 1,
          unobscured: footer.contains(node) || box.bottom <= bottom + 1,
          focusVisible: node.matches(':focus-within') && (ring(node) || Boolean(card && ring(card))),
        };
      });
      if (result.browserChrome) break;
      reachedContinue ||= result.forward;
      expect(result.visible, result.label).toBe(true);
      expect(result.unobscured, result.label).toBe(true);
      expect(result.focusVisible, result.label).toBe(true);
    }
    expect(reachedContinue, 'Tab traverses the full form to Continue without losing focus').toBe(true);
  });
}
