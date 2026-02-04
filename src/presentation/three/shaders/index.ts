import * as THREE from 'three';

/**
 * Data Flow Vertex Shader
 * Creates flowing particle effect with time-based animation
 */
export const dataFlowVertexShader = /* glsl */ `
  uniform float u_time;
  uniform float u_speed;

  attribute float instanceIndex;
  attribute vec3 instanceOffset;

  varying float v_progress;
  varying float v_index;

  void main() {
    v_index = instanceIndex;

    // Calculate progress along the flow path
    float offset = instanceIndex * 0.01;
    v_progress = fract((u_time * u_speed) + offset);

    // Apply position with offset
    vec3 pos = position + instanceOffset;

    // Add subtle wave motion
    float wave = sin(u_time * 2.0 + instanceIndex * 0.5) * 0.05;
    pos.y += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation based on distance
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 10.0 * (1.0 / -mvPosition.z);
  }
`;

/**
 * Data Flow Fragment Shader
 * Creates gradient colored particles with glow effect
 */
export const dataFlowFragmentShader = /* glsl */ `
  uniform vec3 u_colorStart;
  uniform vec3 u_colorEnd;
  uniform float u_opacity;
  uniform float u_time;

  varying float v_progress;
  varying float v_index;

  void main() {
    // Create circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Discard fragments outside circle
    if (dist > 0.5) discard;

    // Soft edge falloff for glow effect
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);

    // Color gradient based on progress
    vec3 color = mix(u_colorStart, u_colorEnd, v_progress);

    // Add subtle pulse
    float pulse = 0.5 + 0.5 * sin(u_time * 3.0 + v_index * 0.1);
    alpha *= 0.7 + 0.3 * pulse;

    gl_FragColor = vec4(color, alpha * u_opacity);
  }
`;

/**
 * Glow Vertex Shader
 * Simple vertex shader for glow effect billboards
 */
export const glowVertexShader = /* glsl */ `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Glow Fragment Shader
 * Creates soft glow effect for nodes
 */
export const glowFragmentShader = /* glsl */ `
  uniform vec3 u_color;
  uniform float u_intensity;
  uniform float u_time;

  varying vec2 v_uv;

  void main() {
    vec2 center = v_uv - vec2(0.5);
    float dist = length(center);

    // Radial gradient for glow
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.0);

    // Subtle pulse animation
    float pulse = 0.9 + 0.1 * sin(u_time * 2.0);

    float alpha = glow * u_intensity * pulse;

    gl_FragColor = vec4(u_color, alpha);
  }
`;

/**
 * Connection Line Vertex Shader
 * For animated data flow lines
 */
export const connectionVertexShader = /* glsl */ `
  attribute float lineProgress;

  varying float v_lineProgress;

  void main() {
    v_lineProgress = lineProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Connection Line Fragment Shader
 * Creates animated dashed line effect
 */
export const connectionFragmentShader = /* glsl */ `
  uniform vec3 u_color;
  uniform float u_time;
  uniform float u_dashLength;
  uniform float u_gapLength;
  uniform float u_opacity;

  varying float v_lineProgress;

  void main() {
    // Animated dash pattern
    float dashPattern = mod(v_lineProgress * 10.0 - u_time * 2.0, u_dashLength + u_gapLength);
    float dash = step(dashPattern, u_dashLength);

    // Fade at ends
    float fade = smoothstep(0.0, 0.1, v_lineProgress) * smoothstep(1.0, 0.9, v_lineProgress);

    float alpha = dash * fade * u_opacity;

    gl_FragColor = vec4(u_color, alpha);
  }
`;

/**
 * Uniform types for data flow shader
 */
export interface DataFlowUniforms {
  u_time: { value: number };
  u_speed: { value: number };
  u_colorStart: { value: THREE.Color };
  u_colorEnd: { value: THREE.Color };
  u_opacity: { value: number };
}

/**
 * Uniform types for glow shader
 */
export interface GlowUniforms {
  u_color: { value: THREE.Color };
  u_intensity: { value: number };
  u_time: { value: number };
}

/**
 * Uniform types for connection shader
 */
export interface ConnectionUniforms {
  u_color: { value: THREE.Color };
  u_time: { value: number };
  u_dashLength: { value: number };
  u_gapLength: { value: number };
  u_opacity: { value: number };
}

/**
 * Creates a data flow shader material with default uniforms
 */
export function createDataFlowMaterial(
  options: {
    colorStart?: string;
    colorEnd?: string;
    speed?: number;
    opacity?: number;
  } = {}
): THREE.ShaderMaterial {
  const {
    colorStart = '#00bcd4',
    colorEnd = '#7c3aed',
    speed = 1,
    opacity = 1,
  } = options;

  const uniforms: DataFlowUniforms = {
    u_time: { value: 0 },
    u_speed: { value: speed },
    u_colorStart: { value: new THREE.Color(colorStart) },
    u_colorEnd: { value: new THREE.Color(colorEnd) },
    u_opacity: { value: opacity },
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    vertexShader: dataFlowVertexShader,
    fragmentShader: dataFlowFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Creates a glow shader material
 */
export function createGlowMaterial(
  options: {
    color?: string;
    intensity?: number;
  } = {}
): THREE.ShaderMaterial {
  const { color = '#00bcd4', intensity = 1 } = options;

  const uniforms: GlowUniforms = {
    u_color: { value: new THREE.Color(color) },
    u_intensity: { value: intensity },
    u_time: { value: 0 },
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

/**
 * Creates a connection line shader material
 */
export function createConnectionMaterial(
  options: {
    color?: string;
    dashLength?: number;
    gapLength?: number;
    opacity?: number;
  } = {}
): THREE.ShaderMaterial {
  const {
    color = '#00bcd4',
    dashLength = 0.5,
    gapLength = 0.3,
    opacity = 0.6,
  } = options;

  const uniforms: ConnectionUniforms = {
    u_color: { value: new THREE.Color(color) },
    u_time: { value: 0 },
    u_dashLength: { value: dashLength },
    u_gapLength: { value: gapLength },
    u_opacity: { value: opacity },
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    vertexShader: connectionVertexShader,
    fragmentShader: connectionFragmentShader,
    transparent: true,
    depthWrite: false,
  });
}

/**
 * Updates the time uniform for a shader material
 */
export function updateDataFlowTime(
  material: THREE.ShaderMaterial,
  time: number
): void {
  if (material.uniforms.u_time) {
    material.uniforms.u_time.value = time;
  }
}
