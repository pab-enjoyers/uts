export const colors = {
  // Primary colors untuk setiap member
  syihab: '$red500',
  angela: '$cyan500',
  deru: '$blue500',
  najma: '$orange500',
  
  // Navigation colors
  tabActive: '#EF4444',
  tabInactive: '#9CA3AF',
  
  // Common colors
  primary: '$primary500',
  secondary: '$secondary500',
  success: '$success500',
  warning: '$warning500',
  error: '$error500',
  background: '$backgroundLight0',
  text: '$textLight900',
  textSecondary: '$textLight500',
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
  },
};

export default {
  colors,
  spacing,
  sizes,
  buttonStyles,
  inputStyles,
  cardStyles,
};
