import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

const openExplanation = async (page, name) => {
  await page.getByText(name).first().click();
  return page.locator('.explanation[data-open="true"] .explanation-content').filter({ hasText: /./ });
};

test('FLSA recommends Exempt for a salaried professional and confirms a matching choice', async ({ page }) => {
  await page.goto('/index.html?screen=hire&preset=ready');
  const panel = await openExplanation(page, 'What should I choose?');
  await expect(panel.first()).toContainText('Recommended: Exempt');
  await expect(panel.first()).toContainText('as for a Senior full-stack engineer');
  await expect(panel.first()).toContainText('California, New York and Washington');
  await expect(panel.first()).not.toContainText('does not recommend');
  await expect(panel.first()).toContainText('Your choice matches the recommendation');
  const results = await new AxeBuilder({ page }).include('#flsa-explanation').analyze();
  expect(results.violations.map(item => item.id)).toEqual([]);
});

for (const [label, payType, amount, expected] of [
  ['hourly pay', 'hourly', '50', 'Hourly employees are usually non-exempt'],
  ['a salary under the federal minimum', 'salary', '30000', 'salaries below $35,568 a year'],
]) {
  test(`FLSA recommends Non-exempt for ${label}, and Use recommendation fills it`, async ({ page }) => {
    await page.goto('/index.html?screen=hire&preset=ready');
    await page.evaluate(([type, value]) => { state.data.payType = type; state.data.amount = value; render(); }, [payType, amount]);
    const panel = (await openExplanation(page, 'What should I choose?')).first();
    await expect(panel).toContainText('Recommended: Non-exempt');
    await expect(panel).toContainText(expected);
    await page.getByRole('button', { name: 'Use recommendation: Non-exempt' }).press('Enter');
    await expect(page.locator('#field-flsa')).toHaveValue('Non-exempt');
    await expect(page.locator('#field-flsa')).toBeFocused();
    await expect(page.locator('#flsa-explanation')).toHaveAttribute('data-open', 'true');
    await expect(page.locator('#flsa-explanation')).toContainText('Your choice matches the recommendation');
    await expect(page.getByRole('status')).toContainText('FLSA classification set to Non-exempt');
  });
}

test('FLSA asks for pay first when there is none', async ({ page }) => {
  await page.goto('/index.html?screen=hire&preset=empty');
  await page.evaluate(() => { state.data.payType = ''; state.data.amount = ''; render(); });
  const panel = (await openExplanation(page, 'What should I choose?')).first();
  await expect(panel).toContainText('Add pay in Compensation to see a recommendation.');
  await expect(page.getByRole('button', { name: /Use recommendation/ })).toHaveCount(0);
});

test('I-9 recommends Required and says when, using the start date', async ({ page }) => {
  await page.goto('/index.html?screen=hire&preset=empty');
  const panel = (await openExplanation(page, 'When is an I-9 needed?')).first();
  await expect(panel).toContainText('Recommended: Required');
  await expect(panel).toContainText('including US citizens');
  await expect(panel).toContainText('Alex completes Section 1 by their first day (Jun 15, 2026)');
  await expect(panel).toContainText('within 3 business days (by Jun 18, 2026)');
  await page.getByRole('button', { name: 'Use recommendation: Required' }).click();
  await expect(page.locator('#field-i9')).toHaveValue('Required');
  expect(await page.evaluate(() => addBusinessDays('2026-06-19', 3))).toBe('2026-06-24');
  await page.evaluate(() => { state.data.startDate = ''; render(); });
  await expect(page.locator('#i9-explanation')).toContainText('within 3 business days of it');
});

test('Review: recommendation updates after a pay change and clears the FLSA recheck', async ({ page }) => {
  await page.goto('/index.html?screen=review&preset=ready');
  await page.getByRole('button', { name: 'Edit pay', exact: true }).click();
  await page.getByRole('radio', { name: 'Hourly', exact: true }).check();
  await page.locator('#field-amount').fill('50');
  await page.getByRole('button', { name: 'Save & confirm', exact: true }).click();
  const send = page.getByRole('button', { name: 'Send offer letter', exact: true });
  await expect(send).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('button', { name: 'What should I choose for FLSA?' }).press('Enter');
  await expect(page.locator('#row-flsa-help')).toContainText('Recommended: Non-exempt');
  await page.getByRole('button', { name: 'Use recommendation: Non-exempt' }).press('Enter');
  await expect(page.locator('#row-flsa')).toContainText('Non-exempt');
  await expect(page.getByRole('button', { name: 'What should I choose for FLSA?' })).toBeFocused();
  await expect(send).toHaveAttribute('aria-disabled', 'false');
  await page.getByRole('button', { name: 'When is an I-9 needed?' }).press('Enter');
  await expect(page.locator('#row-i9-help')).toContainText('by Jun 18, 2026');
});

test('recommendations say they are not legal advice and link to official guidance in a new tab', async ({ page }) => {
  await page.goto('/index.html?screen=hire&preset=ready');
  for (const [summary, panelId, name, href] of [
    ['What should I choose?', '#flsa-explanation', 'Department of Labor’s guidance on exemptions (opens in a new tab)', 'https://www.dol.gov/agencies/whd/fact-sheets/17a-overtime'],
    ['When is an I-9 needed?', '#i9-explanation', 'USCIS guidance on completing Form I-9 (opens in a new tab)', 'https://www.uscis.gov/i-9-central/completing-form-i-9'],
  ]) {
    await page.getByText(summary).first().click();
    const panel = page.locator(panelId);
    await expect(panel).toContainText('This is a recommendation, not legal advice.');
    const link = panel.getByRole('link', { name, exact: true });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.evaluate(() => { state.data.payType = ''; state.data.amount = ''; render(); });
  await expect(page.locator('#flsa-explanation')).not.toContainText('not legal advice');
  await expect(page.locator('#flsa-explanation').getByRole('link', { name: /Department of Labor/ })).toHaveCount(1);
  await page.goto('/index.html?screen=review&preset=ready');
  await page.getByRole('button', { name: 'What should I choose for FLSA?' }).press('Enter');
  await expect(page.locator('#row-flsa-help').getByRole('link', { name: /Department of Labor/ })).toHaveCount(1);
});
