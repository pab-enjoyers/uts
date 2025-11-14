import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function Screen1({ navigation }) {
  // Props & State (sesuai requirement soal)
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState('ready');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={{ 
          backgroundColor: '#FF6B6B', 
          padding: 24, 
          borderRadius: 12,
          marginBottom: 20
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>
            Syihab - Screen 1
          </Text>
          <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>
            View pertama dari Syihab
          </Text>
        </View>

        {/* Content Area - Ganti ini sesuai kebutuhan UTS */}
        <View style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 20, 
          borderRadius: 12,
          marginBottom: 16
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
            Status: {status}
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
            Counter: {counter}
          </Text>
          
          <TouchableOpacity
            onPress={() => {
              setCounter(counter + 1);
              setStatus('active');
            }}
            style={{
              backgroundColor: '#FF6B6B',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 12
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Increment Counter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SyihabScreen2')}
            style={{
              backgroundColor: '#e63946',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Pergi ke Screen 2 →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              backgroundColor: '#6c757d',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              ← Kembali ke Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={{ 
          backgroundColor: '#FFF3CD', 
          padding: 16, 
          borderRadius: 8,
          marginTop: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#FFC107'
        }}>
          <Text style={{ fontSize: 14, color: '#856404', fontWeight: '600', marginBottom: 4 }}>
            📝 TODO: Syihab
          </Text>
          <Text style={{ fontSize: 13, color: '#856404', lineHeight: 20 }}>
            Ganti content area ini dengan UI sesuai requirement UTS kamu.
            Jangan lupa implementasikan props & state!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
