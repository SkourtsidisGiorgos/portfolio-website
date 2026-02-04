/**
 * Image Optimization Utilities
 *
 * Pure functions for image optimization (DRY principle).
 * Integration helpers for next/image.
 *
 * @module imageOptimization
 */

/**
 * Standard device breakpoints for responsive images
 */
export const DEVICE_SIZES = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

/**
 * Image format support detection
 */
export interface ImageFormatSupport {
  webp: boolean;
  avif: boolean;
}

/**
 * Blur placeholder configuration
 */
export interface BlurPlaceholder {
  /** Base64 encoded blur image */
  blurDataURL: string;
  /** Placeholder type */
  placeholder: 'blur';
}

/**
 * Responsive image source set entry
 */
export interface SrcSetEntry {
  src: string;
  width: number;
  descriptor: string;
}

/**
 * Detects browser support for modern image formats.
 *
 * @returns Promise resolving to format support info
 */
export async function detectImageFormatSupport(): Promise<ImageFormatSupport> {
  if (typeof window === 'undefined') {
    // Assume modern support during SSR
    return { webp: true, avif: true };
  }

  const checkFormat = (format: string): Promise<boolean> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      // Tiny test images
      if (format === 'webp') {
        img.src =
          'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
      } else if (format === 'avif') {
        img.src =
          'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgADlAgIGkyCR/wAABAAACHAAABhWBhbmQ=';
      }
    });
  };

  const [webp, avif] = await Promise.all([
    checkFormat('webp'),
    checkFormat('avif'),
  ]);

  return { webp, avif };
}

/**
 * Generates a tiny SVG blur placeholder.
 * More efficient than base64 images for placeholders.
 *
 * @param width - Image width
 * @param height - Image height
 * @param color - Primary color for the blur (hex)
 * @returns Base64 encoded SVG blur placeholder
 */
export function generateBlurSVG(
  width: number,
  height: number,
  color = '#1a1a2e'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="blur" x="0" y="0">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      <rect width="${width}" height="${height}" fill="${color}" filter="url(#blur)" />
    </svg>
  `;

  // Convert to base64
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
  }

  // Node.js environment
  return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
}

/**
 * Creates a blur placeholder object for next/image.
 *
 * @param width - Image width
 * @param height - Image height
 * @param color - Primary color for the blur
 * @returns BlurPlaceholder object
 */
export function createBlurPlaceholder(
  width: number,
  height: number,
  color?: string
): BlurPlaceholder {
  return {
    blurDataURL: generateBlurSVG(width, height, color),
    placeholder: 'blur',
  };
}

/**
 * Generates responsive srcSet string for standard breakpoints.
 *
 * @param basePath - Base path to the image (without extension)
 * @param extension - Image extension
 * @param widths - Array of widths to include
 * @returns srcSet string
 */
export function generateSrcSet(
  basePath: string,
  extension = 'webp',
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return widths
    .map(width => `${basePath}-${width}.${extension} ${width}w`)
    .join(', ');
}

/**
 * Generates sizes attribute for responsive images.
 *
 * @param config - Sizes configuration
 * @returns sizes attribute string
 *
 * @example
 * ```tsx
 * generateSizes({
 *   default: '100vw',
 *   md: '50vw',
 *   lg: '33vw',
 * })
 * // Returns: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
 * ```
 */
export function generateSizes(config: {
  default: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const breakpoints = {
    '2xl': 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  };

  const parts: string[] = [];

  // Add from largest to smallest
  if (config['2xl']) {
    parts.push(`(min-width: ${breakpoints['2xl']}px) ${config['2xl']}`);
  }
  if (config.xl) {
    parts.push(`(min-width: ${breakpoints.xl}px) ${config.xl}`);
  }
  if (config.lg) {
    parts.push(`(min-width: ${breakpoints.lg}px) ${config.lg}`);
  }
  if (config.md) {
    parts.push(`(min-width: ${breakpoints.md}px) ${config.md}`);
  }
  if (config.sm) {
    parts.push(`(min-width: ${breakpoints.sm}px) ${config.sm}`);
  }

  // Add default last
  parts.push(config.default);

  return parts.join(', ');
}

/**
 * Calculates aspect ratio from dimensions.
 *
 * @param width - Image width
 * @param height - Image height
 * @returns Aspect ratio string (e.g., "16/9")
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Returns the best image format to request based on support.
 *
 * @param support - Format support info
 * @param preferAvif - Whether to prefer AVIF over WebP
 * @returns Best format to use
 */
export function getBestFormat(
  support: ImageFormatSupport,
  preferAvif = true
): 'avif' | 'webp' | 'jpg' {
  if (preferAvif && support.avif) return 'avif';
  if (support.webp) return 'webp';
  return 'jpg';
}

/**
 * Image loading priority hints.
 */
export const IMAGE_PRIORITY = {
  /** Above the fold, critical for LCP */
  HIGH: { priority: true, loading: 'eager' } as const,
  /** Below the fold but might be visible soon */
  MEDIUM: { priority: false, loading: 'lazy' } as const,
  /** Far below the fold */
  LOW: { priority: false, loading: 'lazy' } as const,
};

/**
 * Determines loading priority based on position.
 *
 * @param index - Position index in a list
 * @param aboveFoldCount - Number of items above the fold
 * @returns Priority configuration
 */
export function getImagePriority(
  index: number,
  aboveFoldCount = 3
): typeof IMAGE_PRIORITY.HIGH | typeof IMAGE_PRIORITY.LOW {
  return index < aboveFoldCount ? IMAGE_PRIORITY.HIGH : IMAGE_PRIORITY.LOW;
}

/**
 * Optimizes an image URL for a specific width.
 * Works with Vercel Image Optimization.
 *
 * @param src - Original image source
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  src: string,
  width: number,
  quality = 75
): string {
  // For external URLs or already optimized URLs, return as-is
  if (src.startsWith('http') || src.includes('/_next/image')) {
    return src;
  }

  // Use Next.js image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
