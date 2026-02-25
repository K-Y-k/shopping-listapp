// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testMatch: '**/*.test.js',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: undefined,
      },
    },
  ],
});