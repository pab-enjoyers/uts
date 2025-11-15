// ========================================
// 🔔 NOTIFICATION CARD COMPONENT
// Reusable component untuk notification item
// ========================================

import React from 'react';
import { HStack, VStack, Box, Text, Pressable } from '@gluestack-ui/themed';
import { warnaGlobal } from '../theme';

export function NotificationCard({ notification, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <HStack
        space="md"
        bg={notification.isRead ? warnaGlobal.white : warnaGlobal.gray50}
        p="$4"
        borderRadius="$lg"
        alignItems="flex-start"
      >
        {/* Icon Badge */}
        <Box
          bg={warnaGlobal.lightHex}
          w={45}
          h={45}
          borderRadius="$lg"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={24}>{notification.icon}</Text>
        </Box>

        {/* Content */}
        <VStack flex={1} space="xs">
          <Text fontSize="$sm" fontWeight="$bold" color={warnaGlobal.gray900}>
            {notification.title}
          </Text>
          <Text 
            fontSize="$xs" 
            color={warnaGlobal.gray500}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text fontSize="$xs" color={warnaGlobal.gray400}>
            {notification.timestamp}
          </Text>
        </VStack>

        {/* Unread Indicator */}
        {!notification.isRead && (
          <Box
            w={8}
            h={8}
            borderRadius="$full"
            bg={warnaGlobal.primary}
          />
        )}
      </HStack>
    </Pressable>
  );
}
