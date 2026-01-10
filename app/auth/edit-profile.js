// ========================================
// ✏️ EDIT PROFILE SCREEN
// Screen untuk edit profile user (nama, bio, dll)
// Menggunakan global components
// ========================================

import React, { useState, useEffect } from 'react';
import { ScrollView as RNScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
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
import { updateUserProfile } from '../../services/userService';
import { saveUserData } from '../../utils/storage';
import { validateName } from '../../utils/errorHandler';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [nama, setNama] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setNama(user.nama || '');
      setBio(user.bio || '');
    }
  }, [user]);

  /**
   * Handle save profile
   */
  const handleSaveProfile = async () => {
    setError('');

    // Validasi nama
    const nameValidation = validateName(nama);
    if (!nameValidation.valid) {
      setError(nameValidation.message);
      return;
    }

    setLoading(true);

    try {
      // Update di Firestore
      const result = await updateUserProfile(user.uid, {
        nama,
        bio,
      });

      if (result.success) {
        // Update di AsyncStorage
        const updatedUser = {
          ...user,
          nama,
          bio,
        };
        await saveUserData(updatedUser);

        Alert.alert('Sukses', 'Profile berhasil diupdate', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        setError(result.error || 'Gagal update profile');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
          {/* Header */}
          <Box mt="$12" mb="$4">
            <HStack justifyContent="space-between" alignItems="center">
              <Pressable onPress={() => router.back()}>
                <HStack space="sm" alignItems="center">
                  <Ionicons name="arrow-back" size={24} color="#374151" />
                  <Text color="$textLight700">Kembali</Text>
                </HStack>
              </Pressable>
              
              <Heading size="lg" color="$textLight900">
                Edit Profile
              </Heading>
              
              <Box w={80} />
            </HStack>
          </Box>

          {/* User Email Info */}
          <Box mb="$6" p={spacing.md} bg="$coolGray50" borderRadius="$md">
            <HStack space="sm" alignItems="center">
              <Ionicons name="mail" size={16} color="#6B7280" />
              <Text size="sm" color="$textLight600">
                {user?.email}
              </Text>
            </HStack>
          </Box>

          {/* Form Card */}
          <Card variant="elevated" padding={spacing.lg}>
            <VStack space="md">
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

              {/* Nama Input */}
              <CustomInput
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChangeText={setNama}
                helperText="Minimal 3 karakter"
              />

              {/* Bio Input */}
              <CustomInput
                label="Bio"
                placeholder="Ceritakan tentang diri Anda"
                value={bio}
                onChangeText={setBio}
                helperText="Opsional"
              />

              {/* Save Button */}
              <Box mt="$4">
                <CustomButton
                  title={loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  onPress={handleSaveProfile}
                  variant="solid"
                  colorScheme="success"
                  size="lg"
                  isDisabled={loading}
                  isLoading={loading}
                  w="$full"
                />
              </Box>

              {/* Cancel Button */}
              <CustomButton
                title="Batal"
                onPress={() => router.back()}
                variant="outline"
                colorScheme="secondary"
                size="md"
                w="$full"
              />
            </VStack>
          </Card>
        </Box>
      </RNScrollView>
    </KeyboardAvoidingView>
  );
}
