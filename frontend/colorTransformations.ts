/**
 * Color transformation utilities for colorblind accessibility
 * Based on color vision deficiency simulation matrices
 */

export type ColorblindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'general';

/**
 * Color transformation matrices for different colorblind types
 * These matrices simulate how colors appear to people with specific color vision deficiencies
 */

// RGB to LMS (Long, Medium, Short wavelength) conversion matrix
const RGB_TO_LMS = [
  [0.31399022, 0.63951294, 0.04649755],
  [0.15537241, 0.75789446, 0.08670142],
  [0.01775239, 0.10944209, 0.87256922]
];

// LMS to RGB conversion matrix
const LMS_TO_RGB = [
  [5.47221206, -4.6419601, 0.16963708],
  [-1.1252419, 2.29317094, -0.1678952],
  [0.02980165, -0.19318073, 1.16364789]
];

// Protanopia transformation matrix (LMS space)
const PROTANOPIA_MATRIX = [
  [0, 1.05118294, -0.05116099],
  [0, 1, 0],
  [0, 0, 1]
];

// Deuteranopia transformation matrix (LMS space)
const DEUTERANOPIA_MATRIX = [
  [1, 0, 0],
  [0.9513092, 0, 0.04866992],
  [0, 0, 1]
];

// Tritanopia transformation matrix (LMS space)
const TRITANOPIA_MATRIX = [
  [1, 0, 0],
  [0, 1, 0],
  [-0.86744736, 1.86727089, 0]
];

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}

/**
 * Matrix multiplication helper
 */
function multiplyMatrix(a: number[][], b: number[]): number[] {
  return a.map(row => row.reduce((sum, val, i) => sum + val * b[i], 0));
}

/**
 * Transform color for specific colorblind type
 */
function transformColor(rgb: [number, number, number], type: ColorblindType): string {
  if (type === 'general') {
    // General colorblind mode - use optimized palette
    return transformColorGeneral(rgb);
  }

  // Convert RGB to LMS
  const lms = multiplyMatrix(RGB_TO_LMS, rgb.map(c => c / 255));

  // Apply colorblind transformation matrix
  let transformedLms: number[];
  switch (type) {
    case 'protanopia':
      transformedLms = multiplyMatrix(PROTANOPIA_MATRIX, lms);
      break;
    case 'deuteranopia':
      transformedLms = multiplyMatrix(DEUTERANOPIA_MATRIX, lms);
      break;
    case 'tritanopia':
      transformedLms = multiplyMatrix(TRITANOPIA_MATRIX, lms);
      break;
    default:
      transformedLms = lms;
  }

  // Convert back to RGB
  const transformedRgb = multiplyMatrix(LMS_TO_RGB, transformedLms).map(c => c * 255);
  return rgbToHex(transformedRgb[0], transformedRgb[1], transformedRgb[2]);
}

/**
 * General colorblind mode - optimized color replacements
 */
function transformColorGeneral(rgb: [number, number, number]): string {
  const [r, g, b] = rgb;
  
  // Detect green colors (primary brand color #00D47C = rgb(0, 212, 124))
  if (g > r && g > b && g > 100) {
    // Green -> Blue for better visibility
    return '#2563eb'; // Blue-600
  }
  
  // Detect red colors
  if (r > g && r > b && r > 150) {
    // Keep red but make it more distinct
    return '#dc2626'; // Red-600
  }
  
  // Detect yellow/orange
  if (r > 200 && g > 150 && b < 100) {
    // Yellow/Orange -> More saturated orange
    return '#ea580c'; // Orange-600
  }
  
  // Keep other colors as is
  return rgbToHex(r, g, b);
}

/**
 * Transform a hex color for colorblind accessibility
 */
export function transformColorForColorblind(hex: string, type: ColorblindType): string {
  const rgb = hexToRgb(hex);
  return transformColor(rgb, type);
}

/**
 * Color mapping for comprehensive replacements
 * Maps common colors to colorblind-friendly alternatives
 */
export const COLOR_MAPPINGS: Record<ColorblindType, Record<string, string>> = {
  general: {
    // Primary brand green -> Blue
    '#00D47C': '#2563eb',
    '#00be6f': '#1d4ed8',
    'rgb(0, 212, 124)': 'rgb(37, 99, 235)',
    // Green shades -> Blue shades
    'green-50': 'blue-50',
    'green-100': 'blue-100',
    'green-200': 'blue-200',
    'green-300': 'blue-300',
    'green-400': 'blue-400',
    'green-500': 'blue-500',
    'green-600': 'blue-600',
    'green-700': 'blue-700',
    'green-800': 'blue-800',
    'green-900': 'blue-900',
  },
  protanopia: {
    // Protanopia: Red appears darker, green shifts
    '#00D47C': '#1e90ff', // Green -> Bright blue
    '#00be6f': '#1e7cd8',
    'rgb(0, 212, 124)': 'rgb(30, 144, 255)',
    // Red colors need to be brighter
    '#dc2626': '#ff4444', // Brighter red
    '#ef4444': '#ff5555',
  },
  deuteranopia: {
    // Deuteranopia: Green appears darker, red shifts
    '#00D47C': '#3b82f6', // Green -> Blue
    '#00be6f': '#2563eb',
    'rgb(0, 212, 124)': 'rgb(59, 130, 246)',
    // Similar to protanopia but slightly different
    '#dc2626': '#ff4444',
  },
  tritanopia: {
    // Tritanopia: Blue-yellow confusion
    '#00D47C': '#10b981', // Green -> Keep green but brighter
    '#00be6f': '#059669',
    'rgb(0, 212, 124)': 'rgb(16, 185, 129)',
    // Blue colors need adjustment
    '#2563eb': '#8b5cf6', // Blue -> Purple
    '#3b82f6': '#a78bfa',
  },
};

/**
 * Get CSS variable values for colorblind type
 */
export function getColorblindCSSVars(type: ColorblindType) {
  const mappings: Record<ColorblindType, Record<string, string>> = {
    general: {
      '--color-success': '#2563eb',
      '--color-success-light': '#dbeafe',
      '--color-success-dark': '#1e40af',
      '--color-warning': '#dc2626',
      '--color-warning-light': '#fee2e2',
      '--color-info': '#7c3aed',
      '--color-info-light': '#ede9fe',
      '--color-error': '#dc2626',
      '--color-error-light': '#fee2e2',
    },
    protanopia: {
      '--color-success': '#1e90ff',
      '--color-success-light': '#d6e9ff',
      '--color-success-dark': '#0066cc',
      '--color-warning': '#ff4444',
      '--color-warning-light': '#ffe6e6',
      '--color-info': '#8b5cf6',
      '--color-info-light': '#ede9fe',
      '--color-error': '#ff4444',
      '--color-error-light': '#ffe6e6',
    },
    deuteranopia: {
      '--color-success': '#3b82f6',
      '--color-success-light': '#dbeafe',
      '--color-success-dark': '#1e40af',
      '--color-warning': '#ff4444',
      '--color-warning-light': '#ffe6e6',
      '--color-info': '#8b5cf6',
      '--color-info-light': '#ede9fe',
      '--color-error': '#ff4444',
      '--color-error-light': '#ffe6e6',
    },
    tritanopia: {
      '--color-success': '#10b981',
      '--color-success-light': '#d1fae5',
      '--color-success-dark': '#047857',
      '--color-warning': '#f59e0b',
      '--color-warning-light': '#fef3c7',
      '--color-info': '#8b5cf6',
      '--color-info-light': '#ede9fe',
      '--color-error': '#ef4444',
      '--color-error-light': '#fee2e2',
    },
  };

  return mappings[type] || mappings.general;
}

