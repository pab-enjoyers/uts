// ========================================
// 📝 REGISTER SCREEN
// Screen untuk user membuat akun baru
// Menggunakan global components: CustomInput, CustomButton, Card
// ========================================

import React, { useState } from 'react';
import { ScrollView as RNScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
} from '@gluestack-ui/themed';
import { CustomInput, CustomButton, Card, colors, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { validateRegisterForm } from '../../utils/errorHandler';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  // State management
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth context
  const { register } = useAuth();

  /**
   * Handle register
   */
  const handleRegister = async () => {
    // Reset errors
    setErrors({});
    setErrorMessage('');

    // Validasi form
    const formData = { nama, email, password, confirmPassword };
    const validation = validateRegisterForm(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Set loading
    setLoading(true);

    // Register
    const result = await register(email, password, nama);

    setLoading(false);

    if (result.success) {
      // Navigate ke tabs (home) atau onboarding
      router.replace('/(tabs)');
    } else {
      // Show error
      setErrorMessage(result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <RNScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} bg="$white" p={spacing.lg}>
          {/* Header */}
          <VStack space="md" mt="$16" mb="$6">
            <Box alignItems="center" mb="$2">
              <Box
                w={70}
                h={70}
                borderRadius="$full"
                bg="$red500"
                alignItems="center"
                justifyContent="center"
                mb="$2"
              >
                <Ionicons name="person-add" size={35} color="white" />
              </Box>
            </Box>

            <Heading size="2xl" textAlign="center" color="$textLight900">
              Daftar Akun Baru
            </Heading>
            <Text size="md" textAlign="center" color="$textLight500">
              Isi data di bawah untuk membuat akun
            </Text>
          </VStack>

          {/* Form Card */}
          <Card variant="elevated" padding={spacing.lg}>
            <VStack space="md">
              {/* Error Message */}
              {errorMessage ? (
                <Box
                  bg="$red50"
                  p={spacing.md}
                  borderRadius="$md"
                  borderLeftWidth={3}
                  borderLeftColor="$red500"
                >
                  <VStack space="xs">
                    <HStack space="xs" alignItems="flex-start">
                      <Ionicons name="alert-circle" size={16} color="#DC2626" />
                      <Text size="sm" color="$red700" flex={1}>
                        {errorMessage}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              ) : null}

              {/* Nama Input */}
              <CustomInput
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChangeText={setNama}
                isInvalid={!!errors.nama}
                errorText={errors.nama}
                helperText="Minimal 3 karakter"
              />

              {/* Email Input */}
              <CustomInput
                label="Email"
                placeholder="Masukkan email Anda"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                isInvalid={!!errors.email}
                errorText={errors.email}
              />

              {/* Password Input */}
              <Box>
                <CustomInput
                  label="Password"
                  placeholder="Masukkan password"
                  value={password}
                  onChangeText={setPassword}
                  type={showPassword ? 'text' : 'password'}
                  isInvalid={!!errors.password}
                  errorText={errors.password}
                  helperText="Minimal 6 karakter"
                />
                <Pressable
                  position="absolute"
                  right={12}
                  top={38}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              </Box>

              {/* Confirm Password Input */}
              <Box>
                <CustomInput
                  label="Konfirmasi Password"
                  placeholder="Masukkan ulang password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  isInvalid={!!errors.confirmPassword}
                  errorText={errors.confirmPassword}
                />
                <Pressable
                  position="absolute"
                  right={12}
                  top={38}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              </Box>

              {/* Register Button */}
              <Box mt="$4">
                <CustomButton
                  title={loading ? 'Mendaftar...' : 'Daftar'}
                  onPress={handleRegister}
                  variant="solid"
                  colorScheme="success"
                  size="lg"
                  isDisabled={loading}
                  isLoading={loading}
                  w="$full"
                />
              </Box>

              {/* Login Link */}
              <HStack justifyContent="center" mt="$4" space="xs">
                <Text size="sm" color="$textLight500">
                  Sudah punya akun?
                </Text>
                <Pressable onPress={() => router.push('/auth/login')}>
                  <Text size="sm" color="$red500" fontWeight="$semibold">
                    Login
                  </Text>
                </Pressable>
              </HStack>
            </VStack>
          </Card>
        </Box>
      </RNScrollView>
    </KeyboardAvoidingView>
  );
}
