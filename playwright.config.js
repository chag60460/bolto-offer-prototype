import { defineConfig } from '@playwright/test';

// Separate from `npm start` (4176) so tests can run while the dev server is open.
const testPort = 4177;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${testPort}`,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'node scripts/serve.mjs',
    url: `http://127.0.0.1:${testPort}`,
    env: { PORT: String(testPort) },
    reuseExistingServer: false,
  },
});
