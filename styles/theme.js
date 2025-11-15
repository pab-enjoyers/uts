// ========================================
// 🎨 GLOBAL THEME SYSTEM
// Gunakan theme ini di semua screen untuk konsistensi
// Sesuai syarat.md: Gluestack UI, Functional Components, Props & State
// ========================================

export const colors = {
  // Brand Colors - Warna identitas setiap member tim
  syihab: '$red500',
  angela: '$cyan500',
  deru: '$blue500',
  najma: '$orange500',
  
  // Navigation Colors
  tabActive: '#EF4444',      // Warna tab yang aktif
  tabInactive: '#9CA3AF',    // Warna tab yang tidak aktif
  
  // UI Colors - Warna umum untuk komponen
  primary: '$primary500',         // Indigo/Purple
  secondary: '$secondary500',     // Gray
  success: '$success500',         // Green
  warning: '$warning500',         // Yellow/Orange
  error: '$error500',             // Red
  info: '$info500',               // Blue
  
  // Background Colors
  background: '$backgroundLight0',      // White
  backgroundSecondary: '$backgroundLight50',  // Light gray
  backgroundDark: '$backgroundDark900', // Dark mode
  
  // Text Colors
  text: '$textLight900',          // Black/Dark gray
  textSecondary: '$textLight500', // Medium gray
  textLight: '$textLight400',     // Light gray
  textWhite: '$white',            // White text
  
  // Border & Divider
  border: '$borderLight300',      // Border warna
  divider: '$borderLight200',     // Garis pemisah
};

// Common spacing values
export const spacing = {
  xs: '$2',
  sm: '$3',
  md: '$4',
  lg: '$5',
  xl: '$6',
};

// Common sizes
export const sizes = {
  buttonHeight: '$12',
  inputHeight: '$10',
  iconSize: 24,
  headerIconSize: 28,
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

// Tema Kelompok - Konfigurasi warna untuk setiap anggota
// Setiap member punya warna unik untuk personalisasi screen
export const temaKelompok = {
  syihab: {
    primary: '$red500',
    secondary: '$red300',
    accent: '$red700',
    light: '$red100',
  },
  angela: {
    primary: '$cyan500',
    secondary: '$cyan300',
    accent: '$cyan700',
    light: '$cyan100',
  },
  deru: {
    primary: '$blue500',
    secondary: '$blue300',
    accent: '$blue700',
    light: '$blue100',
  },
  najma: {
    primary: '$orange500',
    secondary: '$orange300',
    accent: '$orange700',
    light: '$orange100',
  },
};

export default {
  colors,
  spacing,
  sizes,
  buttonStyles,
  inputStyles,
  cardStyles,
  borderRadius,
  typography,
  temaKelompok,
};
