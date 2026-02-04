import { colors } from '@/shared/constants/colors';

/**
 * Theme color names that can be used with Color3D.fromTheme()
 */
export type ThemeColorName = 'primary' | 'accent' | 'success';

/**
 * RGB color representation
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Immutable value object representing a color for 3D rendering.
 * Integrates with the theme color system.
 */
export class Color3D {
  private constructor(
    private readonly _hex: string,
    private readonly _opacity: number = 1
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a Color3D from a theme color name.
   * @param name - Theme color name: 'primary', 'accent', or 'success'
   * @param shade - Color shade (default: 500)
   */
  static fromTheme(
    name: ThemeColorName,
    shade: keyof typeof colors.primary = 500
  ): Color3D {
    const colorMap = {
      primary: colors.primary,
      accent: colors.accent,
      success: colors.success,
    } as const;

    const palette = colorMap[name];
    const hex = palette[shade as keyof typeof palette];
    return new Color3D(hex);
  }

  /**
   * Creates a Color3D from a hex string.
   * @param hex - Hex color string (with or without #)
   * @throws Error if hex string is invalid
   */
  static fromHex(hex: string): Color3D {
    const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;

    // Validate hex format
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleanHex)) {
      throw new Error(`Invalid hex color: ${hex}`);
    }

    // Expand shorthand hex
    const fullHex =
      cleanHex.length === 4
        ? `#${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}${cleanHex[3]}${cleanHex[3]}`
        : cleanHex;

    return new Color3D(fullHex.toLowerCase());
  }

  /**
   * Creates a Color3D from RGB values (0-255).
   * @param r - Red component (0-255)
   * @param g - Green component (0-255)
   * @param b - Blue component (0-255)
   */
  static fromRGB(r: number, g: number, b: number): Color3D {
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return new Color3D(hex);
  }

  /**
   * Creates a white color.
   */
  static white(): Color3D {
    return new Color3D('#ffffff');
  }

  /**
   * Creates a black color.
   */
  static black(): Color3D {
    return new Color3D('#000000');
  }

  /**
   * Returns a new Color3D with the specified opacity.
   * @param opacity - Opacity value (0-1)
   */
  withOpacity(opacity: number): Color3D {
    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    return new Color3D(this._hex, clampedOpacity);
  }

  /**
   * Returns the hex string representation.
   */
  toHex(): string {
    return this._hex;
  }

  /**
   * Returns the RGB values as an object.
   */
  toRGB(): RGB {
    const hex = this._hex.slice(1);
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  /**
   * Returns the RGB values as a tuple [r, g, b] (0-1 range for Three.js).
   */
  toRGBArray(): [number, number, number] {
    const { r, g, b } = this.toRGB();
    return [r / 255, g / 255, b / 255];
  }

  /**
   * Returns the opacity value.
   */
  get opacity(): number {
    return this._opacity;
  }

  /**
   * Returns the hex value (alias for toHex).
   */
  get hex(): string {
    return this._hex;
  }

  /**
   * Linearly interpolates between this color and another.
   * @param other - Target color
   * @param t - Interpolation factor (0 = this, 1 = other)
   */
  lerp(other: Color3D, t: number): Color3D {
    const rgb1 = this.toRGB();
    const rgb2 = other.toRGB();
    const clampedT = Math.max(0, Math.min(1, t));

    return Color3D.fromRGB(
      rgb1.r + (rgb2.r - rgb1.r) * clampedT,
      rgb1.g + (rgb2.g - rgb1.g) * clampedT,
      rgb1.b + (rgb2.b - rgb1.b) * clampedT
    ).withOpacity(this._opacity + (other._opacity - this._opacity) * clampedT);
  }

  /**
   * Returns a lighter version of this color.
   * @param amount - Amount to lighten (0-1)
   */
  lighten(amount: number): Color3D {
    return this.lerp(Color3D.white(), amount);
  }

  /**
   * Returns a darker version of this color.
   * @param amount - Amount to darken (0-1)
   */
  darken(amount: number): Color3D {
    return this.lerp(Color3D.black(), amount);
  }

  /**
   * Checks equality with another Color3D.
   */
  equals(other: Color3D): boolean {
    return this._hex === other._hex && this._opacity === other._opacity;
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return this._opacity < 1 ? `${this._hex} (${this._opacity})` : this._hex;
  }
}
