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
