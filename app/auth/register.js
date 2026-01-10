import React, { useState } from 'react';
import {
  Box,
  Text,
  Pressable,
  VStack,
  HStack,
  Input,
  InputField,
  InputSlot,
  ScrollView,
  Spinner,
} from '@gluestack-ui/themed';
import { Image as RNImage, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { warnaGlobal } from '../../styles/theme';

// App Logo
const APP_LOGO = 'https://media.discordapp.net/attachments/1353606414383448065/1459527535414218753/Screenshot_2026-01-10_020147-removebg-preview.png?ex=69639a71&is=696248f1&hm=e411cbfbd3b2c81dd88a894c677cea60cdcb90f3ebcbb129657cdeed1926fcba&=&format=webp&quality=lossless';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!nama.trim()) {
      setError('Nama harus diisi');
      return false;
    }
    if (!email.trim()) {
      setError('Email harus diisi');
      return false;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Format email tidak valid');
      return false;
    }
    if (!password) {
      setError('Password harus diisi');
      return false;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await signUp(email.trim(), password, nama.trim());
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setError(result.error || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg={warnaGlobal.gray50}>
      <StatusBar barStyle="light-content" backgroundColor={warnaGlobal.primaryHex} />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header dengan Kurva */}
          <Box 
            bg={warnaGlobal.primaryHex}
            pt="$12"
            pb="$12"
            px="$6"
            borderBottomLeftRadius={50}
            borderBottomRightRadius={50}
            alignItems="center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Logo dalam lingkaran putih */}
            <Box
              bg="white"
              w={90}
              h={90}
              borderRadius={45}
              alignItems="center"
              justifyContent="center"
              mb="$3"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <RNImage 
                source={{ uri: APP_LOGO }} 
                style={{ width: 60, height: 60, resizeMode: 'contain' }} 
              />
            </Box>
            
            <Text color="white" fontSize="$xl" fontWeight="$bold" mb="$1">
              Buat Akun Baru
            </Text>
            <Text color="rgba(255,255,255,0.9)" fontSize="$sm" textAlign="center">
              Daftar untuk mulai menjelajahi resep
            </Text>
          </Box>

          {/* Form Container */}
          <VStack px="$5" py="$6" space="lg" flex={1}>
            {/* Error Message */}
            {error ? (
              <Box 
                bg={warnaGlobal.dangerLight || '#FEE2E2'} 
                p="$3" 
                borderRadius="$xl"
                borderWidth={1}
                borderColor={warnaGlobal.danger || '#EF4444'}
              >
                <HStack space="sm" alignItems="center">
                  <Ionicons name="alert-circle" size={20} color={warnaGlobal.danger || '#EF4444'} />
                  <Text color={warnaGlobal.danger || '#EF4444'} fontSize="$sm" flex={1}>
                    {error}
                  </Text>
                </HStack>
              </Box>
            ) : null}

            {/* Nama Input */}
            <VStack space="xs">
              <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray600} ml="$1">
                Nama Lengkap
              </Text>
              <Box
                bg="white"
                borderRadius="$xl"
                borderWidth={1}
                borderColor={warnaGlobal.gray200}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Input
                  variant="outline"
                  size="xl"
                  borderWidth={0}
                  h={54}
                >
                  <InputSlot pl="$4">
                    <Ionicons name="person-outline" size={22} color={warnaGlobal.gray400} />
                  </InputSlot>
                  <InputField
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChangeText={(text) => {
                      setNama(text);
                      setError('');
                    }}
                    autoCapitalize="words"
                    placeholderTextColor={warnaGlobal.gray400}
                    fontSize="$md"
                    px="$3"
                  />
                </Input>
              </Box>
            </VStack>

            {/* Email Input */}
            <VStack space="xs">
              <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray600} ml="$1">
                Email
              </Text>
              <Box
                bg="white"
                borderRadius="$xl"
                borderWidth={1}
                borderColor={warnaGlobal.gray200}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Input
                  variant="outline"
                  size="xl"
                  borderWidth={0}
                  h={54}
                >
                  <InputSlot pl="$4">
                    <Ionicons name="mail-outline" size={22} color={warnaGlobal.gray400} />
                  </InputSlot>
                  <InputField
                    placeholder="Masukkan email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={warnaGlobal.gray400}
                    fontSize="$md"
                    px="$3"
                  />
                </Input>
              </Box>
            </VStack>

            {/* Password Input */}
            <VStack space="xs">
              <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray600} ml="$1">
                Password
              </Text>
              <Box
                bg="white"
                borderRadius="$xl"
                borderWidth={1}
                borderColor={warnaGlobal.gray200}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Input
                  variant="outline"
                  size="xl"
                  borderWidth={0}
                  h={54}
                >
                  <InputSlot pl="$4">
                    <Ionicons name="lock-closed-outline" size={22} color={warnaGlobal.gray400} />
                  </InputSlot>
                  <InputField
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={warnaGlobal.gray400}
                    fontSize="$md"
                    px="$3"
                  />
                  <InputSlot pr="$4" onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                      size={22} 
                      color={warnaGlobal.gray400} 
                    />
                  </InputSlot>
                </Input>
              </Box>
            </VStack>

            {/* Confirm Password Input */}
            <VStack space="xs">
              <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray600} ml="$1">
                Konfirmasi Password
              </Text>
              <Box
                bg="white"
                borderRadius="$xl"
                borderWidth={1}
                borderColor={warnaGlobal.gray200}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Input
                  variant="outline"
                  size="xl"
                  borderWidth={0}
                  h={54}
                >
                  <InputSlot pl="$4">
                    <Ionicons name="shield-checkmark-outline" size={22} color={warnaGlobal.gray400} />
                  </InputSlot>
                  <InputField
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor={warnaGlobal.gray400}
                    fontSize="$md"
                    px="$3"
                  />
                  <InputSlot pr="$4" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons 
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
                      size={22} 
                      color={warnaGlobal.gray400} 
                    />
                  </InputSlot>
                </Input>
              </Box>
            </VStack>

            {/* Register Button */}
            <Pressable
              bg={warnaGlobal.primaryHex}
              py="$4"
              borderRadius="$xl"
              alignItems="center"
              justifyContent="center"
              disabled={loading}
              onPress={handleRegister}
              mt="$2"
              style={{
                shadowColor: warnaGlobal.primaryHex,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              sx={{
                ':active': {
                  opacity: 0.9,
                  transform: [{ scale: 0.98 }],
                },
                ':disabled': {
                  opacity: 0.7,
                },
              }}
            >
              {loading ? (
                <HStack space="sm" alignItems="center">
                  <Spinner size="small" color="white" />
                  <Text color="white" fontSize="$md" fontWeight="$bold">
                    Memproses...
                  </Text>
                </HStack>
              ) : (
                <Text color="white" fontSize="$md" fontWeight="$bold">
                  Daftar
                </Text>
              )}
            </Pressable>

            {/* Divider */}
            <HStack alignItems="center" space="md" my="$1">
              <Box flex={1} h={1} bg={warnaGlobal.gray200} />
              <Text color={warnaGlobal.gray400} fontSize="$sm">
                atau
              </Text>
              <Box flex={1} h={1} bg={warnaGlobal.gray200} />
            </HStack>

            {/* Login Link */}
            <HStack justifyContent="center" space="xs" mb="$4">
              <Text color={warnaGlobal.gray600} fontSize="$sm">
                Sudah punya akun?
              </Text>
              <Pressable onPress={() => router.push('/auth/login')}>
                <Text color={warnaGlobal.primaryHex} fontSize="$sm" fontWeight="$bold">
                  Masuk
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
