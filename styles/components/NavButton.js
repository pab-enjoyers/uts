import React from 'react';
import { Pressable, HStack, Text, Icon, ChevronRightIcon } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '../theme';

/**
 * NAV BUTTON COMPONENT
 * Button untuk navigasi antar screen
 * 
 * Props:
 * - title: text button
 * - route: path tujuan (contoh: '/syihab/screen1')
 * - icon: icon dari @expo/vector-icons
 * - color: warna button (default: primary)
 * - variant: 'solid' | 'outline' | 'ghost' (default: solid)
 */
export const NavButton = ({ 
  title, 
  route, 
  icon, 
  color = colors.primary,
  variant = 'solid'
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          bg: 'transparent',
          borderWidth: 2,
          borderColor: color,
          textColor: color,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          textColor: color,
        };
      case 'solid':
      default:
        return {
          bg: color,
          textColor: colors.textWhite,
          shadowColor: '$black',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <Pressable
      onPress={() => router.push(route)}
      bg={variantStyle.bg}
      borderWidth={variantStyle.borderWidth}
      borderColor={variantStyle.borderColor}
      p={spacing.md}
      borderRadius={borderRadius.lg}
      mb={spacing.sm}
      shadowColor={variantStyle.shadowColor}
      shadowOffset={variantStyle.shadowOffset}
      shadowOpacity={variantStyle.shadowOpacity}
      shadowRadius={variantStyle.shadowRadius}
      elevation={variantStyle.elevation}
    >
      <HStack space={spacing.sm} alignItems="center" justifyContent="space-between">
        <HStack space={spacing.sm} alignItems="center">
          {icon && <Icon as={icon} color={variantStyle.textColor} size="xl" />}
          <Text color={variantStyle.textColor} size="lg" fontWeight="$semibold">
            {title}
          </Text>
        </HStack>
        <Icon as={ChevronRightIcon} color={variantStyle.textColor} size="xl" />
      </HStack>
    </Pressable>
  );
};
