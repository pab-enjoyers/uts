import React, { useState, useEffect } from "react";
import { RefreshControl, ActivityIndicator } from "react-native";
import { Container, warnaGlobal, NotificationCard } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { router, useFocusEffect } from "expo-router";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "../../services/userService";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
  ScrollView as RNScrollView,
} from "@gluestack-ui/themed";

export default function NotificationsPage() {
  const { user, setUnreadNotifications } = useAuth();
  
  // State untuk filter tabs (Props & State requirement)
  const [activeTab, setActiveTab] = useState("semua");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  // Load notifications on mount and when focused
  useEffect(() => {
    loadNotifications();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadNotifications();
      }
    }, [user])
  );

  const loadNotifications = async () => {
    if (!user || !user.uid) {
      console.log('⚠️ No user logged in, cannot load notifications');
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      console.log('📥 Loading notifications for user:', user.uid);
      setLoading(true);
      const result = await getNotifications(user.uid);
      
      console.log('📥 getNotifications result:', result);
      console.log('📥 Notifications count:', result.notifications?.length || 0);
      
      if (result.success) {
        setNotifications(result.notifications || []);
        console.log('✅ Notifications loaded successfully:', result.notifications?.length);
      } else {
        console.error('❌ Failed to load notifications:', result);
      }

      // Load unread count
      const countResult = await getUnreadNotificationCount(user.uid);
      if (countResult.success) {
        setUnreadCount(countResult.count);
        setUnreadNotifications(countResult.count); // Update global context
        console.log('📊 Unread count:', countResult.count);
      }
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read
    if (!notification.read && user) {
      await markNotificationAsRead(user.uid, notification.id);
      
      // Update unread count immediately
      setUnreadCount(prev => Math.max(0, prev - 1));
      setUnreadNotifications(prev => Math.max(0, prev - 1));
      
      loadNotifications();
    }

    // Navigate if has mealId
    if (notification.mealId) {
      router.push({
        pathname: "/recipe-detail",
        params: { mealId: notification.mealId },
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!user) return;

    const result = await deleteNotification(user.uid, notificationId);
    if (result.success) {
      loadNotifications();
    }
  };

  // Filter notifications berdasarkan activeTab
  const getFilteredNotifications = () => {
    if (activeTab === "semua") return notifications;
    if (activeTab === "dibaca") return notifications.filter((n) => n.read);
    if (activeTab === "belum dibaca") return notifications.filter((n) => !n.read);
    return notifications;
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user || markingAll || unreadCount === 0) return;
    
    try {
      setMarkingAll(true);
      const result = await markAllNotificationsAsRead(user.uid);
      if (result.success) {
        setUnreadCount(0);
        setUnreadNotifications(0);
        loadNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const filteredNotifications = getFilteredNotifications();

  // Group notifications by time (today, yesterday, older)
  const groupNotificationsByTime = () => {
    const now = new Date();
    const today = [];
    const yesterday = [];
    const older = [];

    filteredNotifications.forEach((notif) => {
      const notifDate = notif.createdAt?.toDate ? notif.createdAt.toDate() : new Date(notif.createdAt);
      const diffDays = Math.floor((now - notifDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        today.push(notif);
      } else if (diffDays === 1) {
        yesterday.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, older };
  };

  const { today: todayNotifications, yesterday: yesterdayNotifications, older: olderNotifications } = groupNotificationsByTime();

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
            <HStack space="xs" alignItems="center">
              <Text
                color={
                  activeTab === "belum dibaca" ? "$white" : warnaGlobal.gray500
                }
                fontSize="$sm"
                fontWeight="$semibold"
              >
                Belum Dibaca
              </Text>
              {unreadCount > 0 && (
                <Box
                  bg={activeTab === "belum dibaca" ? "$white" : warnaGlobal.primaryHex}
                  borderRadius="$full"
                  px="$2"
                  py="$0.5"
                  minWidth={20}
                  alignItems="center"
                >
                  <Text
                    color={activeTab === "belum dibaca" ? warnaGlobal.primaryHex : "$white"}
                    fontSize={10}
                    fontWeight="$bold"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </Box>
              )}
            </HStack>
          </Pressable>
        </HStack>
      </Box>
      
      {/* Not logged in view - Sama seperti Bookmark */}
      {!user ? (
        <Container>
          <VStack flex={1} justifyContent="center" alignItems="center" p="$5">
            <Ionicons
              name="notifications-off-outline"
              size={80}
              color={warnaGlobal.gray400Hex}
            />
            <Text
              fontSize="$lg"
              fontWeight="$bold"
              color={warnaGlobal.gray900}
              mt="$4"
              textAlign="center"
            >
              Login Diperlukan
            </Text>
            <Text 
              fontSize="$sm" 
              color={warnaGlobal.gray500} 
              mt="$2"
              textAlign="center"
            >
              Silakan login untuk melihat notifikasi Anda
            </Text>
            <Pressable onPress={() => router.push('/auth/login')} mt="$6">
              <Box bg={warnaGlobal.primaryHex} px="$6" py="$3" borderRadius="$xl">
                <Text color="$white" fontWeight="$semibold">
                  Login Sekarang
                </Text>
              </Box>
            </Pressable>
          </VStack>
        </Container>
      ) : loading ? (
        <Container>
          <VStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color={warnaGlobal.primaryHex} />
            <Text color={warnaGlobal.gray500} mt="$3">
              Memuat notifikasi...
            </Text>
          </VStack>
        </Container>
      ) : filteredNotifications.length === 0 ? (
        <Container>
          <VStack flex={1} justifyContent="center" alignItems="center" p="$5">
            <Ionicons
              name="notifications-outline"
              size={80}
              color={warnaGlobal.gray400Hex}
            />
            <Text
              fontSize="$lg"
              fontWeight="$bold"
              color={warnaGlobal.gray900}
              mt="$4"
              textAlign="center"
            >
              {activeTab === "belum dibaca" 
                ? "Tidak Ada Notifikasi Baru" 
                : activeTab === "dibaca"
                ? "Belum Ada yang Dibaca"
                : "Belum Ada Notifikasi"}
            </Text>
            <Text color={warnaGlobal.gray600} textAlign="center" mt="$2">
              {activeTab === "belum dibaca"
                ? "Semua notifikasi sudah dibaca"
                : activeTab === "dibaca"
                ? "Notifikasi yang sudah Anda baca akan muncul di sini"
                : "Notifikasi baru akan muncul di sini"}
            </Text>
          </VStack>
        </Container>
      ) : (
        <Container 
          scrollable 
          bg="$white" 
          padding="$0"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        <VStack space="lg" px="$4" mt="$48" pb="$24">
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center" px="$1">
                <Text
                  fontSize="$sm"
                  fontWeight="$bold"
                  color={warnaGlobal.gray900}
                >
                  Hari ini
                </Text>
                {/* Tandai Semua sebagai text link */}
                {unreadCount > 0 && (
                  <Pressable onPress={handleMarkAllAsRead} disabled={markingAll}>
                    <Text
                      fontSize="$xs"
                      fontWeight="$medium"
                      color={markingAll ? warnaGlobal.gray400 : warnaGlobal.primaryHex}
                    >
                      {markingAll ? "Menandai..." : "Tandai Semua Dibaca"}
                    </Text>
                  </Pressable>
                )}
              </HStack>
              <VStack space="md">
                {todayNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleNotificationPress(notification)}
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
                    onPress={() => handleNotificationPress(notification)}
                  />
                ))}
              </VStack>
            </VStack>
          )}

          {/* Older Section */}
          {olderNotifications.length > 0 && (
            <VStack space="md">
              <Text
                fontSize="$sm"
                fontWeight="$bold"
                color={warnaGlobal.gray900}
                px="$1"
              >
                Sebelumnya
              </Text>
              <VStack space="md">
                {olderNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleNotificationPress(notification)}
                  />
                ))}
              </VStack>
            </VStack>
          )}
        </VStack>
      </Container>
      )}
    </Box>
  );
}
