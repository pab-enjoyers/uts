import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { userData } from '../../data/profile';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AccountScreen() {
  const [name, setName] = useState(userData?.name || '');
  const [bio, setBio] = useState(userData?.bio || '');
  const [status, setStatus] = useState(userData?.status || '');
  const [avatar, setAvatar] = useState(userData?.avatarImage || null);

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

  // Password & DOB state
  const [dob, setDob] = useState('');
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
    // Karena tidak ada backend, ini hanya simulasi.
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Berhasil', 'Password berhasil diubah (simulasi).');
  };

  const avatarSource = avatar && avatar.uri ? { uri: avatar.uri } : avatar;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Akun</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              {avatarSource ? (
                <Image source={avatarSource} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={48} color="#bbb" />
                </View>
              )}
              <TouchableOpacity style={styles.editAvatar} onPress={pickImage}>
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nama</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Nama Anda" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Deskripsi / Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.input, { height: 100 }]}
              placeholder="Tulis bio singkat"
              multiline
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <TextInput value={status} onChangeText={setStatus} style={styles.input} placeholder="Contoh: Chef Amatir" />
          </View>

          {/* Tanggal Lahir */}
          <View style={styles.field}>
            <Text style={styles.label}>Tanggal Lahir</Text>
            <TextInput
              value={dob}
              onChangeText={setDob}
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />
            <Text style={styles.helper}>Format: 1990-12-31</Text>
          </View>

          {/* Ubah Password */}
          <View style={[styles.field, { marginTop: 6 }]}>
            <Text style={styles.label}>Ubah Password</Text>

            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
              placeholder="Password saat ini"
              secureTextEntry={!showPass}
            />

            <View style={{ height: 8 }} />

            <View style={{ position: 'relative' }}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                placeholder="Password baru"
                secureTextEntry={!showPass}
              />
              <TouchableOpacity style={styles.eye} onPress={() => setShowPass((s) => !s)}>
                <Ionicons name={showPass ? 'eye-off' : 'eye'} size={18} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={{ height: 8 }} />

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholder="Konfirmasi password baru"
              secureTextEntry={!showPass}
            />

            <View style={{ height: 10 }} />
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onChangePassword}>
              <Text style={styles.btnPrimaryText}>Ubah Password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onReset}>
              <Text style={styles.btnOutlineText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onSave}>
              <Text style={styles.btnPrimaryText}>Simpan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>Catatan: Perubahan disimpan hanya di state lokal. Untuk penyimpanan permanen, tambahkan AsyncStorage atau backend.</Text>
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
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eee' },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  editAvatar: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#1976d2',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: { fontSize: 16, fontWeight: '700', color: '#111' },
  status: { fontSize: 13, color: '#666', marginTop: 4 },
  field: { marginBottom: 12 },
  label: { fontSize: 13, color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
  btnPrimary: { backgroundColor: '#1976d2' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  btnOutlineText: { color: '#333', fontWeight: '700' },
  note: { marginTop: 12, fontSize: 12, color: '#666' },
});
