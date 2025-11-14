import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function Screen3({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const options = [
    { id: 1, title: 'Option A', description: 'First choice' },
    { id: 2, title: 'Option B', description: 'Second choice' },
    { id: 3, title: 'Option C', description: 'Third choice' }
  ];

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
            Syihab - Screen 3
          </Text>
          <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>
            View ketiga dari Syihab
          </Text>
        </View>

        {/* Status */}
        <View style={{ 
          backgroundColor: isCompleted ? '#D4EDDA' : '#FFF3CD',
          padding: 16, 
          borderRadius: 8,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: isCompleted ? '#28A745' : '#FFC107'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
            Status: {isCompleted ? '✅ Completed' : '⏳ In Progress'}
          </Text>
        </View>

        {/* Options Selection */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
            Select an Option:
          </Text>
          
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedOption(option.id)}
              style={{
                backgroundColor: selectedOption === option.id ? '#FF6B6B' : '#f8f9fa',
                padding: 16,
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: 2,
                borderColor: selectedOption === option.id ? '#e63946' : '#e0e0e0'
              }}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600',
                color: selectedOption === option.id ? '#fff' : '#333',
                marginBottom: 4
              }}>
                {option.title}
              </Text>
              <Text style={{ 
                fontSize: 14,
                color: selectedOption === option.id ? '#fff' : '#666'
              }}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Complete Button */}
        {selectedOption && (
          <TouchableOpacity
            onPress={() => setIsCompleted(!isCompleted)}
            style={{
              backgroundColor: '#28A745',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Navigation */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SyihabScreen1')}
            style={{
              backgroundColor: '#e63946',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 8
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              ← Kembali ke Screen 1
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
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
