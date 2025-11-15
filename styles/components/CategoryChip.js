import React from 'react';
import { Box, Text, Pressable } from '@gluestack-ui/themed';
import { warnaGlobal } from '../theme';

/**
 * CATEGORY CHIP COMPONENT
 * Chip kategori dengan active state
 * 
 * Props:
 * - category: string nama kategori
 * - isActive: boolean status active
 * - onPress: function ketika chip diklik
 * - activeColor: warna background saat active (default: warnaGlobal.primary)
 * - inactiveColor: warna background saat inactive (default: warnaGlobal.gray100)
 */
export const CategoryChip = ({ 
  category,
  isActive = false,
  onPress,
  activeColor = warnaGlobal.primary,
  inactiveColor = warnaGlobal.gray100
}) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        bg={isActive ? activeColor : inactiveColor}
        px="$5"
        py="$2"
        borderRadius="$xl"
      >
        <Text
          color={isActive ? warnaGlobal.white : warnaGlobal.gray700}
          fontWeight="$semibold"
          fontSize="$sm"
        >
          {category}
        </Text>
      </Box>
    </Pressable>
  );
};
