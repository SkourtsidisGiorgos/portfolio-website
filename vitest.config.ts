import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/integration/**/*.test.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
    ],
    exclude: ['node_modules', '.next', 'tests/e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
        '.next/',
        // Static data files
        'src/data/**/*.json',
        // 3D scenes and WebGL components - tested via E2E, not unit testable in jsdom
        'src/presentation/three/scenes/**/*.tsx',
        'src/presentation/three/components/**/*.tsx',
        'src/presentation/three/effects/**/*.tsx',
        'src/presentation/three/hooks/useScrollProgress.ts',
        'src/presentation/three/hooks/useCursorPosition.ts',
        'src/presentation/three/hooks/useAnimationFrame.ts',
        'src/presentation/three/hooks/useWebGLSupport.ts',
        'src/presentation/three/hooks/useCameraPosition.ts',
        'src/presentation/three/utils/webgl.ts',
        // Barrel exports (re-export only, no logic)
        '**/index.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 75, // Browser-specific hooks have edge cases tested via E2E
        functions: 80,
        lines: 80,
      },
    },
  },
});
