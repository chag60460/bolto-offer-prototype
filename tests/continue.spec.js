import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

const status = page => page.locator('body > [role=status]');
const nav = (page, id) => page.locator(`.section-link[data-screen="${id}"]`);

test('bonus and equity switched on but left empty are flagged like any other required field', async ({ page }) => {
  await page.goto('/index.html?screen=compensation&preset=empty');
  await page.locator('#field-payType-salary').check();
  await page.locator('#field-amount').fill('150000');
  await page.locator('[data-field=bonusEnabled]').check();
  await page.locator('[data-field=equityEnabled]').check();
  await page.getByRole('button', { name: 'Continue to Hire setup', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Set them up for a good start.');
  await expect(status(page)).toHaveText('Compensation has 4 fields missing. You can finish them before sending.');
  await expect(nav(page, 'compensation')).toContainText('4 fields missing');
  await expect(nav(page, 'compensation')).toHaveAttribute('data-status', 'missing');
  await nav(page, 'compensation').click();
  for (const key of ['bonusAmount', 'repaymentMonths', 'equityShares', 'equityVestingMonths']) {
    await expect(page.locator(`#field-${key}`)).toHaveAttribute('aria-invalid', 'true');
  }
  await page.locator('[data-field=equityEnabled]').uncheck();
  await expect(nav(page, 'compensation')).toContainText('2 fields missing');
});

test('a wrong value stops Continue, focuses the field and announces it', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=invalid');
  await page.getByRole('button', { name: 'Continue to Compensation', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A new person. Familiar details.');
  await expect(page.locator('#field-email')).toBeFocused();
  await expect(page.locator('body > [role=alert]')).toHaveText('Candidate & role: 1 error to fix. Enter an email like alex.rivera@example.com.');
  await page.goto('/index.html?screen=compensation&preset=ready');
  await page.locator('#field-amount').fill('0');
  await page.getByRole('button', { name: 'Continue to Hire setup', exact: true }).click();
  await expect(page.locator('#field-amount')).toBeFocused();
  await expect(page.locator('body > [role=alert]')).toContainText('Enter an amount greater than $0.');
});

test('empty fields never block any section, and Send stays the gate', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=empty');
  await page.evaluate(() => { state.data = { ...BLANK }; render(); });
  for (const [button, next] of [['Continue to Compensation', 'compensation'], ['Continue to Hire setup', 'hire'], ['Continue to Offer terms', 'terms'], ['Review offer', 'review']]) {
    await page.getByRole('button', { name: button, exact: true }).click();
    expect(await page.evaluate(() => state.screen)).toBe(next);
  }
  for (const id of ['candidate', 'compensation', 'hire', 'terms']) await expect(nav(page, id)).toHaveCount(0);
  const send = page.getByRole('button', { name: 'Send offer letter', exact: true });
  await expect(send).toHaveAttribute('aria-disabled', 'true');
  await send.press('Enter');
  expect(await page.evaluate(() => state.screen)).toBe('review');
});
