// ========================================
// 🎨 GLOBAL THEME SYSTEM
// Gunakan theme ini di semua screen untuk konsistensi
// Sesuai syarat.md: Gluestack UI, Functional Components, Props & State
// ========================================

export const colors = {
  // Navigation Colors (untuk tab bar)
  tabActive: '#EF4444',      // Warna tab yang aktif (Merah)
  tabInactive: '#9CA3AF',    // Warna tab yang tidak aktif (Abu)
  
  // UI Colors - Untuk komponen Button, Layout, dll
  primary: '$primary500',
  secondary: '$secondary500',
  success: '$success500',
  warning: '$warning500',
  error: '$error500',
  
  // Background Colors
  background: '$backgroundLight0',
  backgroundSecondary: '$backgroundLight50',
  
  // Text Colors
  text: '$textLight900',
  textSecondary: '$textLight500',
  textLight: '$textLight400',
  textWhite: '$white',
  
  // Border & Divider
  border: '$borderLight300',
  divider: '$borderLight200',
};

// Common spacing values
export const spacing = {
  xs: '$2',
  sm: '$3',
  md: '$4',
  lg: '$5',
  xl: '$6',
};

// Button styles presets
export const buttonStyles = {
  primary: {
    size: 'md',
    variant: 'solid',
    action: 'primary',
  },
  secondary: {
    size: 'md',
    variant: 'outline',
    action: 'secondary',
  },
  success: {
    size: 'md',
    variant: 'solid',
    action: 'positive',
  },
  danger: {
    size: 'md',
    variant: 'solid',
    action: 'negative',
  },
};

// Input styles presets
export const inputStyles = {
  default: {
    size: 'md',
    variant: 'outline',
  },
};

// Card styles presets
export const cardStyles = {
  default: {
    p: spacing.md,
    bg: '$white',
    borderRadius: '$lg',
    shadowColor: '$black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevated: {
    p: spacing.md,
    bg: '$white',
    borderRadius: '$lg',
    shadowColor: '$black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  outlined: {
    p: spacing.md,
    bg: '$white',
    borderRadius: '$lg',
    borderWidth: 1,
    borderColor: colors.border,
  },
};

// Border Radius presets
export const borderRadius = {
  none: '$none',
  sm: '$sm',
  md: '$md',
  lg: '$lg',
  xl: '$xl',
  full: '$full',
};

// Typography presets
export const typography = {
  h1: { size: '3xl', fontWeight: '$bold' },
  h2: { size: '2xl', fontWeight: '$bold' },
  h3: { size: 'xl', fontWeight: '$semibold' },
  body: { size: 'md', fontWeight: '$normal' },
  caption: { size: 'sm', fontWeight: '$normal' },
  small: { size: 'xs', fontWeight: '$normal' },
};

// Warna Global - Digunakan di semua screen untuk konsistensi
// Warna-warna yang sering dipakai di aplikasi
export const warnaGlobal = {
  // Brand Colors - Merah sebagai warna utama
  primary: '$red500',      // #ef4444 - Merah utama
  secondary: '$red300',    // #fca5a5 - Merah muda
  accent: '$red700',       // #b91c1c - Merah gelap
  light: '$red100',        // #fee2e2 - Merah sangat muda

  // Hex values untuk React Native components yang butuh hex
  primaryHex: '#ef4444',
  secondaryHex: '#fca5a5',
  accentHex: '#b91c1c',
  lightHex: '#fee2e2',
  
  // Gray Scale - Untuk text, backgrounds, borders
  gray50: '$coolGray50',    // #f9fafb - Background terang
  gray100: '$coolGray100',  // #f3f4f6 - Background
  gray200: '$coolGray200',  // #e5e7eb - Divider
  gray300: '$coolGray300',  // #d1d5db - Border
  gray400: '$coolGray400',  // #9ca3af - Icon inactive
  gray500: '$coolGray500',  // #6b7280 - Text secondary
  gray600: '$coolGray600',  // #4b5563 - Text primary
  gray700: '$coolGray700',  // #374151 - Text dark
  gray800: '$coolGray800',  // #1f2937 - Background dark
  gray900: '$coolGray900',  // #111827 - Text darkest
  
  // Gray Hex values
  gray50Hex: '#f9fafb',
  gray100Hex: '#f3f4f6',
  gray200Hex: '#e5e7eb',
  gray300Hex: '#d1d5db',
  gray400Hex: '#9ca3af',
  gray500Hex: '#6b7280',
  gray600Hex: '#4b5563',
  gray700Hex: '#374151',
  gray800Hex: '#1f2937',
  
  // Amber/Yellow - Untuk rating, badges
  amber400: '$amber400',    // #fbbf24 - Rating stars
  amber500: '$amber500',    // #f59e0b - Badges
  amber400Hex: '#fbbf24',
  
  // Utility Colors
  white: '$white',          // #ffffff
  whiteHex: '#ffffff',
  black: '$black',          // #000000
  blackHex: '#000000',
};

// Alias untuk backward compatibility
export const warnaGlobalMerah = warnaGlobal;

export default {
  colors,
  spacing,
  buttonStyles,
  inputStyles,
  cardStyles,
  borderRadius,
  typography,
  warnaGlobal,
  warnaGlobalMerah, // Alias untuk backward compatibility
};
