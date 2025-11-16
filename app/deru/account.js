import React, { useState } from 'react';
import { Alert } from 'react-native';
import { userData } from '../../data/profile';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Container, Card, CustomInput, CustomButton } from '../../styles';
import { VStack, HStack, Box, Text, Pressable, Avatar } from '@gluestack-ui/themed';

export default function AccountScreen({ initialUser }) {
  // Support props (initialUser) + local state
  const [name, setName] = useState(initialUser?.name ?? userData?.name ?? '');
  const [bio, setBio] = useState(initialUser?.bio ?? userData?.bio ?? '');
  const [status, setStatus] = useState(initialUser?.status ?? userData?.status ?? '');
  const [avatar, setAvatar] = useState(initialUser?.avatarImage ?? userData?.avatarImage ?? null);

  const pickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const { status: perm } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm !== 'granted') {
        Alert.alert('Izin ditolak', 'Izin akses foto diperlukan untuk memilih gambar.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.cancelled) {
        setAvatar({ uri: result.uri });
      }
    } catch (err) {
      Alert.alert(
        'Module tidak ditemukan',
        'Untuk memilih gambar, pasang dependensi `expo-image-picker` dengan:\n\n`expo install expo-image-picker`'
      );
    }
  };

  const onSave = () => {
    Alert.alert('Tersimpan', 'Perubahan profil disimpan secara lokal pada sesi ini.');
  };

  const onReset = () => {
    setName(userData?.name || '');
    setBio(userData?.bio || '');
    setStatus(userData?.status || '');
    setAvatar(userData?.avatarImage || null);
  };

  const [dob, setDob] = useState(initialUser?.dob ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const onChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Gagal', 'Masukkan password baru dan konfirmasi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Gagal', 'Password baru dan konfirmasi tidak cocok.');
      return;
    }
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Berhasil', 'Password berhasil diubah (simulasi).');
  };

  const avatarSource = avatar && avatar.uri ? { uri: avatar.uri } : avatar;

  return (
    <Container bg="$background" scrollable>
      <HStack alignItems="center" bg="$white" px="$4" py="$3" borderBottomWidth={1} borderBottomColor="$gray200">
        <Pressable onPress={() => router.back()} p="$2">
          <Ionicons name="chevron-back" size={20} color="#333" />
        </Pressable>
        <Text fontSize="$lg" fontWeight="$bold" ml="$2">Akun</Text>
      </HStack>

      <Box p="$4">
        <Card>
          <HStack space="$4" alignItems="center" mb="$4">
            <Box position="relative">
              {avatarSource ? (
                <Avatar source={avatarSource} size={96} borderRadius="$full" />
              ) : (
                <Avatar size={96} borderRadius="$full" bg="$gray100">
                  <Ionicons name="person" size={42} color="#bbb" />
                </Avatar>
              )}

              <Pressable position="absolute" right={-3} bottom={-3} bg="$primary" borderRadius="$full" p="$2" onPress={pickImage}>
                <Ionicons name="camera" size={16} color="#fff" />
              </Pressable>
            </Box>

            <VStack flex={1}>
              <Text fontSize="$md" fontWeight="$bold">{name}</Text>
              <Text fontSize="$sm" color="$gray500" mt="$1">{status}</Text>
            </VStack>
          </HStack>

          <VStack>
            <CustomInput label="Nama" placeholder="Nama Anda" value={name} onChangeText={setName} />

            <CustomInput label="Deskripsi / Bio" placeholder="Tulis bio singkat" value={bio} onChangeText={setBio} multiline helperText="Tulis beberapa kata tentang diri Anda" />

            <CustomInput label="Status" placeholder="Contoh: Chef Amatir" value={status} onChangeText={setStatus} />

            <CustomInput label="Tanggal Lahir" placeholder="YYYY-MM-DD" value={dob} onChangeText={setDob} helperText="Format: 1990-12-31" />

            <CustomInput label="Password Saat Ini" placeholder="Password saat ini" value={currentPassword} onChangeText={setCurrentPassword} type={showPass ? 'text' : 'password'} />

            <CustomInput label="Password Baru" placeholder="Password baru" value={newPassword} onChangeText={setNewPassword} type={showPass ? 'text' : 'password'} rightIcon={() => <Ionicons name={showPass ? 'eye-off' : 'eye'} size={18} color="#666" />} />

            <CustomInput label="Konfirmasi Password" placeholder="Konfirmasi password baru" value={confirmPassword} onChangeText={setConfirmPassword} type={showPass ? 'text' : 'password'} />

            <HStack space="$3" mt="$3">
              <CustomButton title="Batal" variant="outline" onPress={onReset} flex={1} />
              <CustomButton title="Simpan" onPress={onSave} flex={1} />
            </HStack>

            <Text mt="$3" color="$gray500">Catatan: Perubahan disimpan hanya di state lokal. Untuk penyimpanan permanen, tambahkan AsyncStorage atau backend.</Text>
          </VStack>
        </Card>
      </Box>
    </Container>
  );
}
