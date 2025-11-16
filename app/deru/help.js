import React from 'react';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Container, Card } from '../../styles';
import { VStack, HStack, Box, Text, Pressable } from '@gluestack-ui/themed';

export default function HelpScreen({ contacts }) {
  const mail = contacts?.email ?? 'Gibrankagabooming@gmail.com';
  const phone = contacts?.phone ?? '08123456789';
  const instagram = contacts?.instagram ?? 'https://instagram.com/arnoldpo';

  const openMail = () => Linking.openURL(`mailto:${mail}`);
  const openPhone = () => Linking.openURL(`tel:${phone}`);
  const openInstagram = () => Linking.openURL(instagram);

  return (
    <Container bg="$background" scrollable>
      <HStack alignItems="center" bg="$white" px="$4" py="$3" borderBottomWidth={1} borderBottomColor="$gray200">
        <Pressable onPress={() => router.back()} p="$2">
          <Ionicons name="chevron-back" size={20} color="#333" />
        </Pressable>
        <Text fontSize="$lg" fontWeight="$bold" ml="$2">Bantuan</Text>
      </HStack>

      <Box p="$4">
        <Card>
          <VStack space="$4">
            <Text fontSize="$lg" fontWeight="$bold">Bantuan & Panduan</Text>

            <VStack>
              <Text fontSize="$md" fontWeight="$semibold">1. Cara menggunakan aplikasi</Text>
              <Text color="$text" mt="$2">
                Aplikasi ini adalah platform resep. Anda dapat menelusuri resep, melihat detail resep, menyimpan favorit, dan menemukan artikel. Gunakan navigasi bawah untuk beralih antar tab (Artikel, Bookmark, Notifikasi, Profil). Ketuk resep untuk melihat bahan & langkah. Untuk tampilan optimal, gunakan koneksi internet stabil ketika memuat gambar.
              </Text>
            </VStack>

            <VStack>
              <Text fontSize="$md" fontWeight="$semibold">2. Cara mengubah profil / akun</Text>
              <VStack mt="$2" space="$2">
                <Text>1) Buka tab Profil lalu tekan ikon Settings dan pilih "Akun".</Text>
                <Text>2) Pada halaman Akun Anda dapat mengganti nama, bio, status, dan foto profil.</Text>
                <Text>3) Tekan ikon kamera pada foto profil untuk memilih gambar dari galeri (memerlukan `expo-image-picker`).</Text>
                <Text>4) Tekan "Simpan" untuk menyimpan perubahan pada sesi lokal. Untuk simpan permanen, tambahkan AsyncStorage atau backend.</Text>
              </VStack>
            </VStack>

            <VStack>
              <Text fontSize="$md" fontWeight="$semibold">3. Masih butuh bantuan?</Text>

              <VStack mt="$2" space="$2">
                <Pressable onPress={openMail} flexDirection="row" alignItems="center">
                  <Ionicons name="mail-outline" size={18} color="#1976d2" />
                  <Text ml="$3" color="$primary">Gibrankagabooming@gmail.com</Text>
                </Pressable>

                <Pressable onPress={openPhone} flexDirection="row" alignItems="center">
                  <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                  <Text ml="$3" color="$primary">08123456789 (WhatsApp)</Text>
                </Pressable>

                <Pressable onPress={openInstagram} flexDirection="row" alignItems="center">
                  <Ionicons name="logo-instagram" size={18} color="#C13584" />
                  <Text ml="$3" color="$primary">Arnold poernomo (@arnoldpo)</Text>
                </Pressable>
              </VStack>
            </VStack>
          </VStack>
        </Card>
      </Box>
    </Container>
  );
}
