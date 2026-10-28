import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
export default defineConfig({
  testDir: './browser',
  outputDir: join(tmpdir(), 'want-desyst-issue-1', 'results'),
  workers: 1, timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4397', browserName: 'chromium', launchOptions: { chromiumSandbox: true }, reducedMotion: 'reduce' },
  webServer: { command: 'bun run --cwd apps/showcase dev --host 127.0.0.1 --port 4397', url: 'http://127.0.0.1:4397', reuseExistingServer: false, timeout: 60000 }
});
