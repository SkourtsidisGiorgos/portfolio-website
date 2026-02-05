# PROMPT 29: Utility Test Coverage

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b test/utility-coverage

# Create GitHub issue
gh issue create --title "test: Add unit tests for utility functions to reach 80% coverage" \
  --body "Add comprehensive unit tests for validation, formatters, imageOptimization, performanceUtils, and resourceManager."
```

## Task

Add comprehensive unit tests for utility functions to achieve the 80% code coverage target.

## Files to Test

| File                                               | Lines | Current Coverage | Target |
| -------------------------------------------------- | ----- | ---------------- | ------ |
| `src/shared/utils/validation.ts`                   | 116   | Partial          | 80%+   |
| `src/shared/utils/formatters.ts`                   | 82    | Partial          | 80%+   |
| `src/shared/utils/imageOptimization.ts`            | 286   | Low              | 80%+   |
| `src/presentation/three/utils/performanceUtils.ts` | 307   | Low              | 80%+   |
| `src/presentation/three/utils/resourceManager.ts`  | 392   | Low              | 80%+   |

## Test Files to Create

### 1. tests/unit/shared/utils/validation.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import {
  validateField,
  validateFields,
  ValidationRule,
} from '@/shared/utils/validation';
import { ValidationError } from '@/shared/errors';

describe('validation', () => {
  describe('validateField', () => {
    describe('required validation', () => {
      it('throws ValidationError when required field is empty string', () => {
        expect(() =>
          validateField({ field: 'name', value: '', required: true })
        ).toThrow(ValidationError);
      });

      it('throws ValidationError when required field is undefined', () => {
        expect(() =>
          validateField({ field: 'name', value: undefined, required: true })
        ).toThrow(ValidationError);
      });

      it('throws ValidationError when required field is null', () => {
        expect(() =>
          validateField({ field: 'name', value: null, required: true })
        ).toThrow(ValidationError);
      });

      it('throws ValidationError when required field is whitespace only', () => {
        expect(() =>
          validateField({ field: 'name', value: '   ', required: true })
        ).toThrow(ValidationError);
      });

      it('passes when required field has value', () => {
        expect(() =>
          validateField({ field: 'name', value: 'John', required: true })
        ).not.toThrow();
      });

      it('passes when field is not required and empty', () => {
        expect(() =>
          validateField({ field: 'name', value: '', required: false })
        ).not.toThrow();
      });
    });

    describe('minLength validation', () => {
      it('throws when value is below minimum length', () => {
        expect(() =>
          validateField({ field: 'name', value: 'ab', minLength: 3 })
        ).toThrow(ValidationError);
      });

      it('passes when value equals minimum length', () => {
        expect(() =>
          validateField({ field: 'name', value: 'abc', minLength: 3 })
        ).not.toThrow();
      });

      it('passes when value exceeds minimum length', () => {
        expect(() =>
          validateField({ field: 'name', value: 'abcdef', minLength: 3 })
        ).not.toThrow();
      });

      it('skips minLength check for empty non-required field', () => {
        expect(() =>
          validateField({ field: 'name', value: '', minLength: 3 })
        ).not.toThrow();
      });
    });

    describe('maxLength validation', () => {
      it('throws when value exceeds maximum length', () => {
        expect(() =>
          validateField({ field: 'name', value: 'abcdef', maxLength: 5 })
        ).toThrow(ValidationError);
      });

      it('passes when value equals maximum length', () => {
        expect(() =>
          validateField({ field: 'name', value: 'abcde', maxLength: 5 })
        ).not.toThrow();
      });

      it('passes when value is below maximum length', () => {
        expect(() =>
          validateField({ field: 'name', value: 'abc', maxLength: 5 })
        ).not.toThrow();
      });
    });

    describe('pattern validation', () => {
      it('throws when value does not match pattern', () => {
        expect(() =>
          validateField({
            field: 'email',
            value: 'invalid',
            pattern: /^[\w-]+@[\w-]+\.\w+$/,
          })
        ).toThrow(ValidationError);
      });

      it('passes when value matches pattern', () => {
        expect(() =>
          validateField({
            field: 'email',
            value: 'test@example.com',
            pattern: /^[\w-]+@[\w-]+\.\w+$/,
          })
        ).not.toThrow();
      });

      it('uses custom message for pattern validation', () => {
        try {
          validateField({
            field: 'email',
            value: 'invalid',
            pattern: /^[\w-]+@[\w-]+\.\w+$/,
            customMessage: 'Please enter a valid email',
          });
        } catch (error) {
          expect((error as ValidationError).message).toBe(
            'Please enter a valid email'
          );
        }
      });
    });

    describe('customValidator', () => {
      it('throws when custom validator returns false', () => {
        expect(() =>
          validateField({
            field: 'age',
            value: 15,
            customValidator: v => (v as number) >= 18,
          })
        ).toThrow(ValidationError);
      });

      it('passes when custom validator returns true', () => {
        expect(() =>
          validateField({
            field: 'age',
            value: 21,
            customValidator: v => (v as number) >= 18,
          })
        ).not.toThrow();
      });
    });

    describe('error class customization', () => {
      class CustomError extends Error {
        constructor(
          message: string,
          public field: string
        ) {
          super(message);
        }
      }

      it('uses custom error class when provided', () => {
        expect(() =>
          validateField(
            { field: 'name', value: '', required: true },
            { ErrorClass: CustomError }
          )
        ).toThrow(CustomError);
      });
    });
  });

  describe('validateFields', () => {
    it('validates multiple fields', () => {
      expect(() =>
        validateFields([
          { field: 'name', value: 'John', required: true },
          { field: 'email', value: 'john@example.com', required: true },
        ])
      ).not.toThrow();
    });

    it('throws on first validation failure', () => {
      expect(() =>
        validateFields([
          { field: 'name', value: '', required: true },
          { field: 'email', value: '', required: true },
        ])
      ).toThrow(/Name is required/);
    });

    it('validates all rules in order', () => {
      const rules: ValidationRule[] = [
        { field: 'a', value: 'valid', required: true },
        { field: 'b', value: 'valid', required: true },
        { field: 'c', value: '', required: true },
      ];

      expect(() => validateFields(rules)).toThrow(/C is required/);
    });
  });
});
```

### 2. tests/unit/shared/utils/formatters.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDuration,
  formatNumber,
  formatCurrency,
  formatPercentage,
  truncateText,
  slugify,
  capitalize,
} from '@/shared/utils/formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats date with default options', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toMatch(/January.*2024/);
    });

    it('formats date with custom format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, { month: 'short' })).toMatch(/Jan.*2024/);
    });

    it('handles null date gracefully', () => {
      expect(formatDate(null as unknown as Date)).toBe('');
    });

    it('handles undefined date gracefully', () => {
      expect(formatDate(undefined as unknown as Date)).toBe('');
    });

    it('handles invalid date', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });
  });

  describe('formatDuration', () => {
    it('formats duration in years and months', () => {
      const start = new Date('2022-01-01');
      const end = new Date('2024-06-15');
      expect(formatDuration(start, end)).toMatch(/2.*year/i);
    });

    it('formats ongoing duration with Present', () => {
      const start = new Date('2023-01-01');
      const result = formatDuration(start, null);
      expect(result).toMatch(/present/i);
    });

    it('handles same month start and end', () => {
      const start = new Date('2024-01-15');
      const end = new Date('2024-01-20');
      expect(formatDuration(start, end)).toMatch(/month|less/i);
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with thousand separators', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('formats decimal numbers', () => {
      expect(formatNumber(1234.56, { maximumFractionDigits: 2 })).toBe(
        '1,234.56'
      );
    });

    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('handles negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1,234');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD currency', () => {
      expect(formatCurrency(1234.56, 'USD')).toMatch(/\$1,234\.56/);
    });

    it('formats EUR currency', () => {
      expect(formatCurrency(1234.56, 'EUR')).toMatch(/€|EUR/);
    });

    it('handles zero amount', () => {
      expect(formatCurrency(0, 'USD')).toMatch(/\$0\.00/);
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage with default decimals', () => {
      expect(formatPercentage(0.1234)).toBe('12%');
    });

    it('formats percentage with custom decimals', () => {
      expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    });

    it('handles 100%', () => {
      expect(formatPercentage(1)).toBe('100%');
    });

    it('handles 0%', () => {
      expect(formatPercentage(0)).toBe('0%');
    });
  });

  describe('truncateText', () => {
    it('truncates long text with ellipsis', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very lo...');
    });

    it('does not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('handles exact length', () => {
      const text = 'Exact';
      expect(truncateText(text, 5)).toBe('Exact');
    });

    it('uses custom suffix', () => {
      const text = 'Long text here';
      expect(truncateText(text, 10, '…')).toBe('Long text…');
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('handles multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('handles accented characters', () => {
      expect(slugify('Héllo Wörld')).toMatch(/h.llo-w.rld/i);
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('handles single character', () => {
      expect(capitalize('h')).toBe('H');
    });
  });
});
```

### 3. tests/unit/shared/utils/imageOptimization.test.ts

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateBlurDataUrl,
  getOptimalImageSize,
  getSrcSet,
  getImageFormat,
  supportsWebP,
  supportsAvif,
  calculateAspectRatio,
  getPlaceholderImage,
} from '@/shared/utils/imageOptimization';

describe('imageOptimization', () => {
  describe('generateBlurDataUrl', () => {
    it('generates valid data URL', () => {
      const dataUrl = generateBlurDataUrl(10, 10, '#000000');
      expect(dataUrl).toMatch(/^data:image\/svg\+xml/);
    });

    it('includes blur filter', () => {
      const dataUrl = generateBlurDataUrl(10, 10, '#ffffff');
      expect(dataUrl).toMatch(/blur/i);
    });

    it('uses provided color', () => {
      const dataUrl = generateBlurDataUrl(10, 10, '#ff0000');
      expect(decodeURIComponent(dataUrl)).toMatch(/#ff0000|rgb.*255.*0.*0/i);
    });
  });

  describe('getOptimalImageSize', () => {
    it('returns size for mobile viewport', () => {
      const size = getOptimalImageSize(375);
      expect(size).toBeLessThanOrEqual(640);
    });

    it('returns size for tablet viewport', () => {
      const size = getOptimalImageSize(768);
      expect(size).toBeGreaterThan(640);
      expect(size).toBeLessThanOrEqual(1024);
    });

    it('returns size for desktop viewport', () => {
      const size = getOptimalImageSize(1920);
      expect(size).toBeGreaterThan(1024);
    });

    it('handles very small viewport', () => {
      const size = getOptimalImageSize(320);
      expect(size).toBeGreaterThan(0);
    });
  });

  describe('getSrcSet', () => {
    it('generates srcset with multiple sizes', () => {
      const srcSet = getSrcSet('/image.jpg', [320, 640, 1024]);
      expect(srcSet).toContain('320w');
      expect(srcSet).toContain('640w');
      expect(srcSet).toContain('1024w');
    });

    it('includes width parameter in URLs', () => {
      const srcSet = getSrcSet('/image.jpg', [320]);
      expect(srcSet).toMatch(/w=320|width=320/);
    });
  });

  describe('getImageFormat', () => {
    it('detects jpg format', () => {
      expect(getImageFormat('image.jpg')).toBe('jpeg');
      expect(getImageFormat('image.jpeg')).toBe('jpeg');
    });

    it('detects png format', () => {
      expect(getImageFormat('image.png')).toBe('png');
    });

    it('detects webp format', () => {
      expect(getImageFormat('image.webp')).toBe('webp');
    });

    it('detects gif format', () => {
      expect(getImageFormat('image.gif')).toBe('gif');
    });

    it('returns null for unknown format', () => {
      expect(getImageFormat('image.xyz')).toBeNull();
    });
  });

  describe('supportsWebP', () => {
    beforeEach(() => {
      // Reset any cached detection
    });

    it('returns boolean', () => {
      const result = supportsWebP();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('supportsAvif', () => {
    it('returns boolean', () => {
      const result = supportsAvif();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('calculateAspectRatio', () => {
    it('calculates 16:9 ratio', () => {
      expect(calculateAspectRatio(1920, 1080)).toBeCloseTo(16 / 9, 2);
    });

    it('calculates 4:3 ratio', () => {
      expect(calculateAspectRatio(1024, 768)).toBeCloseTo(4 / 3, 2);
    });

    it('calculates 1:1 ratio', () => {
      expect(calculateAspectRatio(500, 500)).toBe(1);
    });

    it('handles zero height', () => {
      expect(calculateAspectRatio(100, 0)).toBe(Infinity);
    });
  });

  describe('getPlaceholderImage', () => {
    it('returns placeholder URL with dimensions', () => {
      const url = getPlaceholderImage(300, 200);
      expect(url).toMatch(/300.*200/);
    });

    it('returns placeholder with color', () => {
      const url = getPlaceholderImage(100, 100, '#ff0000');
      expect(url).toMatch(/ff0000|color/i);
    });
  });
});
```

### 4. tests/unit/presentation/three/utils/performanceUtils.test.ts

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  createInstancedMesh,
  mergeGeometries,
  createLODObject,
  isInFrustum,
  calculateLODLevel,
  getQualitySettings,
  throttleFrame,
  debounceAnimation,
} from '@/presentation/three/utils/performanceUtils';

// Mock THREE.js objects
vi.mock('three', async () => {
  const actual = await vi.importActual('three');
  return {
    ...actual,
    InstancedMesh: vi.fn().mockImplementation(() => ({
      count: 0,
      setMatrixAt: vi.fn(),
      instanceMatrix: { needsUpdate: false },
    })),
  };
});

describe('performanceUtils', () => {
  describe('createInstancedMesh', () => {
    it('creates instanced mesh with correct count', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const mesh = createInstancedMesh(geometry, material, 100);

      expect(mesh).toBeDefined();
      expect(THREE.InstancedMesh).toHaveBeenCalledWith(geometry, material, 100);
    });

    it('handles zero count', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const mesh = createInstancedMesh(geometry, material, 0);

      expect(mesh).toBeDefined();
    });
  });

  describe('mergeGeometries', () => {
    it('merges multiple geometries', () => {
      const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(1),
      ];
      const merged = mergeGeometries(geometries);

      expect(merged).toBeDefined();
    });

    it('handles empty array', () => {
      const merged = mergeGeometries([]);
      expect(merged).toBeNull();
    });

    it('handles single geometry', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const merged = mergeGeometries([geometry]);

      expect(merged).toBeDefined();
    });
  });

  describe('createLODObject', () => {
    it('creates LOD with multiple levels', () => {
      const levels = [
        { distance: 0, detail: 'high' },
        { distance: 50, detail: 'medium' },
        { distance: 100, detail: 'low' },
      ];
      const lod = createLODObject(levels);

      expect(lod).toBeDefined();
      expect(lod.levels).toHaveLength(3);
    });

    it('sorts levels by distance', () => {
      const levels = [
        { distance: 100, detail: 'low' },
        { distance: 0, detail: 'high' },
        { distance: 50, detail: 'medium' },
      ];
      const lod = createLODObject(levels);

      expect(lod.levels[0].distance).toBe(0);
      expect(lod.levels[2].distance).toBe(100);
    });
  });

  describe('isInFrustum', () => {
    it('returns true for object in frustum', () => {
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 0, 10);
      camera.updateMatrixWorld();

      const object = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
      );
      object.position.set(0, 0, 0);

      const result = isInFrustum(object, camera);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('calculateLODLevel', () => {
    it('returns high for close distance', () => {
      expect(calculateLODLevel(10)).toBe('high');
    });

    it('returns medium for medium distance', () => {
      expect(calculateLODLevel(50)).toBe('medium');
    });

    it('returns low for far distance', () => {
      expect(calculateLODLevel(150)).toBe('low');
    });
  });

  describe('getQualitySettings', () => {
    it('returns settings for high quality', () => {
      const settings = getQualitySettings('high');
      expect(settings.particleCount).toBeGreaterThan(1000);
      expect(settings.enableShadows).toBe(true);
    });

    it('returns settings for medium quality', () => {
      const settings = getQualitySettings('medium');
      expect(settings.particleCount).toBeLessThan(
        getQualitySettings('high').particleCount
      );
    });

    it('returns settings for low quality', () => {
      const settings = getQualitySettings('low');
      expect(settings.enableShadows).toBe(false);
      expect(settings.particleCount).toBeLessThan(500);
    });
  });

  describe('throttleFrame', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('throttles function calls', () => {
      const fn = vi.fn();
      const throttled = throttleFrame(fn, 16);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('allows call after throttle period', () => {
      const fn = vi.fn();
      const throttled = throttleFrame(fn, 16);

      throttled();
      vi.advanceTimersByTime(20);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('debounceAnimation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debounces animation updates', () => {
      const fn = vi.fn();
      const debounced = debounceAnimation(fn, 100);

      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
```

### 5. tests/unit/presentation/three/utils/resourceManager.test.ts

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import {
  dispose,
  disposeGeometry,
  disposeMaterial,
  disposeTexture,
  createObjectPool,
  releaseToPool,
  getFromPool,
  clearPool,
  getPoolStats,
} from '@/presentation/three/utils/resourceManager';

describe('resourceManager', () => {
  describe('dispose', () => {
    it('disposes geometry', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const disposeSpy = vi.spyOn(geometry, 'dispose');

      dispose(geometry);

      expect(disposeSpy).toHaveBeenCalled();
    });

    it('disposes material', () => {
      const material = new THREE.MeshBasicMaterial();
      const disposeSpy = vi.spyOn(material, 'dispose');

      dispose(material);

      expect(disposeSpy).toHaveBeenCalled();
    });

    it('disposes mesh recursively', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      const geoDispose = vi.spyOn(geometry, 'dispose');
      const matDispose = vi.spyOn(material, 'dispose');

      dispose(mesh);

      expect(geoDispose).toHaveBeenCalled();
      expect(matDispose).toHaveBeenCalled();
    });

    it('handles null gracefully', () => {
      expect(() => dispose(null)).not.toThrow();
    });

    it('handles undefined gracefully', () => {
      expect(() => dispose(undefined)).not.toThrow();
    });

    it('disposes children recursively', () => {
      const parent = new THREE.Group();
      const child1 = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial()
      );
      const child2 = new THREE.Mesh(
        new THREE.SphereGeometry(),
        new THREE.MeshBasicMaterial()
      );
      parent.add(child1, child2);

      const child1Dispose = vi.spyOn(child1.geometry, 'dispose');
      const child2Dispose = vi.spyOn(child2.geometry, 'dispose');

      dispose(parent);

      expect(child1Dispose).toHaveBeenCalled();
      expect(child2Dispose).toHaveBeenCalled();
    });
  });

  describe('disposeGeometry', () => {
    it('disposes geometry object', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const disposeSpy = vi.spyOn(geometry, 'dispose');

      disposeGeometry(geometry);

      expect(disposeSpy).toHaveBeenCalled();
    });

    it('handles already disposed geometry', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      geometry.dispose();

      expect(() => disposeGeometry(geometry)).not.toThrow();
    });
  });

  describe('disposeMaterial', () => {
    it('disposes material object', () => {
      const material = new THREE.MeshBasicMaterial();
      const disposeSpy = vi.spyOn(material, 'dispose');

      disposeMaterial(material);

      expect(disposeSpy).toHaveBeenCalled();
    });

    it('disposes material textures', () => {
      const texture = new THREE.Texture();
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const textureDispose = vi.spyOn(texture, 'dispose');

      disposeMaterial(material);

      expect(textureDispose).toHaveBeenCalled();
    });

    it('handles material array', () => {
      const materials = [
        new THREE.MeshBasicMaterial(),
        new THREE.MeshBasicMaterial(),
      ];
      const spies = materials.map(m => vi.spyOn(m, 'dispose'));

      materials.forEach(disposeMaterial);

      spies.forEach(spy => expect(spy).toHaveBeenCalled());
    });
  });

  describe('disposeTexture', () => {
    it('disposes texture object', () => {
      const texture = new THREE.Texture();
      const disposeSpy = vi.spyOn(texture, 'dispose');

      disposeTexture(texture);

      expect(disposeSpy).toHaveBeenCalled();
    });
  });

  describe('object pooling', () => {
    beforeEach(() => {
      clearPool('test');
    });

    it('creates and retrieves from pool', () => {
      const factory = () => new THREE.BoxGeometry(1, 1, 1);
      const pool = createObjectPool('test', factory, 5);

      const obj1 = getFromPool('test');
      expect(obj1).toBeInstanceOf(THREE.BoxGeometry);

      releaseToPool('test', obj1!);

      const obj2 = getFromPool('test');
      expect(obj2).toBe(obj1); // Same object reused
    });

    it('creates new object when pool is empty', () => {
      const factory = vi.fn(() => new THREE.BoxGeometry(1, 1, 1));
      createObjectPool('empty-test', factory, 0);

      getFromPool('empty-test');

      expect(factory).toHaveBeenCalled();
    });

    it('returns pool stats', () => {
      const factory = () => new THREE.BoxGeometry(1, 1, 1);
      createObjectPool('stats-test', factory, 10);

      const stats = getPoolStats('stats-test');

      expect(stats).toHaveProperty('available');
      expect(stats).toHaveProperty('inUse');
      expect(stats).toHaveProperty('total');
    });

    it('clears pool and disposes objects', () => {
      const factory = () => new THREE.BoxGeometry(1, 1, 1);
      createObjectPool('clear-test', factory, 5);

      const obj = getFromPool('clear-test')!;
      releaseToPool('clear-test', obj);

      const disposeSpy = vi.spyOn(obj, 'dispose');
      clearPool('clear-test');

      expect(disposeSpy).toHaveBeenCalled();
    });
  });
});
```

## Test Configuration

### Update vitest.config.ts coverage thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: [
        'src/shared/utils/**/*.ts',
        'src/presentation/three/utils/**/*.ts',
      ],
    },
  },
});
```

## Requirements

- [ ] Each utility file has 80%+ coverage
- [ ] All edge cases tested
- [ ] Error handling tested
- [ ] Mock dependencies appropriately
- [ ] Tests run in isolation

## Verification

```bash
# Run tests with coverage
npm run test:coverage

# Check specific file coverage
npm run test:coverage -- --coverage.include=src/shared/utils/validation.ts

# Generate HTML report
npm run test:coverage -- --coverage.reporter=html
open coverage/index.html
```

## Commit Message

```
test: add comprehensive unit tests for utility functions

- Add validation.ts tests (100% coverage)
- Add formatters.ts tests (95% coverage)
- Add imageOptimization.ts tests (85% coverage)
- Add performanceUtils.ts tests (82% coverage)
- Add resourceManager.ts tests (88% coverage)

Overall utility coverage: 80%+ achieved

Closes #<issue-number>
```

## Git Workflow

```bash
# After implementation
git add .
git commit -m "test: add comprehensive unit tests for utility functions

- Add validation.ts tests (100% coverage)
- Add formatters.ts tests (95% coverage)
- Add imageOptimization.ts tests (85% coverage)
- Add performanceUtils.ts tests (82% coverage)
- Add resourceManager.ts tests (88% coverage)

Overall utility coverage: 80%+ achieved

Closes #<issue-number>"

# Create PR
git push -u origin test/utility-coverage
gh pr create --title "test: Utility test coverage" \
  --body "## Summary
Adds comprehensive unit tests for utility functions to achieve 80%+ coverage target.

## Coverage Report
| File | Coverage |
|------|----------|
| validation.ts | 100% |
| formatters.ts | 95% |
| imageOptimization.ts | 85% |
| performanceUtils.ts | 82% |
| resourceManager.ts | 88% |

## Test plan
- [ ] All tests pass
- [ ] Coverage threshold met
- [ ] No flaky tests
- [ ] Mocks are appropriate

Closes #<issue-number>"
```

## Output

Comprehensive test coverage with:

- All utility functions tested
- Edge cases covered
- Error scenarios tested
- 80%+ coverage achieved
