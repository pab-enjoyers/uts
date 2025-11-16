import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { profileResep } from '../../data/profile';

export default function HistoryScreen() {
  // Dummy history data dari profileResep (2-3 item pertama)
  const historyItems = profileResep.slice(0, 3).map((recipe) => ({
    ...recipe,
    viewedTime: 'Dilihat kemarin',
  }));

  const onDeleteAll = () => {
    // Tombol tidak berfungsi sesuai permintaan
    console.log('Delete all clicked (non-functional)');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* History Items */}
          {historyItems.length > 0 ? (
            <View>
              {historyItems.map((item, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={styles.imageContainer}>
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={32} color="#ccc" />
                    </View>
                  </View>

                  <View style={styles.content}>
                    <Text style={styles.recipeName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.viewedTime}>{item.viewedTime}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
              ))}

              {/* Delete All Button */}
              <TouchableOpacity style={styles.deleteBtn} onPress={onDeleteAll}>
                <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                <Text style={styles.deleteBtnText}>Hapus Semua</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="history-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Tidak ada riwayat</Text>
            </View>
          )}
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
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imageContainer: {
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  viewedTime: {
    fontSize: 12,
    color: '#999',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deleteBtnText: {
    marginLeft: 8,
    color: '#e74c3c',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
});
