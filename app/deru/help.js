import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HelpScreen() {
  const openMail = () => Linking.openURL('mailto:Gibrankagabooming@gmail.com');
  const openPhone = () => Linking.openURL('tel:08123456789');
  const openInstagram = () => Linking.openURL('https://instagram.com/arnoldpo');

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bantuan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Bantuan & Panduan</Text>

          <View style={styles.section}>
            <Text style={styles.heading}>1. Cara menggunakan aplikasi</Text>
            <Text style={styles.text}>
              Aplikasi ini adalah platform resep. Anda dapat menelusuri resep, melihat detail resep, menyimpan favorit, dan menemukan artikel. Gunakan navigasi bawah untuk beralih antar tab (Artikel, Bookmark, Notifikasi, Profil). Ketuk resep untuk melihat bahan & langkah. Untuk tampilan optimal, gunakan koneksi internet stabil ketika memuat gambar.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>2. Cara mengubah profil / akun</Text>
            <Text style={styles.text}>
              1) Buka tab Profil lalu tekan ikon Settings dan pilih "Akun".
            </Text>
            <Text style={styles.text}>2) Pada halaman Akun Anda dapat mengganti nama, bio, status, dan foto profil.</Text>
            <Text style={styles.text}>3) Tekan ikon kamera pada foto profil untuk memilih gambar dari galeri (memerlukan `expo-image-picker`).</Text>
            <Text style={styles.text}>4) Tekan "Simpan" untuk menyimpan perubahan pada sesi lokal. Untuk simpan permanen, tambahkan AsyncStorage atau backend.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>3. Masih butuh bantuan?</Text>
            <TouchableOpacity style={styles.contactRow} onPress={openMail}>
              <Ionicons name="mail-outline" size={18} color="#1976d2" />
              <Text style={styles.contactText}>Gibrankagabooming@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={openPhone}>
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={styles.contactText}>08123456789 (WhatsApp)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={openInstagram}>
              <Ionicons name="logo-instagram" size={18} color="#C13584" />
              <Text style={styles.contactText}>Arnold poernomo (@arnoldpo)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  header: {
    height: 60,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 6, color: '#111' },
  container: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  section: { marginBottom: 12 },
  heading: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  text: { color: '#333', lineHeight: 20, marginBottom: 6 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  contactText: { marginLeft: 10, color: '#1976d2' },
});
