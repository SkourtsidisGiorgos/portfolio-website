import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Entry files - where Knip starts analyzing
  entry: [
    // Next.js app router entry points
    'src/app/**/page.tsx',
    'src/app/**/layout.tsx',
    'src/app/**/loading.tsx',
    'src/app/**/error.tsx',
    'src/app/**/not-found.tsx',
    'src/app/api/**/*.ts',
    // Config files that import modules
    '*.config.{ts,mjs,js}',
  ],

  // Project files to include in analysis
  project: ['src/**/*.{ts,tsx}'],

  // Ignore patterns
  ignore: [
    // Test files
    '**/__tests__/**',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    '**/test/**',
    // Config files
    'vitest.config.ts',
    'playwright.config.ts',
    // Barrel files (used for module organization)
    '**/index.ts',
  ],

  // Ignore specific dependencies that are used implicitly
  ignoreDependencies: [
    // PostCSS plugins
    '@tailwindcss/postcss',
    'postcss',
    // Tailwind CSS (loaded via PostCSS)
    'tailwindcss',
    // Prettier plugins
    'prettier-plugin-tailwindcss',
    // ESLint plugins and configs (loaded by eslint.config.mjs)
    'eslint-config-next',
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'typescript-eslint',
    // Testing libraries
    '@vitejs/plugin-react',
    '@vitest/coverage-v8',
    // Husky
    'husky',
    // Type packages (used for type checking)
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@types/three',
    // Postprocessing (peer dependency of @react-three/postprocessing)
    'postprocessing',
  ],

  // Ignore exports that match these patterns
  ignoreExportsUsedInFile: true,

  // Rules customization
  rules: {
    // Warn instead of error for these
    files: 'warn',
    exports: 'warn',
    // Keep dependencies strict
    dependencies: 'error',
    devDependencies: 'warn',
    unlisted: 'warn',
  },
};

export default config;
