// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Serves the repo under /portfolio/, the same subpath GitHub Pages uses,
// so broken relative paths fail here before they reach the live site.
const PORT = 4173;

module.exports = defineConfig({
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/portfolio/`,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: {
    command: `node tests/serve.js ${PORT}`,
    url: `http://localhost:${PORT}/portfolio/`,
    reuseExistingServer: !process.env.CI
  }
});
