import path from 'path';
import 'vitest/config';
import { defineConfig, type UserConfig } from 'vite';

const testConfigBase = {
  globals: true,
  // globalSetup: ['./vitest.global-setup.ts'],
  // setupFiles: ['./vitest.setup.ts'],
  // reporters: ['verbose'],
  environment: 'node',
} as const satisfies UserConfig['test'];

const unitTestConfig = {
  ...testConfigBase,
  include: [path.join(__dirname, './test/**/*.(test|spec).ts')],
  threads: false,
} satisfies UserConfig['test'];

const testConfig = unitTestConfig satisfies UserConfig['test'];

export default defineConfig({
  test: { ...testConfig },
});
