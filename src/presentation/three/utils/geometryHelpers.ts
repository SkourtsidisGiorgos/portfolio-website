import * as THREE from 'three';

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

/**
 * Smooth step interpolation
 */
export function smoothstep(min: number, max: number, value: number): number {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Calculate distance between two 3D points
 */
export function distance3D(
  p1: [number, number, number],
  p2: [number, number, number]
): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate distance between two 2D points
 */
export function distance2D(p1: [number, number], p2: [number, number]): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Generate points on a sphere surface
 */
export function pointsOnSphere(
  count: number,
  radius: number = 1
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return points;
}

/**
 * Generate points on a circle
 */
export function pointsOnCircle(
  count: number,
  radius: number = 1,
  center: [number, number, number] = [0, 0, 0]
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep;
    const x = center[0] + Math.cos(angle) * radius;
    const z = center[2] + Math.sin(angle) * radius;
    points.push(new THREE.Vector3(x, center[1], z));
  }

  return points;
}

/**
 * Generate a spiral path
 */
export function spiralPath(
  turns: number,
  height: number,
  radius: number,
  pointsPerTurn: number = 50
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const totalPoints = turns * pointsPerTurn;

  for (let i = 0; i <= totalPoints; i++) {
    const t = i / totalPoints;
    const angle = t * turns * Math.PI * 2;
    const y = t * height - height / 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

/**
 * Generate random points within a box volume
 */
export function randomPointsInBox(
  count: number,
  width: number,
  height: number,
  depth: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * width;
    const y = (Math.random() - 0.5) * height;
    const z = (Math.random() - 0.5) * depth;
    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

/**
 * Generate random points within a sphere volume
 */
export function randomPointsInSphere(
  count: number,
  radius: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    // Use cube rejection method for uniform distribution
    let point: THREE.Vector3;
    do {
      point = new THREE.Vector3(
        (Math.random() - 0.5) * 2 * radius,
        (Math.random() - 0.5) * 2 * radius,
        (Math.random() - 0.5) * 2 * radius
      );
    } while (point.length() > radius);

    points.push(point);
  }

  return points;
}

/**
 * Create a catmull-rom spline through points
 */
export function createSplinePath(
  points: THREE.Vector3[],
  segments: number = 50,
  closed: boolean = false
): THREE.Vector3[] {
  const curve = new THREE.CatmullRomCurve3(points, closed);
  return curve.getPoints(segments);
}

/**
 * Calculate look-at rotation for an object
 */
export function lookAtRotation(
  from: THREE.Vector3,
  to: THREE.Vector3
): THREE.Euler {
  const matrix = new THREE.Matrix4().lookAt(
    from,
    to,
    new THREE.Vector3(0, 1, 0)
  );
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
  return new THREE.Euler().setFromQuaternion(quaternion);
}

/**
 * Ease functions for animations
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

export type EasingFunction = keyof typeof easing;

/**
 * Apply easing function to a value
 */
export function applyEasing(
  t: number,
  easingFn: EasingFunction | ((t: number) => number)
): number {
  if (typeof easingFn === 'function') {
    return easingFn(t);
  }
  return easing[easingFn](t);
}

/**
 * Oscillate between min and max using sine wave
 */
export function oscillate(
  time: number,
  min: number,
  max: number,
  frequency: number = 1
): number {
  const range = (max - min) / 2;
  const center = min + range;
  return center + Math.sin(time * frequency * Math.PI * 2) * range;
}

/**
 * Create a color gradient between two colors
 */
export function colorGradient(
  color1: THREE.Color | string,
  color2: THREE.Color | string,
  t: number
): THREE.Color {
  const c1 = color1 instanceof THREE.Color ? color1 : new THREE.Color(color1);
  const c2 = color2 instanceof THREE.Color ? color2 : new THREE.Color(color2);
  return new THREE.Color().lerpColors(c1, c2, t);
}
