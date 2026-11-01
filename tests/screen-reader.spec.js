import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => expect(await page.pageErrors()).toEqual([]));

async function recordAnnouncements(page) {
  await expect(page.locator("body > [role=status]")).toContainText(/example loaded/, { timeout: 2000 });
  await page.evaluate(() => {
    window.__heard = [];
    const watch = node => new MutationObserver(() => {
      const text = node.textContent.trim();
      if (text) window.__heard.push({ role: node.getAttribute('role'), text });
    }).observe(node, { childList: true, characterData: true, subtree: true });
    document.querySelectorAll('body > [role=status], body > [role=alert]').forEach(watch);
  });
}
const heard = async page => {
  await page.waitForTimeout(200);
  return page.evaluate(() => window.__heard.splice(0));
};

test('tabbing past empty fields in a new offer never raises errors', async ({ page, browserName }) => {
  await page.goto('/index.html?screen=candidate&preset=empty');
  await recordAnnouncements(page);
  await page.locator('#field-firstName').focus();
  for (let index = 0; index < 4; index++) await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  expect(await heard(page)).toEqual([]);
  await expect(page.locator('#offer-form [aria-invalid="true"]')).toHaveCount(0);
});

test('an edited field is validated on leaving it, politely and linked to the field', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=empty');
  await recordAnnouncements(page);
  await page.locator('#field-email').fill('alex@');
  await page.locator('#field-jobTitle').focus();
  expect(await heard(page)).toEqual([{ role: 'status', text: 'Enter an email like alex.rivera@example.com.' }]);
  await expect(page.locator('#field-email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#field-email')).toHaveAccessibleDescription(/^Enter an email like alex.rivera@example.com./);
});

test('choosing a radio option with the arrow keys never announces a false error', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=partial');
  await recordAnnouncements(page);
  await page.locator('#field-arrangement-Remote').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#field-arrangement-Hybrid')).toBeFocused();
  await expect(page.locator('#field-arrangement-Hybrid')).toBeChecked();
  const messages = await heard(page);
  expect(messages.filter(item => item.role === 'alert')).toEqual([]);
  expect(messages.map(item => item.text).join(' ')).not.toContain('Enter work arrangement');
});

test('section status is announced only when it changes', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=partial');
  await recordAnnouncements(page);
  await page.locator('#field-employment').selectOption('Part-time');
  await page.locator('#field-employment').selectOption('Full-time');
  expect(await heard(page)).toEqual([]);
  await page.locator('#field-department').selectOption('Engineering');
  expect(await heard(page)).toEqual([{ role: 'status', text: 'Candidate & role ready.' }]);
});

test('template choices have short names with separate descriptions', async ({ page }) => {
  await page.goto('/');
  const employee = page.getByRole('radio', { name: 'Employee', exact: true });
  await expect(employee).toHaveAccessibleDescription('W-2 · full-time or part-time');
  await expect(page.getByRole('radio', { name: 'Contractor', exact: true })).toHaveAccessibleDescription('1099 · a defined engagement');
  await expect(page.getByRole('radio', { name: 'Standard', exact: true })).toHaveAccessibleDescription('A detailed letter with room for all the terms. Employee offer');
  await employee.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Contractor', exact: true })).toBeFocused();
  await expect(page.getByRole('radio', { name: 'Concise', exact: true })).toHaveAccessibleDescription('The same offer details, in fewer words. Contractor agreement');
});

test('dialogs expose their description when opened', async ({ page }) => {
  await page.goto('/index.html?screen=candidate&preset=partial');
  await page.getByRole('button', { name: 'Use saved role details', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Use saved role details' })).toHaveAccessibleDescription('Choose an existing company setup. Preview what changes before applying it.');
  await page.keyboard.press('Escape');
  await page.goto('/index.html?screen=review&preset=ready');
  await page.getByRole('button', { name: 'Change worker type and template', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Change the template' })).toHaveAccessibleDescription(/Your shared details stay/);
});

test('opening a dialog moves focus to its heading, and Tab and Shift+Tab stay inside', async ({ page, browserName }) => {
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.goto('/index.html?screen=candidate&preset=partial');
  await page.getByRole('button', { name: 'Use saved role details', exact: true }).press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Use saved role details' });
  await expect(dialog.getByRole('heading', { name: 'Use saved role details' })).toBeFocused();
  await page.keyboard.press(`Shift+${tab}`);
  expect(await dialog.evaluate(node => node.contains(document.activeElement) && document.activeElement.tagName === 'BUTTON')).toBe(true);
  await page.keyboard.press(tab);
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Use saved role details', exact: true })).toBeFocused();
});

for (const [url, name, inside] of [
  ['/index.html?screen=hire&preset=partial', 'What should I choose?', 'Use recommendation: Exempt'],
  ['/index.html?screen=hire&preset=partial', 'When is an I-9 needed?', 'Use recommendation: Required'],
  ['/', 'Help me choose employee or contractor', 'We direct and supervise the work'],
]) {
  test(`"${name}" is a button that announces expanded and collapsed`, async ({ page, browserName }) => {
    const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.goto(url);
    const toggle = page.getByRole('button', { name, exact: true });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('button', { name: inside }).or(page.getByRole('radio', { name: inside }))).toHaveCount(0);
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toBeFocused();
    await page.keyboard.press(tab);
    expect(await page.evaluate(id => document.getElementById(id).contains(document.activeElement), await toggle.getAttribute('aria-controls'))).toBe(true);
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`#${await toggle.getAttribute('aria-controls')}`)).toBeHidden();
  });
}
