export const colors = {
  // Primary - Cyber Blue (data streams)
  primary: {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#00bcd4', // Main primary
    600: '#00acc1',
    700: '#0097a7',
    800: '#00838f',
    900: '#006064',
  },

  // Accent - Electric Purple (AI/ML)
  accent: {
    50: '#f3e8ff',
    100: '#e9d5ff',
    200: '#d8b4fe',
    300: '#c084fc',
    400: '#a855f7',
    500: '#7c3aed', // Main accent
    600: '#6d28d9',
    700: '#5b21b6',
    800: '#4c1d95',
    900: '#3b0764',
  },

  // Success - Matrix Green
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Background - Deep Space
  background: {
    primary: '#0a0a0f',
    secondary: '#111118',
    tertiary: '#1a1a24',
    card: 'rgba(26, 26, 36, 0.8)',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    muted: '#71717a',
    accent: '#00bcd4',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #00bcd4 0%, #7c3aed 100%)',
    hero: 'linear-gradient(180deg, #0a0a0f 0%, #111118 100%)',
    card: 'linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
  },
} as const;

export type Colors = typeof colors;
