// ========================================
// 🔄 FORGOT PASSWORD SCREEN
// Screen untuk reset password via email
// Menggunakan global components
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
import { validateLoginForm, isValidEmail } from '../../utils/errorHandler';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { handleFirebaseError } from '../../utils/errorHandler';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handle send reset email
   */
  const handleResetPassword = async () => {
    setError('');
    setSuccess(false);

    // Validasi email
    if (!isValidEmail(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      const errorInfo = handleFirebaseError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
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
          {/* Back Button */}
          <Box mt="$12" mb="$4">
            <Pressable onPress={() => router.back()}>
              <HStack space="sm" alignItems="center">
                <Ionicons name="arrow-back" size={24} color="#374151" />
                <Text color="$textLight700">Kembali</Text>
              </HStack>
            </Pressable>
          </Box>

          {/* Header */}
          <VStack space="md" mt="$8" mb="$8">
            <Box alignItems="center" mb="$4">
              <Box
                w={80}
                h={80}
                borderRadius="$full"
                bg="$amber500"
                alignItems="center"
                justifyContent="center"
                mb="$4"
              >
                <Ionicons name="mail-outline" size={40} color="white" />
              </Box>
            </Box>

            <Heading size="2xl" textAlign="center" color="$textLight900">
              Lupa Password?
            </Heading>
            <Text size="sm" textAlign="center" color="$textLight500" px="$4">
              Masukkan email Anda dan kami akan mengirimkan link untuk reset password
            </Text>
          </VStack>

          {/* Form Card */}
          <Card variant="elevated" padding={spacing.lg}>
            <VStack space="md">
              {/* Success Message */}
              {success ? (
                <Box
                  bg="$green50"
                  p={spacing.md}
                  borderRadius="$md"
                  borderLeftWidth={3}
                  borderLeftColor="$green500"
                >
                  <VStack space="sm">
                    <HStack space="sm" alignItems="center">
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text size="sm" color="$green700" fontWeight="$semibold">
                        Email Terkirim!
                      </Text>
                    </HStack>
                    <Text size="sm" color="$green700">
                      Kami telah mengirim link reset password ke email Anda. Silakan cek inbox atau folder spam.
                    </Text>
                  </VStack>
                </Box>
              ) : null}

              {/* Error Message */}
              {error ? (
                <Box
                  bg="$red50"
                  p={spacing.sm}
                  borderRadius="$md"
                  borderLeftWidth={3}
                  borderLeftColor="$red500"
                >
                  <Text size="sm" color="$red700">
                    {error}
                  </Text>
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
                isInvalid={!!error && !success}
              />

              {/* Submit Button */}
              <Box mt="$4">
                <CustomButton
                  title={loading ? 'Mengirim...' : 'Kirim Link Reset'}
                  onPress={handleResetPassword}
                  variant="solid"
                  colorScheme="warning"
                  size="lg"
                  isDisabled={loading || success}
                  isLoading={loading}
                  w="$full"
                />
              </Box>

              {/* Back to Login */}
              {success && (
                <Box mt="$4">
                  <CustomButton
                    title="Kembali ke Login"
                    onPress={() => router.replace('/auth/login')}
                    variant="outline"
                    colorScheme="primary"
                    size="md"
                    w="$full"
                  />
                </Box>
              )}
            </VStack>
          </Card>
        </Box>
      </RNScrollView>
    </KeyboardAvoidingView>
  );
}
