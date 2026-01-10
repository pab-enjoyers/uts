// ========================================
// 🔖 BOOKMARK TAB
// Display user's bookmarked recipes from Firebase
// ========================================

import React, { useState, useEffect } from "react";
import { ScrollView as RNScrollView, Image, Alert, RefreshControl } from "react-native";
import { Container, warnaGlobal, RecipeListItem, CustomButton } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { getBookmarks, removeBookmark } from "../../services/userService";

import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";

export default function BookmarkTab() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await getBookmarks(user.uid);

      if (result.success && result.bookmarks) {
        // Convert to recipe format
        const recipes = result.bookmarks.map((bookmark) => ({
          id: bookmark.mealId,
          name: bookmark.mealName,
          image: bookmark.mealThumb || "🍽️",
          category: bookmark.category,
          area: bookmark.area,
          rating: (Math.random() * 2 + 3).toFixed(1),
          time: `${Math.floor(Math.random() * 30 + 15)} Mins`,
        }));
        setBookmarks(recipes);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      Alert.alert("Error", "Gagal memuat bookmark");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (mealId) => {
    Alert.alert(
      "Hapus Bookmark",
      "Yakin ingin menghapus bookmark ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await removeBookmark(user.uid, mealId);
              if (result.success) {
                setBookmarks((prev) => prev.filter((b) => b.id !== mealId));
                Alert.alert("Success", "Bookmark dihapus");
              }
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus bookmark");
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  // Not logged in state
  if (!user) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center" p="$5">
          <Ionicons
            name="bookmark-outline"
            size={80}
            color={warnaGlobal.gray400}
          />
          <Heading size="lg" mt="$4" textAlign="center">
            Login Diperlukan
          </Heading>
          <Text color={warnaGlobal.gray600} textAlign="center" mt="$2">
            Silakan login untuk melihat bookmark Anda
          </Text>
          <CustomButton
            onPress={() => router.push("/auth/login")}
            mt="$6"
          >
            Login Sekarang
          </CustomButton>
        </VStack>
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color={warnaGlobal.primary} />
          <Text mt="$3" color={warnaGlobal.gray500}>
            Memuat bookmark...
          </Text>
        </VStack>
      </Container>
    );
  }

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center" p="$5">
          <Ionicons
            name="bookmark-outline"
            size={80}
            color={warnaGlobal.gray400}
          />
          <Heading size="lg" mt="$4" textAlign="center">
            Belum Ada Bookmark
          </Heading>
          <Text color={warnaGlobal.gray600} textAlign="center" mt="$2">
            Mulai simpan resep favorit Anda dengan menekan ikon bookmark
          </Text>
          <CustomButton
            onPress={() => router.push("/(tabs)")}
            mt="$6"
            variant="outline"
          >
            Jelajahi Resep
          </CustomButton>
        </VStack>
      </Container>
    );
  }

  // Bookmarks list
  return (
    <Container scrollable bg="$white" padding="$0">
      <RNScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space="lg" px="$5" py="$6" pb="$24">
          {/* Header */}
          <VStack space="xs">
            <Heading size="2xl" fontWeight="$bold">
              Bookmark
            </Heading>
            <Text color={warnaGlobal.gray600}>
              {bookmarks.length} resep tersimpan
            </Text>
          </VStack>

          {/* Bookmarks List */}
          <VStack space="md">
            {bookmarks.map((recipe) => (
              <Box key={recipe.id} position="relative">
                <RecipeListItem
                  recipe={recipe}
                  onPress={() =>
                    router.push({
                      pathname: "/recipe-detail",
                      params: { mealId: recipe.id },
                    })
                  }
                />

                {/* Delete Button Overlay */}
                <Pressable
                  position="absolute"
                  top={10}
                  right={10}
                  onPress={() => handleRemoveBookmark(recipe.id)}
                >
                  <Box
                    bg="rgba(239, 68, 68, 0.9)"
                    p="$2"
                    borderRadius="$lg"
                    w={32}
                    h={32}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                  </Box>
                </Pressable>
              </Box>
            ))}
          </VStack>
        </VStack>
      </RNScrollView>
    </Container>
  );
}

