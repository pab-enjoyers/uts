// ========================================
// 🔖 BOOKMARK TAB
// Display user's bookmarked recipes from Firebase
// ========================================

import React, { useState, useEffect } from "react";
import { ScrollView as RNScrollView, Image, Alert, RefreshControl } from "react-native";
import { Container, warnaGlobal, RecipeListItem, CustomButton, Card } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { getBookmarks, removeBookmark, addNotification } from "../../services/userService";
import { getMealById, estimateCookingTime } from "../../services/mealService";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (user) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Auto-refresh bookmarks ketika tab dibuka (setelah bookmark dari screen lain)
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadBookmarks();
      }
    }, [user])
  );

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await getBookmarks(user.uid);

      if (result.success && result.bookmarks) {
        // Fetch full meal data untuk estimasi waktu yang akurat
        const recipesPromises = result.bookmarks.map(async (bookmark) => {
          try {
            const mealResult = await getMealById(bookmark.mealId);
            if (mealResult.success && mealResult.meal) {
              return {
                id: bookmark.mealId,
                name: bookmark.mealName,
                image: bookmark.mealThumb || "🍽️",
                category: bookmark.category,
                area: bookmark.area,
                rating: "4.5",
                time: estimateCookingTime(mealResult.meal), // Estimasi akurat
                author: `${bookmark.area} Cuisine`,
              };
            }
          } catch (error) {
            console.log("Error fetching meal detail:", bookmark.mealId);
          }
          // Fallback jika API error
          return {
            id: bookmark.mealId,
            name: bookmark.mealName,
            image: bookmark.mealThumb || "🍽️",
            category: bookmark.category,
            area: bookmark.area,
            rating: "4.5",
            time: "30 menit",
            author: `${bookmark.area} Cuisine`,
          };
        });

        const recipes = await Promise.all(recipesPromises);
        setBookmarks(recipes.filter(Boolean)); // Filter null values
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      Alert.alert("Error", "Gagal memuat bookmark");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (mealId) => {
    // Find bookmark data before showing alert
    const bookmarkToRemove = bookmarks.find(b => b.id === mealId);
    
    Alert.alert(
      "Hapus Bookmark",
      "Yakin ingin menghapus bookmark ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            console.log('📌 [BOOKMARK-TAB] handleRemoveBookmark called');
            console.log('📌 [BOOKMARK-TAB] User ID:', user.uid);
            console.log('📌 [BOOKMARK-TAB] Meal ID:', mealId);
            console.log('📌 [BOOKMARK-TAB] Meal name:', bookmarkToRemove?.name);
            
            try {
              console.log('🗑️ [BOOKMARK-TAB] Removing bookmark...');
              const result = await removeBookmark(user.uid, mealId);
              console.log('🗑️ [BOOKMARK-TAB] Remove result:', result);
              
              if (result.success) {
                setBookmarks((prev) => prev.filter((b) => b.id !== mealId));
                
                // Send REMOVE notification
                console.log("📢 [BOOKMARK-TAB] Sending REMOVE bookmark notification...");
                try {
                  const notifResult = await addNotification(user.uid, {
                    title: "Bookmark Dihapus",
                    message: `${bookmarkToRemove?.name || 'Resep'} dihapus dari bookmark`,
                    type: "bookmark",
                    mealId: mealId,
                  });
                  console.log("📢 [BOOKMARK-TAB] ✅ REMOVE Notification result:", notifResult);
                  
                  if (!notifResult.success) {
                    console.error("📢 [BOOKMARK-TAB] ❌ REMOVE Notification GAGAL:", notifResult.message);
                  }
                } catch (notifError) {
                  console.error("📢 [BOOKMARK-TAB] ❌ REMOVE Notification ERROR:", notifError);
                }
                
                Alert.alert("Success", "Bookmark dihapus");
              }
            } catch (error) {
              console.error("❌ [BOOKMARK-TAB] Remove bookmark error:", error);
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
          <VStack space="sm">
            {/* <Heading size="2xl" fontWeight="$bold">
              Resep Tersimpan
            </Heading> */}
            <HStack alignItems="center" space="xs">
              <Ionicons name="bookmark" size={16} color={warnaGlobal.primary} />
              <Text color={warnaGlobal.gray600} fontSize="$sm">
                {bookmarks.length} resep
              </Text>
            </HStack>
          </VStack>

          {/* Bookmarks List */}
          <VStack space="md">
            {bookmarks.slice(0, page * ITEMS_PER_PAGE).map((recipe, index) => (
              <Box key={recipe.id} position="relative">
                {/* Recipe Card - Direct Pressable */}
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/recipe-detail",
                      params: { mealId: recipe.id },
                    });
                  }}
                  sx={{
                    ':active': {
                      transform: [{ scale: 0.98 }],
                    },
                  }}
                >
                  <HStack
                    space="md"
                    bg={warnaGlobal.gray50}
                    borderRadius="$xl"
                    p="$3"
                    alignItems="center"
                  >
                    {/* Recipe Image */}
                    <Box
                      bg={warnaGlobal.gray200}
                      borderRadius="$xl"
                      w={70}
                      h={70}
                      justifyContent="center"
                      alignItems="center"
                      overflow="hidden"
                    >
                      {recipe.image && (recipe.image.startsWith('http') || recipe.image.startsWith('https')) ? (
                        <Image
                          source={{ uri: recipe.image }}
                          style={{
                            width: 70,
                            height: 70,
                            resizeMode: 'cover'
                          }}
                        />
                      ) : (
                        <Text fontSize={36}>{recipe.image || '🍽️'}</Text>
                      )}
                    </Box>

                    {/* Recipe Info */}
                    <VStack flex={1} space="xs">
                      <Text fontSize="$sm" fontWeight="$bold" numberOfLines={2} ellipsizeMode="tail" lineHeight="$sm">
                        {recipe.name}
                      </Text>
                      
                      {/* Star Rating */}
                      <HStack space="xs" alignItems="center">
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < parseInt(recipe.rating) ? 'star' : 'star-outline'}
                            size={14}
                            color={warnaGlobal.amber400Hex}
                          />
                        ))}
                      </HStack>
                      
                      <Text fontSize="$xs" color={warnaGlobal.gray500}>
                        {recipe.author}
                      </Text>
                      
                      {/* Time Info */}
                      <HStack space="xs" alignItems="center">
                        <Ionicons name="timer-outline" size={13} color={warnaGlobal.gray500Hex} />
                        <Text fontSize="$xs" color={warnaGlobal.gray600}>
                          {recipe.time}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Pressable>

                {/* Delete Button - Rounded Rectangle (not circle) */}
                <Pressable
                  position="absolute"
                  bottom={10}
                  right={10}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleRemoveBookmark(recipe.id);
                  }}
                  sx={{
                    ':active': {
                      transform: [{ scale: 0.9 }],
                    },
                  }}
                >
                  <Box
                    bg="rgba(239, 68, 68, 0.95)"
                    px="$3"
                    py="$2"
                    borderRadius="$lg"
                    justifyContent="center"
                    alignItems="center"
                    shadowColor="$black"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.2}
                    shadowRadius={4}
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </Box>
                </Pressable>
              </Box>
            ))}
          </VStack>

          {/* Load More Button */}
          {bookmarks.length > page * ITEMS_PER_PAGE && (
            <CustomButton
              variant="outline"
              onPress={() => setPage(page + 1)}
              mt="$4"
            >
              Muat Lebih Banyak ({bookmarks.length - (page * ITEMS_PER_PAGE)} resep)
            </CustomButton>
          )}
        </VStack>
      </RNScrollView>
    </Container>
  );
}

