import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePerformanceMode, getQualityValue } from '../usePerformanceMode';

// Mock device detection utilities
vi.mock('@/shared/utils/deviceDetection', () => ({
  getDeviceCapabilities: vi.fn(() => ({
    gpuTier: 'high',
    deviceType: 'desktop',
    isLowPower: false,
    deviceMemory: 8,
    hardwareConcurrency: 8,
    pixelRatio: 2,
    hasTouch: false,
    webGLVersion: 2,
    prefersReducedMotion: false,
  })),
  detectDeviceType: vi.fn(() => 'desktop'),
  detectLowPower: vi.fn(() => false),
  detectGPUTier: vi.fn(() => 'high'),
  prefersReducedMotion: vi.fn(() => false),
}));

// Mock performance config with actual structure
vi.mock('@/shared/config/performance.config', () => ({
  QUALITY_CONFIGS: {
    high: {
      quality: 'high',
      particleCount: 10000,
      enableEffects: true,
      enableShadows: true,
      enableReflections: true,
      targetFPS: 60,
      pixelRatioMultiplier: 1,
      lodBias: 0,
      textureQuality: 1,
      maxDrawCalls: 200,
      maxTriangles: 500000,
    },
    medium: {
      quality: 'medium',
      particleCount: 5000,
      enableEffects: true,
      enableShadows: false,
      enableReflections: false,
      targetFPS: 30,
      pixelRatioMultiplier: 0.75,
      lodBias: 1,
      textureQuality: 0.75,
      maxDrawCalls: 100,
      maxTriangles: 200000,
    },
    low: {
      quality: 'low',
      particleCount: 1000,
      enableEffects: false,
      enableShadows: false,
      enableReflections: false,
      targetFPS: 30,
      pixelRatioMultiplier: 0.5,
      lodBias: 2,
      textureQuality: 0.5,
      maxDrawCalls: 50,
      maxTriangles: 50000,
    },
  },
  getAnimationConfig: vi.fn(quality => ({
    enableParticles: quality !== 'low',
    enableGlow: quality !== 'low',
    enableBlur: quality === 'high',
    frameSkip: quality === 'high' ? 1 : quality === 'medium' ? 2 : 3,
    reducedMotion: quality === 'low',
  })),
  scaleByQuality: vi.fn((value: number, quality: string) => {
    const multipliers: Record<string, number> = {
      high: 1,
      medium: 0.5,
      low: 0.1,
    };
    return Math.floor(value * multipliers[quality]);
  }),
}));

describe('usePerformanceMode', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns quality level from config', () => {
    const { result } = renderHook(() => usePerformanceMode());

    expect(result.current.quality).toBe('high');
    // The hook uses the QUALITY_CONFIGS structure
    expect(result.current.particleCount).toBeDefined();
  });

  it('respects forceQuality option', () => {
    const { result } = renderHook(() =>
      usePerformanceMode({ forceQuality: 'low' })
    );

    expect(result.current.quality).toBe('low');
  });

  it('scales particle count based on quality', () => {
    const { result: highResult } = renderHook(() =>
      usePerformanceMode({ baseParticleCount: 1000, forceQuality: 'high' })
    );

    const { result: lowResult } = renderHook(() =>
      usePerformanceMode({ baseParticleCount: 1000, forceQuality: 'low' })
    );

    // scaleByQuality returns 1000 * 1 for high, 1000 * 0.1 for low
    expect(highResult.current.particleCount).toBe(1000);
    expect(lowResult.current.particleCount).toBe(100);
  });

  it('returns correct isMobile flag', () => {
    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isMobile).toBe(false);
  });

  it('returns correct isLowPower flag', () => {
    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isLowPower).toBe(false);
  });

  it('memoizes the result', () => {
    const { result, rerender } = renderHook(() => usePerformanceMode());

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });
});

describe('getQualityValue', () => {
  it('returns high value for high quality', () => {
    expect(getQualityValue('high', 100, 50, 10)).toBe(100);
  });

  it('returns medium value for medium quality', () => {
    expect(getQualityValue('medium', 100, 50, 10)).toBe(50);
  });

  it('returns low value for low quality', () => {
    expect(getQualityValue('low', 100, 50, 10)).toBe(10);
  });

  it('works with any value types', () => {
    expect(getQualityValue('high', 'full', 'half', 'minimal')).toBe('full');
    expect(getQualityValue('medium', true, false, false)).toBe(false);
  });
});
