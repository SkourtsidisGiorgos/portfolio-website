/**
 * Resource Manager for Three.js
 *
 * Utilities for proper disposal of Three.js resources to prevent memory leaks.
 * Single Responsibility: resource lifecycle management.
 *
 * @module resourceManager
 */

import * as THREE from 'three';

/**
 * Tracked resource for pooling
 */
interface PooledResource<T> {
  resource: T;
  inUse: boolean;
  lastUsed: number;
}

/**
 * Resource pool for reusable objects
 */
class ResourcePool<T> {
  private pool: PooledResource<T>[] = [];
  private createFn: () => T;
  private resetFn: (resource: T) => void;
  private maxSize: number;

  constructor(
    createFn: () => T,
    resetFn: (resource: T) => void,
    maxSize = 100
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
  }

  /**
   * Acquires a resource from the pool or creates a new one.
   */
  acquire(): T {
    // Find an available resource
    const available = this.pool.find(item => !item.inUse);
    if (available) {
      available.inUse = true;
      available.lastUsed = Date.now();
      this.resetFn(available.resource);
      return available.resource;
    }

    // Create new resource if pool isn't full
    if (this.pool.length < this.maxSize) {
      const resource = this.createFn();
      this.pool.push({
        resource,
        inUse: true,
        lastUsed: Date.now(),
      });
      return resource;
    }

    // Pool is full, create a non-pooled resource
    return this.createFn();
  }

  /**
   * Releases a resource back to the pool.
   */
  release(resource: T): void {
    const item = this.pool.find(p => p.resource === resource);
    if (item) {
      item.inUse = false;
    }
  }

  /**
   * Clears all resources from the pool.
   */
  clear(): void {
    this.pool = [];
  }

  /**
   * Gets pool statistics.
   */
  getStats(): { total: number; inUse: number; available: number } {
    const inUse = this.pool.filter(p => p.inUse).length;
    return {
      total: this.pool.length,
      inUse,
      available: this.pool.length - inUse,
    };
  }
}

/**
 * Vector3 pool for temporary calculations
 */
export const vector3Pool = new ResourcePool<THREE.Vector3>(
  () => new THREE.Vector3(),
  v => v.set(0, 0, 0),
  50
);

/**
 * Matrix4 pool for temporary calculations
 */
export const matrix4Pool = new ResourcePool<THREE.Matrix4>(
  () => new THREE.Matrix4(),
  m => m.identity(),
  20
);

/**
 * Quaternion pool for temporary calculations
 */
export const quaternionPool = new ResourcePool<THREE.Quaternion>(
  () => new THREE.Quaternion(),
  q => q.identity(),
  20
);

/**
 * Disposes a Three.js geometry properly.
 *
 * @param geometry - Geometry to dispose
 */
export function disposeGeometry(geometry: THREE.BufferGeometry | null): void {
  if (!geometry) return;

  geometry.dispose();

  // Clear attributes
  const attributes = geometry.attributes;
  for (const key in attributes) {
    const attribute = attributes[key];
    if (attribute && 'dispose' in attribute) {
      // @ts-expect-error - dispose exists on some attributes
      attribute.dispose?.();
    }
  }

  // Clear index
  if (geometry.index) {
    geometry.setIndex(null);
  }
}

/**
 * Disposes a Three.js material properly.
 *
 * @param material - Material or array of materials to dispose
 */
export function disposeMaterial(
  material: THREE.Material | THREE.Material[] | null
): void {
  if (!material) return;

  const materials = Array.isArray(material) ? material : [material];

  materials.forEach(mat => {
    // Dispose textures
    Object.keys(mat).forEach(key => {
      const value = mat[key as keyof THREE.Material];
      if (value instanceof THREE.Texture) {
        disposeTexture(value);
      }
    });

    mat.dispose();
  });
}

/**
 * Disposes a Three.js texture properly.
 *
 * @param texture - Texture to dispose
 */
export function disposeTexture(texture: THREE.Texture | null): void {
  if (!texture) return;
  texture.dispose();
}

/**
 * Recursively disposes a Three.js object and all its children.
 * This is the main function to use for cleanup.
 *
 * @param object - Object to dispose
 */
export function dispose(object: THREE.Object3D | null): void {
  if (!object) return;

  // Recursively dispose children first
  while (object.children.length > 0) {
    dispose(object.children[0]);
    object.remove(object.children[0]);
  }

  // Dispose geometry
  if (
    object instanceof THREE.Mesh ||
    object instanceof THREE.Line ||
    object instanceof THREE.Points
  ) {
    disposeGeometry(object.geometry);
    disposeMaterial(object.material);
  }

  // Handle InstancedMesh specifically
  if (object instanceof THREE.InstancedMesh) {
    object.dispose();
  }

  // Remove from parent
  if (object.parent) {
    object.parent.remove(object);
  }
}

/**
 * Disposes all children of an object but keeps the object itself.
 *
 * @param parent - Parent object whose children should be disposed
 */
export function disposeChildren(parent: THREE.Object3D): void {
  while (parent.children.length > 0) {
    dispose(parent.children[0]);
  }
}

/**
 * Disposes a render target and its textures.
 *
 * @param renderTarget - Render target to dispose
 */
export function disposeRenderTarget(
  renderTarget: THREE.WebGLRenderTarget | null
): void {
  if (!renderTarget) return;

  renderTarget.dispose();

  if (renderTarget.texture) {
    disposeTexture(renderTarget.texture);
  }

  if (renderTarget.depthTexture) {
    disposeTexture(renderTarget.depthTexture);
  }
}

/**
 * Creates a disposable group that tracks resources for easy cleanup.
 */
export class DisposableGroup {
  private objects: THREE.Object3D[] = [];
  private textures: THREE.Texture[] = [];
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];
  private renderTargets: THREE.WebGLRenderTarget[] = [];

  /**
   * Tracks an object for disposal.
   */
  track<T extends THREE.Object3D>(object: T): T {
    this.objects.push(object);
    return object;
  }

  /**
   * Tracks a texture for disposal.
   */
  trackTexture<T extends THREE.Texture>(texture: T): T {
    this.textures.push(texture);
    return texture;
  }

  /**
   * Tracks a material for disposal.
   */
  trackMaterial<T extends THREE.Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  /**
   * Tracks a geometry for disposal.
   */
  trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  /**
   * Tracks a render target for disposal.
   */
  trackRenderTarget<T extends THREE.WebGLRenderTarget>(target: T): T {
    this.renderTargets.push(target);
    return target;
  }

  /**
   * Disposes all tracked resources.
   */
  dispose(): void {
    this.objects.forEach(obj => dispose(obj));
    this.textures.forEach(tex => disposeTexture(tex));
    this.materials.forEach(mat => disposeMaterial(mat));
    this.geometries.forEach(geo => disposeGeometry(geo));
    this.renderTargets.forEach(rt => disposeRenderTarget(rt));

    this.objects = [];
    this.textures = [];
    this.materials = [];
    this.geometries = [];
    this.renderTargets = [];
  }

  /**
   * Gets count of tracked resources.
   */
  getStats(): {
    objects: number;
    textures: number;
    materials: number;
    geometries: number;
    renderTargets: number;
  } {
    return {
      objects: this.objects.length,
      textures: this.textures.length,
      materials: this.materials.length,
      geometries: this.geometries.length,
      renderTargets: this.renderTargets.length,
    };
  }
}

/**
 * Hook-style cleanup helper.
 * Returns a dispose function to call on unmount.
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = createCleanup();
 *   const mesh = cleanup.track(new THREE.Mesh(...));
 *   scene.add(mesh);
 *   return () => cleanup.dispose();
 * }, []);
 * ```
 */
export function createCleanup(): DisposableGroup {
  return new DisposableGroup();
}

/**
 * Checks WebGL context for memory info (if available).
 *
 * @param gl - WebGL rendering context
 * @returns Memory info or null if not available
 */
export function getWebGLMemoryInfo(
  gl: WebGLRenderingContext
): { total: number; used: number } | null {
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  if (!ext) return null;

  // Note: Most browsers don't expose actual memory info
  // This is mainly useful for debugging with browser extensions
  return null;
}

/**
 * Forces garbage collection hint (doesn't guarantee collection).
 * Use after disposing many resources.
 */
export function forceGCHint(): void {
  // Hint to browser that now would be a good time for GC
  if (typeof window !== 'undefined') {
    const win = window as Window & { gc?: () => void };
    if (win.gc) {
      try {
        win.gc();
      } catch {
        // gc not available (needs --expose-gc flag in Node)
      }
    }
  }
}
