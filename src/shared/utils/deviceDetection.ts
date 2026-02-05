/**
 * Device Capability Detection Utilities
 *
 * Pure functions for detecting device capabilities (DRY principle).
 * Used by usePerformanceMode to determine quality settings.
 *
 * @module deviceDetection
 */

/**
 * GPU tier classification based on capabilities
 */
export type GPUTier = 'high' | 'medium' | 'low' | 'unknown';

/**
 * Device type classification
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

/**
 * Complete device capabilities info
 */
export interface DeviceCapabilities {
  /** Detected GPU tier */
  gpuTier: GPUTier;
  /** Device type (desktop/tablet/mobile) */
  deviceType: DeviceType;
  /** Whether device is in low power mode */
  isLowPower: boolean;
  /** Available device memory in GB (0 if unknown) */
  deviceMemory: number;
  /** Number of logical CPU cores (0 if unknown) */
  hardwareConcurrency: number;
  /** Screen pixel ratio */
  pixelRatio: number;
  /** Whether touch is supported */
  hasTouch: boolean;
  /** WebGL version supported (0, 1, or 2) */
  webGLVersion: number;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

/**
 * Navigator with optional device memory property
 */
type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

/** Regex patterns for high-end GPU detection */
const HIGH_END_GPU_PATTERN =
  /nvidia|geforce|rtx|gtx|quadro|radeon (rx|pro)|amd|apple m[1-9]|intel (iris|arc)/i;

/** Regex patterns for low-end GPU detection */
const LOW_END_GPU_PATTERN =
  /intel (hd|uhd) graphics [0-9]{3}|mali|adreno [0-5]|powervr|swiftshader/i;

/**
 * Classifies GPU tier based on renderer string.
 */
function classifyGPUByRenderer(renderer: string): GPUTier | null {
  const rendererLower = renderer.toLowerCase();
  if (HIGH_END_GPU_PATTERN.test(rendererLower)) return 'high';
  if (LOW_END_GPU_PATTERN.test(rendererLower)) return 'low';
  return null;
}

/**
 * Classifies GPU tier based on max texture size.
 */
function classifyGPUByTextureSize(maxTextureSize: number): GPUTier {
  if (maxTextureSize >= 16384) return 'high';
  if (maxTextureSize >= 4096) return 'medium';
  return 'low';
}

/**
 * Detects the GPU tier based on available APIs and heuristics.
 *
 * @returns GPUTier classification
 */
export function detectGPUTier(): GPUTier {
  if (typeof window === 'undefined') return 'unknown';

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) return 'low';

    const webgl = gl as WebGLRenderingContext;
    const debugInfo = webgl.getExtension('WEBGL_debug_renderer_info');

    if (debugInfo) {
      const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      const tierByRenderer = classifyGPUByRenderer(renderer);
      if (tierByRenderer) return tierByRenderer;
    }

    // Fallback: check max texture size as capability indicator
    const maxTextureSize = webgl.getParameter(webgl.MAX_TEXTURE_SIZE);
    return classifyGPUByTextureSize(maxTextureSize);
  } catch {
    return 'unknown';
  }
}

/**
 * Detects the device type based on screen size and user agent.
 *
 * @returns DeviceType classification
 */
export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  // Check for mobile user agents
  const isMobileUA =
    /android|webos|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  const isTabletUA = /ipad|android(?!.*mobile)/.test(userAgent);

  // Screen size breakpoints
  if (width < 768 || isMobileUA) return 'mobile';
  if (width < 1024 || isTabletUA) return 'tablet';
  return 'desktop';
}

/**
 * Detects if the device is in low power mode.
 * Uses Battery API and memory heuristics.
 *
 * @returns true if low power mode is likely active
 */
export function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false;

  const nav = navigator as NavigatorWithMemory;

  // Check device memory (< 4GB indicates constrained device)
  if (nav.deviceMemory && nav.deviceMemory < 4) return true;

  // Check CPU cores (< 4 indicates constrained device)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    return true;

  return false;
}

/**
 * Gets the device memory in GB.
 *
 * @returns Memory in GB or 0 if unknown
 */
export function getDeviceMemory(): number {
  if (typeof navigator === 'undefined') return 0;
  return (navigator as NavigatorWithMemory).deviceMemory ?? 0;
}

/**
 * Gets the number of logical CPU cores.
 *
 * @returns Number of cores or 0 if unknown
 */
export function getHardwareConcurrency(): number {
  if (typeof navigator === 'undefined') return 0;
  return navigator.hardwareConcurrency ?? 0;
}

/**
 * Gets the device pixel ratio.
 *
 * @returns Pixel ratio (defaults to 1)
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio ?? 1, 2); // Cap at 2 for performance
}

/**
 * Detects if touch input is supported.
 *
 * @returns true if touch is supported
 */
export function hasTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Detects the highest supported WebGL version.
 *
 * @returns 2 for WebGL2, 1 for WebGL1, 0 for no support
 */
export function detectWebGLVersion(): number {
  if (typeof window === 'undefined') return 2; // Assume support during SSR

  try {
    const canvas = document.createElement('canvas');

    if (canvas.getContext('webgl2')) return 2;
    if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      return 1;
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Detects if the user prefers reduced motion.
 *
 * @returns true if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets comprehensive device capabilities.
 * Combines all detection functions into a single object.
 *
 * @returns Complete DeviceCapabilities object
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  return {
    gpuTier: detectGPUTier(),
    deviceType: detectDeviceType(),
    isLowPower: detectLowPower(),
    deviceMemory: getDeviceMemory(),
    hardwareConcurrency: getHardwareConcurrency(),
    pixelRatio: getPixelRatio(),
    hasTouch: hasTouch(),
    webGLVersion: detectWebGLVersion(),
    prefersReducedMotion: prefersReducedMotion(),
  };
}

/**
 * Determines if 3D should be disabled based on capabilities.
 *
 * @param capabilities Device capabilities object
 * @returns true if 3D should be disabled
 */
export function shouldDisable3D(capabilities: DeviceCapabilities): boolean {
  // No WebGL support
  if (capabilities.webGLVersion === 0) return true;

  // User prefers reduced motion
  if (capabilities.prefersReducedMotion) return true;

  // Very low-end device
  if (
    capabilities.gpuTier === 'low' &&
    capabilities.deviceType === 'mobile' &&
    capabilities.isLowPower
  ) {
    return true;
  }

  return false;
}
