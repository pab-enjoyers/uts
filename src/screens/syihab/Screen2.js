import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default function Screen2({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState([]);

  const handleAddItem = () => {
    if (inputText.trim()) {
      setItems([...items, { id: Date.now(), text: inputText }]);
      setInputText('');
    }
  };

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
            Syihab - Screen 2
          </Text>
          <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>
            View kedua dari Syihab
          </Text>
        </View>

        {/* Form Area - Example dengan TextInput */}
        <View style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 20, 
          borderRadius: 12,
          marginBottom: 16
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
            Add Item Example
          </Text>
          
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type something..."
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd',
              fontSize: 16,
              marginBottom: 12
            }}
          />
          
          <TouchableOpacity
            onPress={handleAddItem}
            style={{
              backgroundColor: '#FF6B6B',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* List Items */}
        <View style={{ marginBottom: 16 }}>
          {items.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: '#e0e0e0'
              }}
            >
              <Text style={{ fontSize: 16, color: '#333' }}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Navigation */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SyihabScreen3')}
            style={{
              backgroundColor: '#e63946',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Pergi ke Screen 3 →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('SyihabScreen1')}
            style={{
              backgroundColor: '#6c757d',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              ← Kembali ke Screen 1
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
