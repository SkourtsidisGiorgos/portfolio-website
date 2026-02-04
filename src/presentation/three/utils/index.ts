// WebGL utilities
export { detectWebGLSupport } from './webgl';

// Geometry helpers
export {
  degToRad,
  radToDeg,
  lerp,
  clamp,
  mapRange,
  smoothstep,
  distance3D,
  distance2D,
  pointsOnSphere,
  pointsOnCircle,
  spiralPath,
  randomPointsInBox,
  randomPointsInSphere,
  createSplinePath,
  lookAtRotation,
  easing,
  applyEasing,
  oscillate,
  colorGradient,
  type EasingFunction,
} from './geometryHelpers';

// Animation helpers (DRY - extracted from components)
export {
  pulseValue,
  oscillateScale,
  fadeOpacity,
  floatOffset,
  rotationAngle,
  glowIntensity,
  pathProgress,
  bounceValue,
  applyEasing as applyAnimationEasing,
  shouldSkipFrame,
} from './animationHelpers';

// Performance utilities (DRY - 3D optimization)
export {
  createInstancedMesh,
  setInstanceTransform,
  updateInstanceMatrix,
  mergeGeometries,
  getLODDistances,
  createLOD,
  isInFrustum,
  distanceToCamera,
  getDetailLevel,
  createSimplifiedGeometry,
  shouldRenderFrame,
  getOptimalParticleCount,
  type InstancedMeshConfig,
  type MergeGeometryConfig,
} from './performanceUtils';

// Resource management (DRY - memory leak prevention)
export {
  dispose,
  disposeChildren,
  disposeGeometry,
  disposeMaterial,
  disposeTexture,
  disposeRenderTarget,
  createCleanup,
  DisposableGroup,
  vector3Pool,
  matrix4Pool,
  quaternionPool,
  forceGCHint,
} from './resourceManager';
