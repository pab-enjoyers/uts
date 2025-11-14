// Reusable component configurations
import { colors, spacing, buttonStyles } from './theme';

// Screen Header Component Config
export const screenHeaderConfig = (memberColor, title, subtitle) => ({
  bg: memberColor,
  p: spacing.lg,
  borderRadius: '$md',
  content: {
    title: {
      size: 'lg',
      color: '$white',
      mb: '$1',
    },
    subtitle: {
      size: 'sm',
      color: '$white',
    },
  },
});

// Info Box Component Config
export const infoBoxConfig = {
  bg: '$amber50',
  p: spacing.sm,
  borderRadius: '$sm',
  borderLeftWidth: 3,
  borderLeftColor: '$amber500',
  title: {
    size: 'xs',
    color: '$amber800',
    fontWeight: '$semibold',
    mb: '$1',
  },
  text: {
    size: 'xs',
    color: '$amber700',
  },
};

// Content Box Component Config
export const contentBoxConfig = {
  bg: '$coolGray50',
  p: spacing.md,
  borderRadius: '$md',
  text: {
    size: 'md',
    color: '$coolGray600',
  },
  heading: {
    size: '2xl',
    fontWeight: '$bold',
    color: '$coolGray800',
  },
};

// Member Configs
export const memberConfigs = {
  syihab: {
    name: 'Syihab',
    color: colors.syihab,
    colorLight: '$red100',
    colorDark: '$red600',
  },
  angela: {
    name: 'Angela',
    color: colors.angela,
    colorLight: '$cyan100',
    colorDark: '$cyan600',
  },
  deru: {
    name: 'Deru',
    color: colors.deru,
    colorLight: '$blue100',
    colorDark: '$blue600',
  },
  najma: {
    name: 'Najma',
    color: colors.najma,
    colorLight: '$orange100',
    colorDark: '$orange600',
  },
};

export default {
  screenHeaderConfig,
  infoBoxConfig,
  contentBoxConfig,
  memberConfigs,
};
