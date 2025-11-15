// ========================================
// 🔔 NOTIFICATIONS PAGE - ANGELA
// Halaman notifikasi dengan filter tabs
// ========================================

import React, { useState } from 'react';
import { Container, warnaGlobal, NotificationCard } from '../../styles';
import { Ionicons } from '@expo/vector-icons';
import { notifications } from '../../data/notifications';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
} from '@gluestack-ui/themed';

export default function NotificationsPage() {
  // State untuk filter tabs (Props & State requirement)
  const [activeTab, setActiveTab] = useState('all');

  // Filter notifications berdasarkan activeTab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'read') return notifications.filter(n => n.isRead);
    if (activeTab === 'unread') return notifications.filter(n => !n.isRead);
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  // Group notifications by day
  const todayNotifications = filteredNotifications.filter(n => n.day === 'today');
  const yesterdayNotifications = filteredNotifications.filter(n => n.day === 'yesterday');

  return (
    <Container scrollable bg="$white" padding="$0">
      <VStack space="md" mt="$12" pb="$20">
        {/* Header */}
        <Box px="$5" pt="$5" pb="$3">
          <Heading size="xl" fontWeight="$bold" mb="$4">
            Notifications
          </Heading>

          {/* Filter Tabs */}
          <HStack space="sm">
            <Pressable
              flex={1}
              onPress={() => setActiveTab('all')}
              bg={activeTab === 'all' ? warnaGlobal.primary : warnaGlobal.gray100}
              py="$2"
              borderRadius="$lg"
              alignItems="center"
            >
              <Text
                color={activeTab === 'all' ? warnaGlobal.white : warnaGlobal.gray600}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                All
              </Text>
            </Pressable>

            <Pressable
              flex={1}
              onPress={() => setActiveTab('read')}
              bg={activeTab === 'read' ? warnaGlobal.primary : warnaGlobal.gray100}
              py="$2"
              borderRadius="$lg"
              alignItems="center"
            >
              <Text
                color={activeTab === 'read' ? warnaGlobal.white : warnaGlobal.gray600}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                Read
              </Text>
            </Pressable>

            <Pressable
              flex={1}
              onPress={() => setActiveTab('unread')}
              bg={activeTab === 'unread' ? warnaGlobal.primary : warnaGlobal.gray100}
              py="$2"
              borderRadius="$lg"
              alignItems="center"
            >
              <Text
                color={activeTab === 'unread' ? warnaGlobal.white : warnaGlobal.gray600}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                Unread
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* Notifications List */}
        <VStack space="md" px="$5">
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <VStack space="sm">
              <Text fontSize="$sm" fontWeight="$bold" color={warnaGlobal.gray900}>
                Today
              </Text>
              <VStack space="sm">
                {todayNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => {
                      // Handle notification press
                    }}
                  />
                ))}
              </VStack>
            </VStack>
          )}

          {/* Yesterday Section */}
          {yesterdayNotifications.length > 0 && (
            <VStack space="sm">
              <Text fontSize="$sm" fontWeight="$bold" color={warnaGlobal.gray900}>
                Yesterday
              </Text>
              <VStack space="sm">
                {yesterdayNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => {
                      // Handle notification press
                    }}
                  />
                ))}
              </VStack>
            </VStack>
          )}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <Box py="$10" alignItems="center">
              <Text fontSize={48} mb="$2">🔔</Text>
              <Text color={warnaGlobal.gray500} fontSize="$sm">
                Tidak ada notifikasi
              </Text>
            </Box>
          )}
        </VStack>

        {/* Floating Action Button */}
        <Pressable
          position="absolute"
          bottom="$6"
          right="$6"
          bg={warnaGlobal.primary}
          w={56}
          h={56}
          borderRadius="$full"
          justifyContent="center"
          alignItems="center"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
          elevation={5}
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </VStack>
    </Container>
  );
}
