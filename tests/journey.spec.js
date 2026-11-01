import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

for (const width of [1440, 393]) {
  for (const contractor of [false, true]) {
    test(`${width}px complete ${contractor ? 'hourly contractor' : 'salaried employee'} journey`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const outbound = [];
      page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) outbound.push(request.url()); });
      await page.goto('/');
      if (contractor) await page.getByRole('radio', { name: /^Contractor/ }).check();
      await page.getByRole('button', { name: /Use template/ }).click();
      await page.locator('#field-firstName').fill(contractor ? 'Priya' : 'Alex');
      await page.locator('#field-lastName').fill(contractor ? 'Shah' : 'Rivera');
      await page.locator('#field-email').fill(contractor ? 'priya.shah@example.com' : 'alex.rivera@example.com');
      await page.locator('#field-jobTitle').fill(contractor ? 'Product designer' : 'Senior full-stack engineer');
      await page.locator('#field-startDate').fill(contractor ? '2026-07-01' : '2026-06-15');
      if (contractor) await page.locator('#field-endDate').fill('2026-12-31');
      await page.getByRole('button', { name: 'Use saved role details', exact: true }).click();
      await page.getByRole('radio', { name: contractor ? /Design/ : /Engineering/ }).check();
      await page.getByRole('button', { name: 'Apply role details', exact: true }).click();
      await page.getByRole('button', { name: 'Continue to Compensation', exact: true }).click();
      await page.getByRole('radio', { name: contractor ? 'Hourly' : 'Salary', exact: true }).check();
      await page.locator('#field-amount').fill(contractor ? '95' : '150000');
      if (!contractor) {
        await page.getByRole('switch', { name: 'Signing bonus', exact: true }).check();
        await page.locator('#field-bonusAmount').fill('10000');
        await page.locator('#field-repaymentMonths').fill('12');
      }
      await page.getByRole('button', { name: 'Continue to Hire setup', exact: true }).click();
      if (contractor) {
        await expect(page.locator('#field-flsa')).toHaveCount(0);
      } else {
        await page.locator('#field-flsa').selectOption('Exempt');
        await page.locator('#field-i9').selectOption('Required');
        await page.locator('#field-payroll').selectOption('US Salaried');
      }
      await page.getByRole('button', { name: 'Continue to Offer terms', exact: true }).click();
      await page.locator('#field-expiry').fill(contractor ? '2026-06-20' : '2026-06-01');
      await page.locator('#field-sender').selectOption('Sam Patel');
      await page.locator('#field-note').fill('We look forward to working with you.');
      await page.getByRole('button', { name: 'Review offer', exact: true }).click();
      await expect(page.locator('#row-pay')).toContainText(contractor ? '$95' : '$150,000');
      await expect(page.locator('#row-note')).toContainText('We look forward to working with you.');
      if (contractor) await expect(page.locator('#row-flsa')).toHaveCount(0);
      const send = page.getByRole('button', { name: 'Send offer letter', exact: true });
      await expect(send).toHaveAttribute('aria-disabled', 'false');
      await send.press('Enter');
      await expect(page.getByRole('heading', { level: 1 })).toContainText(contractor ? 'Priya' : 'Alex');
      await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
      await expect(page.getByRole('status')).toContainText('No real email was sent');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map(issue => issue.id)).toEqual([]);
      expect(outbound).toEqual([]);
      await page.getByRole('button', { name: 'View sent offer', exact: true }).click();
      const letter = page.getByRole('dialog', { name: 'Sent offer', exact: true });
      await expect(letter).toContainText(contractor ? '$95' : '$150,000');
      await expect(letter.locator('[data-action="edit-letter-field"]')).toHaveCount(0);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'View sent offer', exact: true })).toBeFocused();
    });
  }
}

test('changing pay type requires a separate classification confirmation', async ({ page }) => {
  await page.goto('/offer.html?screen=review&preset=ready');
  await page.getByRole('button', { name: 'Edit pay', exact: true }).click();
  await page.getByRole('radio', { name: 'Hourly', exact: true }).check();
  await page.locator('#field-amount').fill('50');
  await page.getByRole('button', { name: 'Save & confirm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Send offer letter', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('#row-flsa')).toContainText('Confirm the FLSA classification');
  await page.getByRole('button', { name: 'Edit flsa', exact: true }).click();
  await page.locator('#field-flsa').selectOption('Non-exempt');
  await page.getByRole('button', { name: 'Save & confirm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Send offer letter', exact: true })).toHaveAttribute('aria-disabled', 'false');
  await expect(page.locator('#row-pay')).toContainText('$50');
});

test('switching templates keeps shared entries and blocks sending until new fields are complete', async ({ page }) => {
  await page.goto('/offer.html?screen=review&preset=ready');
  await page.getByRole('button', { name: 'Change worker type and template', exact: true }).click();
  await page.getByRole('radio', { name: /^Contractor/ }).check();
  await page.getByRole('button', { name: 'Use this template', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Shared entries kept');
  await expect(page.locator('#row-name')).toContainText('Alex Rivera');
  await expect(page.locator('#row-pay')).toContainText('$150,000');
  await expect(page.locator('#row-endDate')).toContainText('Missing');
  await expect(page.locator('#row-flsa')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Send offer letter', exact: true })).toHaveAttribute('aria-disabled', 'true');
});

test('storage errors remain explicit and do not discard current entries', async ({ page }) => {
  await page.goto('/offer.html?screen=candidate&preset=partial');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Storage disabled', 'QuotaExceededError'); };
  });
  await page.getByRole('button', { name: 'Save as draft', exact: true }).click();
  await expect(page.locator('#field-firstName')).toHaveValue('Alex');
  await expect(page.getByRole('alert')).toContainText('could not save the draft');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A new person. Familiar details.');
});
