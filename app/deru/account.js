// ========================================
// 👤 ACCOUNT CENTER SCREEN
// Manage user profile with Firebase sync
// ========================================

import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Container, warnaGlobal } from '../../styles';
import { VStack, HStack, Box, Text, Pressable, Heading, Avatar, AvatarImage } from '@gluestack-ui/themed';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '../../services/userService';
import * as ImagePicker from 'expo-image-picker';

export default function AccountScreen() {
  const { user, updateUserPassword } = useAuth();
  
  // Profile data
  const [nama, setNama] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const result = await getUserProfile(user.uid);
      
      if (result.success && result.data) {
        setNama(result.data.nama || '');
        setBio(result.data.bio || '');
        setPhotoURL(result.data.photoURL || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Izin akses foto diperlukan untuk memilih gambar.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploadingPhoto(true);
        
        // Upload to Firebase Storage
        const uploadResult = await uploadProfilePhoto(user.uid, result.assets[0].uri);
        
        if (uploadResult.success) {
          setPhotoURL(uploadResult.photoURL);
          Alert.alert('Berhasil', 'Foto profil berhasil diupdate');
        } else {
          Alert.alert('Error', uploadResult.error || 'Gagal upload foto');
        }
        
        setUploadingPhoto(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih foto');
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!nama.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return;
    }

    try {
      setSaving(true);
      
      const updates = {
        nama: nama.trim(),
        bio: bio.trim(),
      };
      
      const result = await updateUserProfile(user.uid, updates);
      
      if (result.success) {
        Alert.alert('Berhasil', 'Profil berhasil diupdate');
      } else {
        Alert.alert('Error', result.error || 'Gagal update profil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua field password harus diisi');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Password baru dan konfirmasi tidak cocok');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    try {
      setSaving(true);
      
      const result = await updateUserPassword(currentPassword, newPassword);
      
      if (result.success) {
        Alert.alert('Berhasil', 'Password berhasil diubah');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', result.error || 'Gagal update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Gagal mengubah password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container bg={warnaGlobal.light}>
        {/* Header */}
        <Box bg="$white" borderBottomWidth={1} borderBottomColor={warnaGlobal.gray200}>
          <HStack alignItems="center" px="$4" py="$3" space="md">
            <Pressable onPress={() => router.back()} p="$2">
              <Ionicons name="chevron-back" size={24} color={warnaGlobal.gray900} />
            </Pressable>
            <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
              Pusat Akun
            </Heading>
          </HStack>
        </Box>
        
        <VStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={warnaGlobal.primary} />
          <Text mt="$3" color={warnaGlobal.gray500}>
            Memuat profil...
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box flex={1} bg={warnaGlobal.light}>
      {/* Header */}
      <Box bg="$white" borderBottomWidth={1} borderBottomColor={warnaGlobal.gray200}>
        <HStack alignItems="center" px="$4" py="$3" space="md">
          <Pressable onPress={() => router.back()} p="$2">
            <Ionicons name="chevron-back" size={24} color={warnaGlobal.gray900} />
          </Pressable>
          <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
            Pusat Akun
          </Heading>
        </HStack>
      </Box>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <VStack p="$5" space="lg">
          {/* Profile Photo Card */}
          <Box bg="$white" borderRadius="$2xl" p="$5" shadowColor="$black" shadowOpacity={0.05} shadowRadius={10}>
            <VStack space="md" alignItems="center">
              <Box position="relative">
                {photoURL ? (
                  <Avatar size="2xl" borderRadius="$full" borderWidth={4} borderColor={warnaGlobal.primary}>
                    <AvatarImage source={{ uri: photoURL }} alt="Profile" />
                  </Avatar>
                ) : (
                  <Box 
                    w={120} 
                    h={120} 
                    borderRadius="$full" 
                    bg={warnaGlobal.light}
                    borderWidth={4}
                    borderColor={warnaGlobal.primary}
                    justifyContent="center" 
                    alignItems="center"
                  >
                    <Text fontSize={48} color={warnaGlobal.primary}>
                      {nama ? nama.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </Box>
                )}

                {/* Camera button */}
                <Pressable 
                  position="absolute" 
                  right={0} 
                  bottom={0} 
                  bg={warnaGlobal.primary}
                  borderRadius="$full" 
                  p="$3"
                  borderWidth={3}
                  borderColor="$white"
                  onPress={pickImage}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={20} color="white" />
                  )}
                </Pressable>
              </Box>

              <VStack space="xs" alignItems="center">
                <Text fontSize="$xl" fontWeight="$bold" color={warnaGlobal.gray900}>
                  {nama || 'Nama Belum Diatur'}
                </Text>
                <Text fontSize="$sm" color={warnaGlobal.gray500}>
                  {user?.email || ''}
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Profile Info Card */}
          <Box bg="$white" borderRadius="$2xl" p="$5" shadowColor="$black" shadowOpacity={0.05} shadowRadius={10}>
            <VStack space="lg">
              <Text fontSize="$lg" fontWeight="$bold" color={warnaGlobal.gray900}>
                Informasi Profil
              </Text>

              {/* Nama Input */}
              <VStack space="xs">
                <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Nama Lengkap
                </Text>
                <Box 
                  bg={warnaGlobal.gray50} 
                  borderRadius="$xl" 
                  borderWidth={1}
                  borderColor={warnaGlobal.gray200}
                >
                  <HStack alignItems="center" px="$4" py="$3" space="sm">
                    <Ionicons name="person-outline" size={20} color={warnaGlobal.gray600} />
                    <TextInput
                      value={nama}
                      onChangeText={setNama}
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor={warnaGlobal.gray400}
                      style={styles.input}
                    />
                  </HStack>
                </Box>
              </VStack>

              {/* Bio Input */}
              <VStack space="xs">
                <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Bio
                </Text>
                <Box 
                  bg={warnaGlobal.gray50} 
                  borderRadius="$xl" 
                  borderWidth={1}
                  borderColor={warnaGlobal.gray200}
                >
                  <HStack alignItems="flex-start" px="$4" py="$3" space="sm">
                    <Ionicons name="information-circle-outline" size={20} color={warnaGlobal.gray600} style={{ marginTop: 2 }} />
                    <TextInput
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Ceritakan tentang diri Anda..."
                      placeholderTextColor={warnaGlobal.gray400}
                      multiline
                      numberOfLines={3}
                      style={[styles.input, styles.multiline]}
                    />
                  </HStack>
                </Box>
              </VStack>

              {/* Save Button */}
              <Pressable onPress={handleSaveProfile} disabled={saving}>
                <Box 
                  bg={warnaGlobal.primary} 
                  borderRadius="$xl" 
                  py="$4"
                  alignItems="center"
                  opacity={saving ? 0.6 : 1}
                >
                  {saving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text color="$white" fontSize="$md" fontWeight="$bold">
                      Simpan Profil
                    </Text>
                  )}
                </Box>
              </Pressable>
            </VStack>
          </Box>

          {/* Change Password Card */}
          <Box bg="$white" borderRadius="$2xl" p="$5" shadowColor="$black" shadowOpacity={0.05} shadowRadius={10}>
            <VStack space="lg">
              <Text fontSize="$lg" fontWeight="$bold" color={warnaGlobal.gray900}>
                Ubah Password
              </Text>

              {/* Current Password */}
              <VStack space="xs">
                <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Password Saat Ini
                </Text>
                <Box 
                  bg={warnaGlobal.gray50} 
                  borderRadius="$xl" 
                  borderWidth={1}
                  borderColor={warnaGlobal.gray200}
                >
                  <HStack alignItems="center" px="$4" py="$3" space="sm">
                    <Ionicons name="lock-closed-outline" size={20} color={warnaGlobal.gray600} />
                    <TextInput
                      secureTextEntry={!showPassword}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Masukkan password saat ini"
                      placeholderTextColor={warnaGlobal.gray400}
                      style={styles.input}
                    />
                  </HStack>
                </Box>
              </VStack>

              {/* New Password */}
              <VStack space="xs">
                <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Password Baru
                </Text>
                <Box 
                  bg={warnaGlobal.gray50} 
                  borderRadius="$xl" 
                  borderWidth={1}
                  borderColor={warnaGlobal.gray200}
                >
                  <HStack alignItems="center" px="$4" py="$3" space="sm">
                    <Ionicons name="key-outline" size={20} color={warnaGlobal.gray600} />
                    <TextInput
                      secureTextEntry={!showPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Masukkan password baru"
                      placeholderTextColor={warnaGlobal.gray400}
                      style={styles.input}
                    />
                  </HStack>
                </Box>
              </VStack>

              {/* Confirm Password */}
              <VStack space="xs">
                <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Konfirmasi Password Baru
                </Text>
                <Box 
                  bg={warnaGlobal.gray50} 
                  borderRadius="$xl" 
                  borderWidth={1}
                  borderColor={warnaGlobal.gray200}
                >
                  <HStack alignItems="center" px="$4" py="$3" space="sm">
                    <Ionicons name="checkmark-circle-outline" size={20} color={warnaGlobal.gray600} />
                    <TextInput
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Konfirmasi password baru"
                      placeholderTextColor={warnaGlobal.gray400}
                      style={styles.input}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons 
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                        size={20} 
                        color={warnaGlobal.gray600} 
                      />
                    </Pressable>
                  </HStack>
                </Box>
              </VStack>

              <Text fontSize="$xs" color={warnaGlobal.gray500}>
                Password minimal 6 karakter
              </Text>

              {/* Change Password Button */}
              <Pressable onPress={handleChangePassword} disabled={saving}>
                <Box 
                  bg={warnaGlobal.primary} 
                  borderRadius="$xl" 
                  py="$4"
                  alignItems="center"
                  opacity={saving ? 0.6 : 1}
                >
                  {saving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text color="$white" fontSize="$md" fontWeight="$bold">
                      Ubah Password
                    </Text>
                  )}
                </Box>
              </Pressable>
            </VStack>
          </Box>

          {/* Bottom spacing */}
          <Box h="$8" />
        </VStack>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  multiline: {
    minHeight: 60,
    paddingTop: 0,
    textAlignVertical: 'top',
  }
});
