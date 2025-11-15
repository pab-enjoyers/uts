import React from "react";
import { HStack, VStack, Box, Text, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { warnaGlobal } from "../theme";

export function NotificationCard({ notification, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <HStack
        space="md"
        bg={warnaGlobal.gray50}
        p="$4"
        borderRadius="$lg"
        alignItems="flex-start"
      >
        {/* Content */}
        <VStack flex={1} space="xs">
          <Text fontSize="$sm" fontWeight="$bold" color={warnaGlobal.gray900}>
            {notification.title}
          </Text>
          <Text fontSize="$xs" color={warnaGlobal.gray400} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text fontSize="$xs" color={warnaGlobal.gray400}>
            {notification.timestamp}
          </Text>
        </VStack>

        {/* Icon in Yellow Box with Unread Badge */}
        <Box position="relative">
          <Box
            bg="#FFF4E5"
            w={40}
            h={40}
            borderRadius="$lg"
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons
              name={
                notification.type === "save_recipe"
                  ? "bookmark"
                  : "notifications"
              }
              size={20}
              color="#F59E0B"
            />
          </Box>
          {/* Unread Indicator Dot on Icon */}
          {!notification.isRead && (
            <Box
              position="absolute"
              top={-2}
              right={-2}
              w={8}
              h={8}
              borderRadius="$full"
              bg={warnaGlobal.primaryHex}
              borderWidth={2}
              borderColor="$white"
            />
          )}
        </Box>
      </HStack>
    </Pressable>
  );
}
