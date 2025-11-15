import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { colors, spacing, borderRadius } from '../theme';

/**
 * CARD COMPONENT
 * Komponen card dengan shadow & border
 * Gunakan untuk menampilkan konten dalam box
 * 
 * Props:
 * - children: konten di dalam card
 * - bg: background color (default: white)
 * - padding: custom padding (default: md)
 * - variant: 'elevated' | 'outlined' | 'filled' (default: elevated)
 */
export const Card = ({ 
  children, 
  bg = colors.background,
  padding = spacing.md,
  variant = 'elevated'
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          bg: colors.backgroundSecondary,
        };
      case 'elevated':
      default:
        return {
          shadowColor: '$black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
    }
  };

  return (
    <Box
      bg={bg}
      p={padding}
      borderRadius={borderRadius.lg}
      {...getVariantStyle()}
    >
      {children}
    </Box>
  );
};
