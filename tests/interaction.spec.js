import { test, expect } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

test('a downloaded copy opens without a server or external requests', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
  await page.goto(pathToFileURL(resolve(root, 'index.html')).href);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Start with the right letter.');
  await expect(page.getByRole('heading', { name: 'Jump into a key moment', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Use template/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);
});

for (const width of [1440, 393]) {
  test.describe(`${width}px interactions`, () => {
    test.use({ viewport: { width, height: 1000 } });

    test('blank start: Continue moves on, flags what was left, and errors show on return', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /Use template/ }).click();
      await expect(page.getByRole('textbox', { name: 'First name (required)', exact: true })).toHaveValue('');
      await expect(page.locator('#offer-form [aria-invalid="true"]')).toHaveCount(0);
      const forward = page.getByRole('button', { name: 'Continue to Compensation', exact: true });
      await forward.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make the numbers clear.');
      await expect(page.locator('body > [role=status]')).toHaveText('Candidate & role has 9 fields missing. You can finish them before sending.');
      await expect(page.locator('.section-link[data-screen="candidate"]')).toContainText('9 fields missing');
      await page.locator('.section-link[data-screen="candidate"]').click();
      await expect(page.locator('#field-firstName')).toHaveAccessibleDescription('Enter first name.');
      await expect(page.getByRole('radio', { name: 'Remote', exact: true })).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByRole('radio', { name: 'Hybrid', exact: true })).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByRole('radio', { name: 'Remote', exact: true })).toHaveAccessibleDescription('Enter work arrangement.');
    });

    test('pay starts blank without numeric suggestions and preserves deliberate amounts', async ({ page }) => {
      await page.goto('/index.html?screen=compensation');
      const amount = page.locator('#field-amount');
      await expect(amount).toHaveValue('');
      await expect(amount).toHaveAttribute('placeholder', 'Enter an amount');
      for (const type of ['Salary', 'Hourly', 'Salary']) {
        await page.getByRole('radio', { name: type, exact: true }).check();
        await expect(amount).toHaveValue('');
        await expect(amount).toHaveAttribute('placeholder', 'Enter an amount');
      }
      await amount.fill('123456');
      await page.getByRole('radio', { name: 'Hourly', exact: true }).check();
      await expect(amount).toHaveValue('123456');
      await page.getByRole('button', { name: 'Save as draft', exact: true }).click();
      await page.goto('/');
      await page.getByRole('button', { name: 'Resume saved draft', exact: true }).click();
      await expect(amount).toHaveValue('123456');
      await expect(page.getByRole('radio', { name: 'Hourly', exact: true })).toBeChecked();
      for (const [sample, expected] of [['alex', '150000'], ['priya', '95']]) {
        await page.goto(`/index.html?screen=compensation&preset=ready&sample=${sample}`);
        await expect(amount).toHaveValue(expected);
        await expect(amount).toHaveAttribute('placeholder', 'Enter an amount');
      }
    });

    test('saved-role modal keeps focus and announces its preview inside the dialog', async ({ page, browserName }) => {
      await page.goto('/offer.html?screen=candidate&preset=partial');
      const firstName = await page.locator('#field-firstName').inputValue();
      const startDate = await page.locator('#field-startDate').inputValue();
      const opener = page.getByRole('button', { name: 'Use saved role details', exact: true });
      await opener.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Use saved role details' });
      await expect(dialog).toBeVisible();
      for (let index = 0; index < 12; index++) {
        await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
        expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
      }
      const setup = dialog.getByRole('radio', { name: /Operations/ });
      await setup.focus();
      await page.keyboard.press('Space');
      await expect(dialog.getByRole('status')).toContainText('Nothing applied yet');
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
      await expect(page.locator('#field-department')).toHaveValue('');
      await opener.press('Enter');
      await page.getByRole('radio', { name: /Operations/ }).check();
      await page.getByRole('button', { name: 'Apply role details', exact: true }).press('Enter');
      await expect(opener).toBeFocused();
      await expect(page.getByRole('status')).toContainText('applied');
      await expect(page.locator('#field-firstName')).toHaveValue(firstName);
      await expect(page.locator('#field-startDate')).toHaveValue(startDate);
      await expect(page.locator('#field-manager')).toHaveValue('Taylor Brooks');
      await expect(page.locator('#field-department')).toHaveValue('Operations');
      await page.getByRole('button', { name: 'Continue to Compensation', exact: true }).click();
      await expect(page.locator('#field-amount')).toHaveValue('');
    });

    test('review blocks invalid data, then announces a corrected simulated send', async ({ page }) => {
      await page.goto('/offer.html?screen=review&preset=invalid');
      const send = page.getByRole('button', { name: 'Send offer letter', exact: true });
      await expect(send).toHaveAttribute('aria-disabled', 'true');
      await send.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#field-email')).toBeFocused();
      await expect(page.getByRole('alert')).toContainText('Enter an email');
      await page.locator('#field-email').fill('alex.rivera@example.com');
      await page.getByRole('button', { name: 'Save changes', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Edit email', exact: true })).toBeFocused();
      await expect(page.getByRole('status')).toContainText('updated');
      await expect(send).toHaveAttribute('aria-disabled', 'false');
      await send.press('Enter');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('offer is on its way');
      await expect(page.getByRole('status')).toContainText('No real email was sent');
    });

    test('draft save and resume keep incomplete fields', async ({ page }) => {
      await page.goto('/offer.html?screen=candidate&preset=empty');
      await page.locator('#field-firstName').fill('Alex');
      await page.getByRole('button', { name: 'Save as draft', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('A pause, not a restart.');
      await expect(page.getByRole('status')).toContainText('Draft saved');
      await page.goto('/offer.html');
      await page.getByRole('button', { name: /Resume/ }).click();
      await expect(page.locator('#field-firstName')).toHaveValue('Alex');
      await expect(page.locator('#field-email')).toHaveValue('');
      await expect(page.getByRole('status')).toContainText('Draft restored');
    });

    test('inline currency and radio errors have accessible units and descriptions', async ({ page }) => {
      await page.goto('/offer.html?screen=review&preset=ready');
      await page.getByRole('button', { name: 'Edit pay', exact: true }).click();
      await expect(page.locator('#field-amount')).toHaveAccessibleDescription(/USD.*year/i);
      await page.getByRole('radio', { name: 'Hourly', exact: true }).check();
      await expect(page.locator('#field-amount')).toHaveAccessibleDescription(/USD.*hour/i);
      await page.getByRole('button', { name: 'Cancel', exact: true }).press('Escape');
      await expect(page.getByRole('button', { name: 'Edit pay', exact: true })).toBeFocused();
      await expect(page.locator('#row-pay')).toContainText('$150,000');
    });
  });
}

test('letter values link only to opened sections, so jumping ahead never flags unstarted sections', async ({ page }) => {
  const editable = key => page.locator(`#letter-content button[data-preview-field="${key}"]`);
  await page.goto('/');
  await expect(page.locator('.skip-link')).toHaveCount(0);
  await expect(page.locator('#letter-content button, #preview-recipient button')).toHaveCount(0);
  await page.getByRole('button', { name: /Use template/ }).click();
  await expect(editable('firstName')).toHaveCount(1);
  for (const key of ['amount', 'flsa', 'expiry']) await expect(editable(key)).toHaveCount(0);
  await editable('firstName').click();
  await expect(page.locator('#field-firstName')).toBeFocused();
  await page.getByRole('button', { name: 'Continue to Compensation', exact: true }).click();
  await page.getByRole('button', { name: 'Compensation', exact: false }).first().click();
  await expect(editable('amount')).toHaveCount(1);
  await expect(editable('expiry')).toHaveCount(0);
  for (const name of ['Hire setup', 'Offer terms']) {
    await expect(page.locator(`.section-link[data-screen="${name === 'Hire setup' ? 'hire' : 'terms'}"]`)).toContainText('Not started');
  }
  await page.getByRole('button', { name: 'Save as draft', exact: true }).click();
  await page.goto('/');
  await page.getByRole('button', { name: 'Resume saved draft', exact: true }).click();
  await expect(editable('amount')).toHaveCount(1);
  await expect(editable('expiry')).toHaveCount(0);
  await page.goto('/index.html?screen=review&preset=partial');
  await expect(editable('expiry')).toHaveCount(1);
  await page.getByRole('button', { name: 'Back to details', exact: true }).click();
  await expect(editable('expiry')).toHaveCount(1);
});
