import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  detectDeviceType,
  detectLowPower,
  getDeviceMemory,
  getHardwareConcurrency,
  getPixelRatio,
  hasTouch,
  prefersReducedMotion,
  shouldDisable3D,
  type DeviceCapabilities,
} from '../deviceDetection';

describe('deviceDetection', () => {
  describe('detectDeviceType', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {
        innerWidth: 1920,
      });
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns desktop for large screens', () => {
      vi.stubGlobal('window', { innerWidth: 1920 });
      expect(detectDeviceType()).toBe('desktop');
    });

    it('returns tablet for medium screens', () => {
      vi.stubGlobal('window', { innerWidth: 800 });
      expect(detectDeviceType()).toBe('tablet');
    });

    it('returns mobile for small screens', () => {
      vi.stubGlobal('window', { innerWidth: 375 });
      expect(detectDeviceType()).toBe('mobile');
    });

    it('returns mobile for mobile user agent', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
      });
      vi.stubGlobal('window', { innerWidth: 1024 });
      expect(detectDeviceType()).toBe('mobile');
    });
  });

  describe('detectLowPower', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns false when memory is sufficient', () => {
      vi.stubGlobal('navigator', {
        deviceMemory: 8,
        hardwareConcurrency: 8,
      });
      expect(detectLowPower()).toBe(false);
    });

    it('returns true when memory is low', () => {
      vi.stubGlobal('navigator', {
        deviceMemory: 2,
        hardwareConcurrency: 8,
      });
      expect(detectLowPower()).toBe(true);
    });

    it('returns true when CPU cores are low', () => {
      vi.stubGlobal('navigator', {
        deviceMemory: 8,
        hardwareConcurrency: 2,
      });
      expect(detectLowPower()).toBe(true);
    });
  });

  describe('getDeviceMemory', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns device memory when available', () => {
      vi.stubGlobal('navigator', { deviceMemory: 8 });
      expect(getDeviceMemory()).toBe(8);
    });

    it('returns 0 when device memory is not available', () => {
      vi.stubGlobal('navigator', {});
      expect(getDeviceMemory()).toBe(0);
    });
  });

  describe('getHardwareConcurrency', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns hardware concurrency when available', () => {
      vi.stubGlobal('navigator', { hardwareConcurrency: 8 });
      expect(getHardwareConcurrency()).toBe(8);
    });

    it('returns 0 when not available', () => {
      vi.stubGlobal('navigator', {});
      expect(getHardwareConcurrency()).toBe(0);
    });
  });

  describe('getPixelRatio', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns pixel ratio', () => {
      vi.stubGlobal('window', { devicePixelRatio: 2 });
      expect(getPixelRatio()).toBe(2);
    });

    it('caps at 2 for performance', () => {
      vi.stubGlobal('window', { devicePixelRatio: 3 });
      expect(getPixelRatio()).toBe(2);
    });

    it('returns 1 when not available', () => {
      vi.stubGlobal('window', {});
      expect(getPixelRatio()).toBe(1);
    });
  });

  describe('hasTouch', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns true when ontouchstart is available', () => {
      vi.stubGlobal('window', { ontouchstart: {} });
      vi.stubGlobal('navigator', { maxTouchPoints: 0 });
      expect(hasTouch()).toBe(true);
    });

    it('returns true when maxTouchPoints > 0', () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', { maxTouchPoints: 5 });
      expect(hasTouch()).toBe(true);
    });

    it('returns false when no touch support', () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('navigator', { maxTouchPoints: 0 });
      expect(hasTouch()).toBe(false);
    });
  });

  describe('prefersReducedMotion', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns true when user prefers reduced motion', () => {
      vi.stubGlobal('window', {
        matchMedia: () => ({ matches: true }),
      });
      expect(prefersReducedMotion()).toBe(true);
    });

    it('returns false when user does not prefer reduced motion', () => {
      vi.stubGlobal('window', {
        matchMedia: () => ({ matches: false }),
      });
      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('shouldDisable3D', () => {
    it('returns true when WebGL version is 0', () => {
      const capabilities: DeviceCapabilities = {
        gpuTier: 'high',
        deviceType: 'desktop',
        isLowPower: false,
        deviceMemory: 8,
        hardwareConcurrency: 8,
        pixelRatio: 1,
        hasTouch: false,
        webGLVersion: 0,
        prefersReducedMotion: false,
      };
      expect(shouldDisable3D(capabilities)).toBe(true);
    });

    it('returns true when reduced motion is preferred', () => {
      const capabilities: DeviceCapabilities = {
        gpuTier: 'high',
        deviceType: 'desktop',
        isLowPower: false,
        deviceMemory: 8,
        hardwareConcurrency: 8,
        pixelRatio: 1,
        hasTouch: false,
        webGLVersion: 2,
        prefersReducedMotion: true,
      };
      expect(shouldDisable3D(capabilities)).toBe(true);
    });

    it('returns true for very low-end mobile devices', () => {
      const capabilities: DeviceCapabilities = {
        gpuTier: 'low',
        deviceType: 'mobile',
        isLowPower: true,
        deviceMemory: 2,
        hardwareConcurrency: 2,
        pixelRatio: 1,
        hasTouch: true,
        webGLVersion: 1,
        prefersReducedMotion: false,
      };
      expect(shouldDisable3D(capabilities)).toBe(true);
    });

    it('returns false for capable devices', () => {
      const capabilities: DeviceCapabilities = {
        gpuTier: 'high',
        deviceType: 'desktop',
        isLowPower: false,
        deviceMemory: 16,
        hardwareConcurrency: 8,
        pixelRatio: 2,
        hasTouch: false,
        webGLVersion: 2,
        prefersReducedMotion: false,
      };
      expect(shouldDisable3D(capabilities)).toBe(false);
    });
  });
});
