import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

const cardHasRing = locator => locator.evaluate(input => {
  const style = getComputedStyle(input.closest('label'));
  return document.activeElement === input && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 3;
});

for (const width of [1440, 393]) {
  test.describe(`${width}px choice cards`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('saved setups: Tab in, Enter selects, arrows change, whole card shows focus', async ({ page, browserName }) => {
      const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      await page.goto('/index.html?screen=candidate&preset=partial');
      await page.getByRole('button', { name: 'Use saved role details', exact: true }).press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Use saved role details' });
      await expect(dialog.getByRole('heading', { name: 'Use saved role details' })).toBeFocused();
      await page.keyboard.press(tab);
      await page.keyboard.press(tab);
      const first = dialog.getByRole('radio').first();
      await expect(first).toBeFocused();
      expect(await cardHasRing(first)).toBe(true);
      await page.keyboard.press('Enter');
      await expect(first).toBeChecked();
      await expect(dialog.getByRole('button', { name: 'Apply role details' })).toBeEnabled();
      await expect(dialog.getByRole('status')).toContainText('Nothing applied yet');
      await page.keyboard.press('ArrowDown');
      const second = dialog.getByRole('radio').nth(1);
      await expect(second).toBeChecked();
      expect(await cardHasRing(second)).toBe(true);
    });

    test('template cards: Enter selects, arrows change, whole card shows focus', async ({ page }) => {
      await page.goto('/');
      const employee = page.getByRole('radio', { name: 'Employee', exact: true });
      await employee.focus();
      await page.keyboard.press('ArrowDown');
      const contractor = page.getByRole('radio', { name: 'Contractor', exact: true });
      await expect(contractor).toBeChecked();
      await employee.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('radio', { name: 'Employee', exact: true })).toBeChecked();
      expect(await cardHasRing(page.getByRole('radio', { name: 'Employee', exact: true }))).toBe(true);
      const concise = page.getByRole('radio', { name: 'Concise', exact: true });
      await concise.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('radio', { name: 'Concise', exact: true })).toBeChecked();
      expect(await cardHasRing(page.getByRole('radio', { name: 'Concise', exact: true }))).toBe(true);
    });
  });
}

test('form radios: Enter selects; Enter on the selected option still saves an inline edit', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=partial');
  await page.locator('#field-arrangement-Hybrid').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#field-arrangement-Hybrid')).toBeChecked();
  await expect(page.locator('#field-workplace')).toHaveCount(1);
  expect(await cardHasRing(page.locator('#field-arrangement-Hybrid'))).toBe(true);
  await page.goto('/index.html?screen=review&preset=ready');
  await page.getByRole('button', { name: 'Edit pay', exact: true }).press('Enter');
  await page.locator('#field-payType-salary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#inline-form')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Edit pay', exact: true })).toBeFocused();
});

test('guide questions select with Enter', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Help me choose employee or contractor').first().click();
  const option = page.getByRole('radio', { name: 'We direct and supervise the work' }).first();
  await option.focus();
  await page.keyboard.press('Enter');
  await expect(option).toBeChecked();
});

test('clicking a card with the mouse does not show the keyboard ring', async ({ page }) => {
  await page.goto('/');
  await page.getByText('1099 · a defined engagement').click();
  const contractor = page.getByRole('radio', { name: 'Contractor', exact: true });
  await expect(contractor).toBeChecked();
  const outline = await contractor.evaluate(input => getComputedStyle(input.closest('label')).outlineStyle);
  expect(outline).toBe('none');
});
