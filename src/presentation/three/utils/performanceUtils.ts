/**
 * 3D Performance Utilities
 *
 * Pure functions for optimizing Three.js performance (DRY principle).
 * Used by 3D components for instancing, geometry merging, and LOD.
 *
 * @module performanceUtils
 */

import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LOD_DISTANCES } from '@/shared/config/performance.config';
import type { QualityLevel } from '../domain/interfaces';

/**
 * Configuration for instanced mesh creation
 */
export interface InstancedMeshConfig {
  /** Base geometry to instance */
  geometry: THREE.BufferGeometry;
  /** Material to use */
  material: THREE.Material;
  /** Number of instances */
  count: number;
  /** Whether instances receive shadows */
  receiveShadow?: boolean;
  /** Whether instances cast shadows */
  castShadow?: boolean;
}

/**
 * Creates an optimized instanced mesh for rendering many similar objects.
 * Dramatically reduces draw calls compared to individual meshes.
 *
 * @param config - Configuration for the instanced mesh
 * @returns Configured InstancedMesh
 */
export function createInstancedMesh(
  config: InstancedMeshConfig
): THREE.InstancedMesh {
  const {
    geometry,
    material,
    count,
    receiveShadow = false,
    castShadow = false,
  } = config;

  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.receiveShadow = receiveShadow;
  mesh.castShadow = castShadow;

  // Enable frustum culling by default
  mesh.frustumCulled = true;

  // Initialize all instances to identity matrix
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    matrix.identity();
    mesh.setMatrixAt(i, matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  return mesh;
}

/**
 * Sets the position, rotation, and scale for an instance in an InstancedMesh.
 *
 * @param mesh - The instanced mesh
 * @param index - Instance index
 * @param position - Position vector
 * @param rotation - Rotation in radians (Euler angles)
 * @param scale - Scale factor (uniform or vector)
 */
export function setInstanceTransform(
  mesh: THREE.InstancedMesh,
  index: number,
  position: THREE.Vector3,
  rotation?: THREE.Euler,
  scale?: THREE.Vector3 | number
): void {
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scaleVec = new THREE.Vector3();

  if (rotation) {
    quaternion.setFromEuler(rotation);
  }

  if (typeof scale === 'number') {
    scaleVec.set(scale, scale, scale);
  } else if (scale) {
    scaleVec.copy(scale);
  } else {
    scaleVec.set(1, 1, 1);
  }

  matrix.compose(position, quaternion, scaleVec);
  mesh.setMatrixAt(index, matrix);
}

/**
 * Batch update instance matrix after multiple setInstanceTransform calls.
 * Call this after you're done updating instances for the frame.
 *
 * @param mesh - The instanced mesh to update
 */
export function updateInstanceMatrix(mesh: THREE.InstancedMesh): void {
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
}

/**
 * Configuration for geometry merging
 */
export interface MergeGeometryConfig {
  /** Geometries to merge */
  geometries: THREE.BufferGeometry[];
  /** Whether to use groups for different materials */
  useGroups?: boolean;
}

/**
 * Merges multiple geometries into one to reduce draw calls.
 * Useful for static geometry that uses the same material.
 *
 * @param config - Configuration for merging
 * @returns Merged geometry
 */
export function mergeGeometries(
  config: MergeGeometryConfig
): THREE.BufferGeometry | null {
  const { geometries, useGroups = false } = config;

  if (geometries.length === 0) return null;
  if (geometries.length === 1) return geometries[0].clone();

  // Merge geometries using BufferGeometryUtils
  return BufferGeometryUtils.mergeGeometries(geometries, useGroups);
}

/**
 * Gets LOD distances based on quality level.
 *
 * @param quality - Current quality level
 * @returns LOD distance thresholds
 */
export function getLODDistances(quality: QualityLevel): {
  high: number;
  medium: number;
  low: number;
} {
  return LOD_DISTANCES[quality];
}

/**
 * Creates a Three.js LOD object with distance thresholds.
 *
 * @param levels - Array of [mesh, distance] pairs (sorted by detail, high to low)
 * @returns Configured LOD object
 */
export function createLOD(levels: Array<[THREE.Object3D, number]>): THREE.LOD {
  const lod = new THREE.LOD();

  levels.forEach(([object, distance]) => {
    lod.addLevel(object, distance);
  });

  return lod;
}

/**
 * Checks if an object is within the camera frustum.
 * Use for manual frustum culling of expensive operations.
 *
 * @param object - Object to check
 * @param camera - Camera to check against
 * @returns true if object is potentially visible
 */
export function isInFrustum(
  object: THREE.Object3D,
  camera: THREE.Camera
): boolean {
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);

  // Check bounding sphere
  if (object instanceof THREE.Mesh && object.geometry.boundingSphere) {
    const center = object.geometry.boundingSphere.center.clone();
    center.applyMatrix4(object.matrixWorld);
    return frustum.containsPoint(center);
  }

  // Fallback: check object position
  return frustum.containsPoint(object.position);
}

/**
 * Calculates distance from camera to object.
 *
 * @param object - Object to measure
 * @param camera - Camera position
 * @returns Distance in world units
 */
export function distanceToCamera(
  object: THREE.Object3D,
  camera: THREE.Camera
): number {
  return object.position.distanceTo(camera.position);
}

/**
 * Determines appropriate detail level based on camera distance.
 *
 * @param distance - Distance to camera
 * @param quality - Current quality level
 * @returns 'high' | 'medium' | 'low'
 */
export function getDetailLevel(
  distance: number,
  quality: QualityLevel
): 'high' | 'medium' | 'low' {
  const distances = getLODDistances(quality);

  if (distance <= distances.high) return 'high';
  if (distance <= distances.medium) return 'medium';
  return 'low';
}

/**
 * Creates a simple geometry for LOD fallback (lower detail).
 *
 * @param type - Type of geometry ('sphere' | 'box' | 'point')
 * @param size - Size/radius of the geometry
 * @returns Simplified geometry
 */
export function createSimplifiedGeometry(
  type: 'sphere' | 'box' | 'point',
  size: number
): THREE.BufferGeometry {
  switch (type) {
    case 'sphere':
      // Low poly sphere (8 segments vs default 32)
      return new THREE.SphereGeometry(size, 8, 6);
    case 'box':
      return new THREE.BoxGeometry(size, size, size);
    case 'point':
      // Single point geometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([0, 0, 0], 3)
      );
      return geometry;
    default:
      return new THREE.SphereGeometry(size, 8, 6);
  }
}

/**
 * Optimizes render loop by skipping frames on low-end devices.
 *
 * @param frameCount - Current frame count
 * @param quality - Quality level
 * @returns true if this frame should be rendered
 */
export function shouldRenderFrame(
  frameCount: number,
  quality: QualityLevel
): boolean {
  const skipRates: Record<QualityLevel, number> = {
    high: 1, // Render every frame
    medium: 1, // Render every frame (target 30fps handled elsewhere)
    low: 2, // Render every other frame
  };

  return frameCount % skipRates[quality] === 0;
}

/**
 * Calculates optimal particle count based on quality and viewport.
 *
 * @param baseCount - Base particle count
 * @param quality - Quality level
 * @param viewportScale - Optional viewport scale factor (0-1)
 * @returns Optimized particle count
 */
export function getOptimalParticleCount(
  baseCount: number,
  quality: QualityLevel,
  viewportScale = 1
): number {
  const qualityMultipliers: Record<QualityLevel, number> = {
    high: 1,
    medium: 0.5,
    low: 0.1,
  };

  return Math.floor(baseCount * qualityMultipliers[quality] * viewportScale);
}
