import React from 'react';
import { Button as GluestackButton, ButtonText, ButtonIcon } from '@gluestack-ui/themed';
import { colors, spacing } from '../theme';

/**
 * CUSTOM BUTTON COMPONENT
 * Button dengan styling konsisten untuk semua member
 * 
 * Props:
 * - title: text button (required)
 * - onPress: function saat button diklik (required)
 * - variant: 'solid' | 'outline' | 'link' | 'ghost' (default: solid)
 * - colorScheme: 'primary' | 'secondary' | 'success' | 'danger' | member name (default: primary)
 * - size: 'sm' | 'md' | 'lg' (default: md)
 * - icon: icon component (optional)
 * - iconPosition: 'left' | 'right' (default: left)
 * - isDisabled: boolean (default: false)
 * - isLoading: boolean (default: false)
 * 
 * Contoh penggunaan:
 * <CustomButton 
 *   title="Simpan" 
 *   onPress={handleSave}
 *   variant="solid"
 *   colorScheme="success"
 * />
 */
export const CustomButton = ({ 
  title,
  onPress,
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isDisabled = false,
  isLoading = false,
  ...props
}) => {
  // Mapping warna berdasarkan colorScheme
  const getColorScheme = () => {
    const colorMap = {
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      danger: colors.error,
      warning: colors.warning,
      syihab: colors.syihab,
      angela: colors.angela,
      deru: colors.deru,
      najma: colors.najma,
    };
    return colorMap[colorScheme] || colors.primary;
  };

  const buttonColor = getColorScheme();

  return (
    <GluestackButton
      onPress={onPress}
      size={size}
      variant={variant}
      action="primary"
      isDisabled={isDisabled}
      isLoading={isLoading}
      bg={variant === 'solid' ? buttonColor : 'transparent'}
      borderColor={variant === 'outline' ? buttonColor : 'transparent'}
      borderWidth={variant === 'outline' ? 1 : 0}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <ButtonIcon as={icon} mr={spacing.xs} />
      )}
      <ButtonText
        color={variant === 'solid' ? colors.textWhite : buttonColor}
      >
        {title}
      </ButtonText>
      {icon && iconPosition === 'right' && (
        <ButtonIcon as={icon} ml={spacing.xs} />
      )}
    </GluestackButton>
  );
};
