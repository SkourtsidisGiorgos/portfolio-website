// WebGL utilities
export { detectWebGLSupport } from './webgl';

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
