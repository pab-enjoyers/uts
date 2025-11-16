import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { profileResep } from '../../data/profile';
import { Container, Card, CustomButton } from '../../styles';
import { VStack, HStack, Box, Text, Pressable } from '@gluestack-ui/themed';

export default function HistoryScreen({ initialItems }) {
  // Support props for initialItems, fallback to profileResep (2-3 item)
  const historyItems = (initialItems ?? profileResep.slice(0, 3)).map((recipe) => ({
    ...recipe,
    viewedTime: recipe.viewedTime ?? 'Dilihat kemarin',
  }));

  const onDeleteAll = () => {
    console.log('Delete all clicked (non-functional)');
  };

  return (
    <Container bg="$background" scrollable>
      <HStack alignItems="center" bg="$white" px="$4" py="$3" borderBottomWidth={1} borderBottomColor="$gray200">
        <Pressable onPress={() => router.back()} p="$2">
          <Ionicons name="chevron-back" size={20} color="#333" />
        </Pressable>
        <Text fontSize="$lg" fontWeight="$bold" ml="$2">Riwayat</Text>
      </HStack>

      <Box p="$4">
        <Card>
          <VStack>
            {historyItems.length > 0 ? (
              <VStack space="$3">
                {historyItems.map((item, idx) => (
                  <HStack key={idx} alignItems="center" space="$3" py="$2" borderBottomWidth={idx < historyItems.length - 1 ? 1 : 0} borderBottomColor="$gray100">
                    <Box w={80} h={80} borderRadius="$md" bg="$gray50" alignItems="center" justifyContent="center">
                      <Ionicons name="image-outline" size={32} color="#ccc" />
                    </Box>

                    <VStack flex={1}>
                      <Text fontSize="$sm" fontWeight="$bold" numberOfLines={2}>{item.name}</Text>
                      <Text fontSize="$xs" color="$gray500">{item.viewedTime}</Text>
                    </VStack>

                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                  </HStack>
                ))}

                <Pressable onPress={onDeleteAll} flexDirection="row" alignItems="center" justifyContent="center" mt="$3" pt="$3" borderTopWidth={1} borderTopColor="$gray100">
                  <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  <Text ml="$2" color="#e74c3c" fontWeight="$semibold">Hapus Semua</Text>
                </Pressable>
              </VStack>
            ) : (
              <VStack alignItems="center" justifyContent="center" py="$6">
                <Ionicons name="history-outline" size={48} color="#ccc" />
                <Text mt="$3" color="$gray500">Tidak ada riwayat</Text>
              </VStack>
            )}
          </VStack>
        </Card>
      </Box>
    </Container>
  );
}
