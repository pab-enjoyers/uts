// ========================================
// 🔐 LOGIN SCREEN
// Screen untuk user login dengan email dan password
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
  Spinner,
} from '@gluestack-ui/themed';
import { CustomInput, CustomButton, Card, colors, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { validateLoginForm } from '../../utils/errorHandler';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth context
  const { login } = useAuth();

  /**
   * Handle login
   */
  const handleLogin = async () => {
    // Reset errors
    setErrors({});
    setErrorMessage('');

    // Validasi form
    const formData = { email, password };
    const validation = validateLoginForm(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Set loading
    setLoading(true);

    // Login
    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      // Navigate ke tabs (home)
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
          <VStack space="md" mt="$20" mb="$8">
            <Box alignItems="center" mb="$4">
              <Box
                w={80}
                h={80}
                borderRadius="$full"
                bg="$red500"
                alignItems="center"
                justifyContent="center"
                mb="$4"
              >
                <Ionicons name="restaurant" size={40} color="white" />
              </Box>
            </Box>

            <Heading size="2xl" textAlign="center" color="$textLight900">
              Selamat Datang
            </Heading>
            <Text size="md" textAlign="center" color="$textLight500">
              Login untuk melanjutkan
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

              {/* Login Button */}
              <Box mt="$4">
                <CustomButton
                  title={loading ? 'Loading...' : 'Login'}
                  onPress={handleLogin}
                  variant="solid"
                  colorScheme="primary"
                  size="lg"
                  isDisabled={loading}
                  isLoading={loading}
                  w="$full"
                />
              </Box>

              {/* Forgot Password Link */}
              <Box alignItems="center" mt="$2">
                <Pressable onPress={() => router.push('/auth/forgot-password')}>
                  <Text size="sm" color="$amber600" fontWeight="$medium">
                    Lupa Password?
                  </Text>
                </Pressable>
              </Box>

              {/* Register Link */}
              <HStack justifyContent="center" mt="$4" space="xs">
                <Text size="sm" color="$textLight500">
                  Belum punya akun?
                </Text>
                <Pressable onPress={() => router.push('/auth/register')}>
                  <Text size="sm" color="$red500" fontWeight="$semibold">
                    Daftar Sekarang
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
