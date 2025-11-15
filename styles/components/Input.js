import React from 'react';
import { 
  Input as GluestackInput, 
  InputField, 
  InputIcon,
  InputSlot,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  AlertCircleIcon
} from '@gluestack-ui/themed';
import { colors, spacing } from '../theme';

/**
 * CUSTOM INPUT COMPONENT
 * Input field dengan styling konsisten dan validasi
 * 
 * Props:
 * - label: label input (optional)
 * - placeholder: placeholder text (required)
 * - value: nilai input (required untuk controlled input)
 * - onChangeText: function saat text berubah (required)
 * - helperText: text bantuan di bawah input (optional)
 * - errorText: text error jika ada validasi (optional)
 * - isInvalid: boolean untuk menandakan error (default: false)
 * - isRequired: boolean untuk required field (default: false)
 * - isDisabled: boolean untuk disable input (default: false)
 * - leftIcon: icon di kiri (optional)
 * - rightIcon: icon di kanan (optional)
 * - type: 'text' | 'password' (default: text)
 * - keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' (default: default)
 * 
 * Contoh penggunaan:
 * const [nama, setNama] = useState('');
 * 
 * <CustomInput 
 *   label="Nama Lengkap"
 *   placeholder="Masukkan nama"
 *   value={nama}
 *   onChangeText={setNama}
 *   isRequired
 *   helperText="Gunakan nama sesuai KTP"
 * />
 */
export const CustomInput = ({ 
  label,
  placeholder,
  value,
  onChangeText,
  helperText,
  errorText,
  isInvalid = false,
  isRequired = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  type = 'text',
  keyboardType = 'default',
  ...props
}) => {
  return (
    <FormControl 
      isInvalid={isInvalid} 
      isRequired={isRequired}
      isDisabled={isDisabled}
      mb={spacing.md}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      
      <GluestackInput size="md" variant="outline">
        {leftIcon && (
          <InputSlot pl={spacing.sm}>
            <InputIcon as={leftIcon} color={colors.textSecondary} />
          </InputSlot>
        )}
        
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          type={type}
          keyboardType={keyboardType}
          {...props}
        />
        
        {rightIcon && (
          <InputSlot pr={spacing.sm}>
            <InputIcon as={rightIcon} color={colors.textSecondary} />
          </InputSlot>
        )}
      </GluestackInput>

      {helperText && !isInvalid && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}

      {isInvalid && errorText && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errorText}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
