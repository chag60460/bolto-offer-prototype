import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

async function audit(page) {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map(issue => ({
    rule: issue.id,
    impact: issue.impact,
    nodes: issue.nodes.map(node => ({ target: node.target, reason: node.failureSummary })),
  }))).toEqual([]);
}

for (const width of [1440, 393]) {
  test.describe(`${width}px accessibility`, () => {
    test.use({ viewport: { width, height: 1000 } });
    for (const screen of ['candidate', 'review']) {
      for (const preset of ['empty', 'partial', 'invalid', 'ready']) {
        test(`${screen} ${preset}`, async ({ page }) => {
          await page.goto(`/offer.html?screen=${screen}&preset=${preset}`);
          await audit(page);
          if (width === 393) {
            await page.getByRole('button', { name: 'Letter preview', exact: true }).click();
            await audit(page);
          }
        });
      }
    }
    test('essential field outlines and primary text meet the exact contrast thresholds', async ({ page }) => {
      await page.goto('/offer.html?screen=candidate&preset=invalid');
      const ratios = async () => page.evaluate(() => {
        const channels = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
        const luminance = color => channels(color).map(value => {
          const linear = value / 255;
          return linear <= .04045 ? linear / 12.92 : ((linear + .055) / 1.055) ** 2.4;
        }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
        const contrast = (first, second) => {
          const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
          return (values[0] + .05) / (values[1] + .05);
        };
        const input = getComputedStyle(document.getElementById('field-firstName'));
        const button = getComputedStyle(document.getElementById('use-role-setup'));
        const error = getComputedStyle(document.getElementById('field-email-error'));
        const surface = getComputedStyle(document.querySelector('.candidate-role-shell')).backgroundColor;
        return {
          inputBorder: contrast(input.borderTopColor, input.backgroundColor),
          primaryText: contrast(button.color, button.backgroundColor),
          errorText: contrast(error.color, surface),
        };
      });
      const normal = await ratios();
      expect(normal.inputBorder).toBeGreaterThanOrEqual(3);
      expect(normal.primaryText).toBeGreaterThanOrEqual(4.5);
      expect(normal.errorText).toBeGreaterThanOrEqual(4.5);
      await page.getByRole('button', { name: 'Use saved role details', exact: true }).hover();
      expect((await ratios()).primaryText).toBeGreaterThanOrEqual(4.5);
    });
    test('a polite status does not cancel a queued error announcement', async ({ page }) => {
      await page.goto('/offer.html?screen=candidate&preset=empty');
      await page.evaluate(() => {
        announce('Enter a valid email address.', true);
        announce('The letter preview has updated.');
      });
      await expect(page.getByRole('alert')).toHaveText('Enter a valid email address.');
      await expect(page.getByRole('status')).toHaveText('The letter preview has updated.');
    });
    test('saved-role dialog and applied state', async ({ page }) => {
      await page.goto('/offer.html?screen=candidate&preset=partial');
      await page.getByRole('button', { name: 'Use saved role details', exact: true }).click();
      await audit(page);
      await page.getByRole('radio', { name: /Operations/ }).check();
      await audit(page);
      await page.getByRole('button', { name: 'Apply role details', exact: true }).click();
      await audit(page);
    });
    test('inline pay editing and template dialog', async ({ page }) => {
      await page.goto('/offer.html?screen=review&preset=ready');
      await page.getByRole('button', { name: 'Edit pay', exact: true }).click();
      await audit(page);
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await page.getByRole('button', { name: 'Change worker type and template', exact: true }).click();
      await audit(page);
    });
    test('direct entry and the other sections', async ({ page }) => {
      await page.goto('/');
      await audit(page);
      for (const screen of ['template', 'compensation', 'hire', 'terms']) {
        await page.goto(`/offer.html?screen=${screen}&preset=empty`);
        await audit(page);
      }
    });
  });
}
