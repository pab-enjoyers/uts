import React, { useState } from "react";
import { Container, warnaGlobal, NotificationCard } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { notifications } from "../../data/notifikasi";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
} from "@gluestack-ui/themed";

export default function NotificationsPage() {
  // State untuk filter tabs (Props & State requirement)
  const [activeTab, setActiveTab] = useState("semua");

  // Filter notifications berdasarkan activeTab
  const getFilteredNotifications = () => {
    if (activeTab === "semua") return notifications;
    if (activeTab === "dibaca") return notifications.filter((n) => n.isRead);
    if (activeTab === "belum dibaca")
      return notifications.filter((n) => !n.isRead);
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  // Group notifications by day
  const todayNotifications = filteredNotifications.filter(
    (n) => n.day === "today"
  );
  const yesterdayNotifications = filteredNotifications.filter(
    (n) => n.day === "yesterday"
  );

  return (
    <Box flex={1} bg="$white">
      {/* Sticky Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        px="$4"
        pt="$12"
        pb="$4"
        bg="$white"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={3}
        elevation={3}
      >
        <Heading
          size="lg"
          fontWeight="$bold"
          color={warnaGlobal.gray900}
          textAlign="center"
          mb="$4"
        >
          Notifikasi
        </Heading>

        {/* Filter Tabs */}
        <HStack space="md" alignItems="center" justifyContent="center">
          <Pressable
            onPress={() => setActiveTab("semua")}
            bg={activeTab === "semua" ? warnaGlobal.primaryHex : "transparent"}
            px="$4"
            py="$2"
            borderRadius="$md"
            alignItems="center"
          >
            <Text
              color={activeTab === "semua" ? "$white" : warnaGlobal.gray500}
              fontSize="$sm"
              fontWeight="$semibold"
            >
              Semua
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("dibaca")}
            bg={activeTab === "dibaca" ? warnaGlobal.primaryHex : "transparent"}
            px="$4"
            py="$2"
            borderRadius="$md"
            alignItems="center"
          >
            <Text
              color={activeTab === "dibaca" ? "$white" : warnaGlobal.gray500}
              fontSize="$sm"
              fontWeight="$semibold"
            >
              Dibaca
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("belum dibaca")}
            bg={
              activeTab === "belum dibaca"
                ? warnaGlobal.primaryHex
                : "transparent"
            }
            px="$4"
            py="$2"
            borderRadius="$md"
            alignItems="center"
          >
            <Text
              color={
                activeTab === "belum dibaca" ? "$white" : warnaGlobal.gray500
              }
              fontSize="$sm"
              fontWeight="$semibold"
            >
              Belum Dibaca
            </Text>
          </Pressable>
        </HStack>
      </Box>
      {/* Scrollable Content with Padding Top for Sticky Header */}
      <Container scrollable bg="$white" padding="$0">
        <VStack space="lg" px="$4" mt="$48" pb="$24">
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <VStack space="md">
              <Text
                fontSize="$sm"
                fontWeight="$bold"
                color={warnaGlobal.gray900}
                px="$1"
              >
                Hari ini
              </Text>
              <VStack space="md">
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
            <VStack space="md">
              <Text
                fontSize="$sm"
                fontWeight="$bold"
                color={warnaGlobal.gray900}
                px="$1"
              >
                Kemarin
              </Text>
              <VStack space="md">
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
              <Text fontSize={48} mb="$2">
                🔔
              </Text>
              <Text color={warnaGlobal.gray500} fontSize="$sm">
                Tidak ada notifikasi
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
