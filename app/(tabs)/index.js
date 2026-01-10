import React, { useState, useEffect, useRef } from "react";
import { ScrollView as RNScrollView, Image, ActivityIndicator, Alert, RefreshControl, Modal, View, TouchableWithoutFeedback } from "react-native";
import {
  Container,
  warnaGlobal,
  RecipeCard,
  RecipeListItem,
  CategoryChip,
} from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";

// API Services
import {
  searchMealByName,
  getRandomMeals,
  listAllCategories,
  filterByCategory,
  estimateCookingTime,
} from "../../services/mealService";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked as checkIsBookmarked,
  getAverageRating,
  addNotification,
} from "../../services/userService";

import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Pressable,
  Avatar,
  SearchIcon,
  Spinner,
} from "@gluestack-ui/themed";

export default function HomePage() {
  // Auth context
  const { user } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [sortBy, setSortBy] = useState("default"); // default, name-asc, name-desc, time-asc
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // API Data states
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);
  const [lastSeenMealIds, setLastSeenMealIds] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  
  // Bookmark states
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Debounce search
  const searchTimeout = useRef(null);

  // ========================================
  // 🎯 LOAD INITIAL DATA
  // ========================================
  useEffect(() => {
    loadInitialData();
  }, []);

  // ========================================
  // 📚 LOAD USER BOOKMARKS
  // ========================================
  useEffect(() => {
    if (user) {
      loadUserBookmarks();
    }
  }, [user]);

  // Auto-refresh bookmarks ketika kembali ke screen ini (after unbookmark di screen lain)
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadUserBookmarks();
      }
    }, [user])
  );

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResult = await listAllCategories();
      if (categoriesResult.success && categoriesResult.categories) {
        const apiCategories = categoriesResult.categories.map((cat, index) => ({
          id: index + 1,
          name: cat.strCategory,
        }));
        setCategories([{ id: 0, name: "All" }, ...apiCategories]);
      }

      // Fetch random meals untuk featured & popular
      const randomResult = await getRandomMeals(15);
      if (randomResult.success && randomResult.meals) {
        // Convert API format ke format lokal dengan rating dari Firebase
        const mealsWithRatings = await Promise.all(
          randomResult.meals.map(async (meal) => {
            const ratingResult = await getAverageRating(meal.idMeal);
            return {
              id: meal.idMeal,
              name: meal.strMeal,
              image: meal.strMealThumb || "🍽️",
              rating: (ratingResult.rating || 4.0).toFixed(1), // Format to 1 decimal
              ratingCount: ratingResult.count || 0,
              time: estimateCookingTime(meal),
              bgColor: "$coolGray100",
              category: meal.strCategory,
              area: meal.strArea,
            };
          })
        );

        const newFeatured = mealsWithRatings.slice(0, 8);
        const newPopular = mealsWithRatings.slice(8, 15);
        
        setFeaturedMeals(newFeatured);
        setPopularMeals(newPopular);
        
        // Check for new recipes and notify user
        if (user && lastSeenMealIds.length > 0) {
          const newMealIds = mealsWithRatings.map(m => m.id);
          const newRecipes = mealsWithRatings.filter(
            m => !lastSeenMealIds.includes(m.id)
          );
          
          // Notify about first 3 new recipes only (avoid spam)
          if (newRecipes.length > 0) {
            const recipesToNotify = newRecipes.slice(0, 3);
            for (const recipe of recipesToNotify) {
              await addNotification(user.uid, {
                title: "Resep Baru Tersedia!",
                message: `Cek resep baru: ${recipe.name} dari ${recipe.area || 'berbagai negara'}`,
                type: "new_recipe",
                mealId: recipe.id,
              });
            }
          }
          
          setLastSeenMealIds(newMealIds);
        } else if (user) {
          // First load, just save current meal IDs
          setLastSeenMealIds(mealsWithRatings.map(m => m.id));
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserBookmarks = async () => {
    try {
      const result = await getBookmarks(user.uid);
      if (result.success && result.bookmarks) {
        const ids = result.bookmarks.map((b) => b.mealId);
        setBookmarkedIds(ids);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  // ========================================
  // 🔍 SEARCH HANDLER (Debounced)
  // ========================================
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Clear previous timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // Set new timeout (debounce 500ms)
      searchTimeout.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
    } else {
      setSearchResults(null);
    }

    // Cleanup
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setSearchLoading(true);
      const result = await searchMealByName(query);

      if (result.success && result.meals) {
        let mealsWithRatings = await Promise.all(
          result.meals.map(async (meal) => {
            const ratingResult = await getAverageRating(meal.idMeal);
            return {
              id: meal.idMeal,
              name: meal.strMeal,
              image: meal.strMealThumb || "🍽️",
              rating: (ratingResult.rating || 4.0).toFixed(1), // Format to 1 decimal
              ratingCount: ratingResult.count || 0,
              time: estimateCookingTime(meal),
              bgColor: "$coolGray100",
              category: meal.strCategory,
              area: meal.strArea,
            };
          })
        );
        
        // Apply sorting
        mealsWithRatings = applySorting(mealsWithRatings);
        setSearchResults(mealsWithRatings);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Gagal mencari resep");
    } finally {
      setSearchLoading(false);
    }
  };

  // ========================================
  // 📊 SORTING FUNCTION
  // ========================================
  const applySorting = (meals) => {
    const sorted = [...meals];
    
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "time-asc":
        return sorted.sort((a, b) => parseInt(a.time) - parseInt(b.time));
      default:
        return sorted;
    }
  };

  // Re-apply sorting when sortBy changes
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setSearchResults(applySorting(searchResults));
    }
    if (selectedCategory !== "All" && (featuredMeals.length > 0 || popularMeals.length > 0)) {
      setFeaturedMeals(applySorting(featuredMeals));
      setPopularMeals(applySorting(popularMeals));
    }
  }, [sortBy]);

  // ========================================
  // 🏷️ CATEGORY FILTER HANDLER
  // ========================================
  const loadCategoryMeals = async (categoryName) => {
    setSelectedCategory(categoryName);

    if (categoryName === "All") {
      // Reset to random meals
      loadInitialData();
      return;
    }

    try {
      setCategoryLoading(true);
      const result = await filterByCategory(categoryName);

      if (result.success && result.meals) {
        let mealsWithRatings = await Promise.all(
          result.meals.slice(0, 15).map(async (meal) => {
            const ratingResult = await getAverageRating(meal.idMeal);
            return {
              id: meal.idMeal,
              name: meal.strMeal,
              image: meal.strMealThumb || "🍽️",
              rating: (ratingResult.rating || 4.0).toFixed(1), // Format to 1 decimal
              ratingCount: ratingResult.count || 0,
              time: estimateCookingTime(meal),
              bgColor: "$coolGray100",
              category: categoryName,
              area: meal.strArea || "",
            };
          })
        );

        // Apply sorting
        mealsWithRatings = applySorting(mealsWithRatings);
        setFeaturedMeals(mealsWithRatings.slice(0, 8));
        setPopularMeals(mealsWithRatings.slice(8, 15));
      }
    } catch (error) {
      console.error("Filter error:", error);
      Alert.alert("Error", "Gagal memfilter kategori");
    } finally {
      setCategoryLoading(false);
    }
  };

  // ========================================
  // 🔖 BOOKMARK HANDLER
  // ========================================
  const handleBookmark = async (mealId, mealData) => {
    if (!user) {
      Alert.alert("Login Required", "Silakan login untuk menyimpan bookmark");
      return;
    }

    console.log('📌 [DASHBOARD] handleBookmark called');
    console.log('📌 [DASHBOARD] User ID:', user.uid);
    console.log('📌 [DASHBOARD] Meal ID:', mealId);
    console.log('📌 [DASHBOARD] Meal name:', mealData.name);

    try {
      const isCurrentlyBookmarked = bookmarkedIds.includes(mealId);
      console.log('📌 [DASHBOARD] Is bookmarked:', isCurrentlyBookmarked);

      if (isCurrentlyBookmarked) {
        // Remove bookmark
        console.log('🗑️ [DASHBOARD] Removing bookmark...');
        const result = await removeBookmark(user.uid, mealId);
        console.log('🗑️ [DASHBOARD] Remove result:', result);
        
        if (result.success) {
          setBookmarkedIds((prev) => prev.filter((id) => id !== mealId));
          
          // Send REMOVE notification
          console.log("📢 [DASHBOARD] Sending REMOVE bookmark notification...");
          try {
            const notifResult = await addNotification(user.uid, {
              title: "Bookmark Dihapus",
              message: `${mealData.name} dihapus dari bookmark`,
              type: "bookmark",
              mealId: mealId,
            });
            console.log("📢 [DASHBOARD] ✅ REMOVE Notification result:", notifResult);
            
            if (!notifResult.success) {
              console.error("📢 [DASHBOARD] ❌ REMOVE Notification GAGAL:", notifResult.message);
            }
          } catch (notifError) {
            console.error("📢 [DASHBOARD] ❌ REMOVE Notification ERROR:", notifError);
          }
        }
      } else {
        // Add bookmark
        console.log('➕ [DASHBOARD] Adding bookmark...');
        const result = await addBookmark(user.uid, {
          idMeal: mealId,
          strMeal: mealData.name,
          strMealThumb: typeof mealData.image === 'string' ? mealData.image : '',
          strCategory: mealData.category || "",
          strArea: mealData.area || "",
        });
        console.log('➕ [DASHBOARD] Add result:', result);
        
        if (result.success) {
          setBookmarkedIds((prev) => [...prev, mealId]);
          
          // Send ADD notification
          console.log("📢 [DASHBOARD] Sending ADD bookmark notification...");
          try {
            const notifResult = await addNotification(user.uid, {
              title: "Bookmark Tersimpan",
              message: `${mealData.name} ditambahkan ke bookmark`,
              type: "bookmark",
              mealId: mealId,
            });
            console.log("📢 [DASHBOARD] ✅ ADD Notification result:", notifResult);
            
            if (!notifResult.success) {
              console.error("📢 [DASHBOARD] ❌ ADD Notification GAGAL:", notifResult.message);
            }
          } catch (notifError) {
            console.error("📢 [DASHBOARD] ❌ ADD Notification ERROR:", notifError);
          }
        }
      }
    } catch (error) {
      console.error("❌ [DASHBOARD] Bookmark error:", error);
      Alert.alert("Error", "Gagal menyimpan bookmark");
    }
  };

  // ========================================
  // 🔄 REFRESH HANDLER
  // ========================================
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    if (user) await loadUserBookmarks();
    setRefreshing(false);
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  // Loading state
  if (loading) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color={warnaGlobal.primary} />
          <Text mt="$3" color={warnaGlobal.gray500}>
            Memuat resep...
          </Text>
        </VStack>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center" p="$5">
          <Ionicons name="alert-circle-outline" size={64} color={warnaGlobal.gray400} />
          <Text mt="$3" color={warnaGlobal.gray600} textAlign="center">
            {error}
          </Text>
          <Pressable onPress={loadInitialData} mt="$4">
            <Box bg={warnaGlobal.primary} px="$6" py="$3" borderRadius="$xl">
              <Text color="$white" fontWeight="$semibold">
                Coba Lagi
              </Text>
            </Box>
          </Pressable>
        </VStack>
      </Container>
    );
  }

  // Prepare display data
  const displayedSearchResults = searchResults;
  const displayedFeatured = featuredMeals;
  const displayedPopular = popularMeals;

  return (
    <Container scrollable bg="$white" padding="$0">
      <RNScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space="md" pb="$24" mt="$12">
          {/* Header Section */}
          <Box px="$5" pt="$5" pb="$3">
            <HStack justifyContent="space-between" alignItems="center" mb="$4">
              <VStack>
                <Heading size="xl" fontWeight="$bold">
                  Halo {user?.nama || "Chef"}
                </Heading>
                <Text size="sm" color={warnaGlobal.gray500}>
                  Mau masak apa hari ini?
                </Text>
              </VStack>
              <Avatar size="md" bg={warnaGlobal.light}>
                <Text fontSize="$xl">
                  <Ionicons name="person" size={24} color="white" />
                </Text>
              </Avatar>
            </HStack>

            {/* Search Bar */}
            <HStack space="md" alignItems="center">
              <Box flex={1}>
                <Input
                  variant="outline"
                  size="lg"
                  borderRadius="$xl"
                  bg={warnaGlobal.gray50}
                >
                  <InputSlot pl="$4">
                    <InputIcon as={SearchIcon} color="$coolGray400" />
                  </InputSlot>
                  <InputField
                    placeholder="Cari resep"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchLoading ? (
                    <InputSlot pr="$3">
                      <Spinner size="small" />
                    </InputSlot>
                  ) : searchQuery.length > 0 ? (
                    <InputSlot pr="$3">
                      <Pressable onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color="#9ca3af" />
                      </Pressable>
                    </InputSlot>
                  ) : null}
                </Input>
              </Box>
              <Pressable onPress={() => setShowFilterModal(true)}>
                <Box
                  bg={warnaGlobal.primary}
                  p="$3"
                  borderRadius="$xl"
                  w={48}
                  h={48}
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <Ionicons 
                    name="options-outline" 
                    size={24} 
                    color="white" 
                  />
                  {(sortBy !== "default" || selectedCategory !== "All") && (
                    <Box
                      position="absolute"
                      top={8}
                      right={8}
                      w={8}
                      h={8}
                      borderRadius="$full"
                      bg="$amber400"
                    />
                  )}
                </Box>
              </Pressable>
            </HStack>
          </Box>

          {/* Show search results or normal view */}
          {displayedSearchResults ? (
            // Search Results View
            <Box px="$5">
              <Heading size="md" mb="$3" fontWeight="$bold">
                Hasil Pencarian ({displayedSearchResults.length})
              </Heading>
              {displayedSearchResults.length === 0 ? (
                <Box py="$8" alignItems="center">
                  <Ionicons name="search-outline" size={48} color="#d1d5db" />
                  <Text color={warnaGlobal.gray500} mt="$2">
                    Tidak ada resep ditemukan untuk "{searchQuery}"
                  </Text>
                </Box>
              ) : (
                <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space="md">
                    {displayedSearchResults.map((recipe, index) => (
                      <RecipeCard
                        key={`search-${recipe.id}-${index}`}
                        recipe={recipe}
                        isBookmarked={bookmarkedIds.includes(recipe.id)}
                        onPress={() =>
                          router.push({
                            pathname: "/recipe-detail",
                            params: { mealId: recipe.id },
                          })
                        }
                        onBookmark={() => handleBookmark(recipe.id, recipe)}
                        bookmarkBgColor={warnaGlobal.lightHex}
                        bookmarkActiveColor={warnaGlobal.primaryHex}
                      />
                    ))}
                  </HStack>
                </RNScrollView>
              )}
            </Box>
          ) : (
            <>
              {/* Category Tabs - Horizontal Scroll */}
              <Box>
                <HStack justifyContent="space-between" alignItems="center" px="$5" mb="$3">
                  <Heading size="sm" fontWeight="$bold">
                    Kategori
                  </Heading>
                  <Pressable onPress={() => router.push("/categories")}>
                    <HStack space="xs" alignItems="center">
                      <Text fontSize="$sm" color={warnaGlobal.primary} fontWeight="$medium">
                        Lihat Semua
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={warnaGlobal.primaryHex} />
                    </HStack>
                  </Pressable>
                </HStack>
                <RNScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  <HStack space="sm">
                    {categories.map((category) => (
                      <CategoryChip
                        key={category.id}
                        category={category.name}
                        isActive={selectedCategory === category.name}
                        onPress={() => loadCategoryMeals(category.name)}
                        activeColor={warnaGlobal.primary}
                      />
                    ))}
                  </HStack>
                </RNScrollView>
              </Box>

              {/* Featured Recipes Section - Horizontal Slider */}
              <Box>
                {categoryLoading ? (
                  <Box py="$8" alignItems="center">
                    <Spinner size="large" color={warnaGlobal.primary} />
                  </Box>
                ) : displayedFeatured.length > 0 ? (
                  <RNScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                  >
                    <HStack space="md">
                      {displayedFeatured.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          isBookmarked={bookmarkedIds.includes(recipe.id)}
                          onPress={() =>
                            router.push({
                              pathname: "/recipe-detail",
                              params: { mealId: recipe.id },
                            })
                          }
                          onBookmark={() => handleBookmark(recipe.id, recipe)}
                          bookmarkBgColor={warnaGlobal.lightHex}
                          bookmarkActiveColor={warnaGlobal.primaryHex}
                        />
                      ))}
                    </HStack>
                  </RNScrollView>
                ) : (
                  <Box py="$8" alignItems="center" px="$5">
                    <Text color={warnaGlobal.gray500}>
                      Tidak ada resep untuk kategori ini
                    </Text>
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Popular Recipes Section - Vertical List */}
          <Box px="$5">
            <Heading size="md" mb="$3" fontWeight="$bold">
              Rekomendasi Resep
              {selectedCategory !== "All" && (
                <Text
                  fontSize="$sm"
                  color={warnaGlobal.primary}
                  fontWeight="$normal"
                >
                  {" "}
                  ({selectedCategory})
                </Text>
              )}
            </Heading>

            <VStack space="md">
              {categoryLoading ? (
                <Box py="$6" alignItems="center">
                  <Spinner size="large" color={warnaGlobal.primary} />
                </Box>
              ) : displayedPopular.length > 0 ? (
                displayedPopular.map((recipe) => (
                  <RecipeListItem
                    key={recipe.id}
                    recipe={recipe}
                    onPress={() =>
                      router.push({
                        pathname: "/recipe-detail",
                        params: { mealId: recipe.id },
                      })
                    }
                  />
                ))
              ) : (
                <Box py="$6" alignItems="center">
                  <Text color={warnaGlobal.gray500}>
                    Tidak ada resep untuk kategori ini
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </RNScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <Box
                bg="$white"
                borderTopLeftRadius="$3xl"
                borderTopRightRadius="$3xl"
                p="$5"
                pb="$8"
              >
              {/* Header */}
              <HStack justifyContent="space-between" alignItems="center" mb="$4">
                <Heading size="lg" fontWeight="$bold">
                  Filter & Urutkan
                </Heading>
                <Pressable onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={28} color="#000" />
                </Pressable>
              </HStack>

              {/* Kategori Section */}
              <VStack space="md" mb="$5">
                <Text fontSize="$md" fontWeight="$semibold" color={warnaGlobal.gray700}>
                  Kategori
                </Text>
                <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space="sm">
                    {categories.map((cat) => (
                      <Pressable
                        key={cat.id}
                        onPress={() => {
                          setSelectedCategory(cat.name);
                          loadCategoryMeals(cat.name);
                          setShowFilterModal(false); // Auto close after select
                        }}
                      >
                        <Box
                          px="$4"
                          py="$2"
                          borderRadius="$full"
                          bg={selectedCategory === cat.name ? warnaGlobal.primary : warnaGlobal.gray100}
                          borderWidth={1}
                          borderColor={selectedCategory === cat.name ? warnaGlobal.primary : warnaGlobal.gray200}
                        >
                          <Text
                            fontSize="$sm"
                            fontWeight="$medium"
                            color={selectedCategory === cat.name ? "$white" : warnaGlobal.gray700}
                          >
                            {cat.name}
                          </Text>
                        </Box>
                      </Pressable>
                    ))}
                  </HStack>
                </RNScrollView>
              </VStack>

              {/* Urutkan Section */}
              <VStack space="md" mb="$5">
                <Text fontSize="$md" fontWeight="$semibold" color={warnaGlobal.gray700}>
                  Urutkan Berdasarkan
                </Text>
                <VStack space="sm">
                  {[
                    { value: "default", label: "Default", icon: "list-outline" },
                    { value: "name-asc", label: "Nama (A-Z)", icon: "text-outline" },
                    { value: "name-desc", label: "Nama (Z-A)", icon: "text-outline" },
                    { value: "time-asc", label: "Waktu Tercepat", icon: "time-outline" },
                  ].map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => setSortBy(option.value)}
                    >
                      <HStack
                        px="$4"
                        py="$3"
                        borderRadius="$xl"
                        bg={sortBy === option.value ? warnaGlobal.light : "$white"}
                        borderWidth={1}
                        borderColor={sortBy === option.value ? warnaGlobal.primary : warnaGlobal.gray200}
                        alignItems="center"
                        space="md"
                      >
                        <Box
                          w={40}
                          h={40}
                          borderRadius="$full"
                          bg={sortBy === option.value ? warnaGlobal.primary : warnaGlobal.gray100}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Ionicons
                            name={option.icon}
                            size={20}
                            color={sortBy === option.value ? "#fff" : "#6b7280"}
                          />
                        </Box>
                        <Text
                          flex={1}
                          fontSize="$sm"
                          fontWeight="$medium"
                          color={sortBy === option.value ? warnaGlobal.primary : warnaGlobal.gray700}
                        >
                          {option.label}
                        </Text>
                        {sortBy === option.value && (
                          <Ionicons name="checkmark-circle" size={24} color={warnaGlobal.primaryHex} />
                        )}
                      </HStack>
                    </Pressable>
                  ))}
                </VStack>
              </VStack>

              {/* Action Buttons */}
              <HStack space="md">
                <Pressable
                  flex={1}
                  onPress={() => {
                    setSortBy("default");
                    setSelectedCategory("All");
                  }}
                >
                  <Box
                    py="$3"
                    borderRadius="$xl"
                    borderWidth={1}
                    borderColor={warnaGlobal.gray300}
                    alignItems="center"
                  >
                    <Text fontSize="$sm" fontWeight="$semibold" color={warnaGlobal.gray700}>
                      Reset
                    </Text>
                  </Box>
                </Pressable>
                <Pressable
                  flex={1}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Box
                    py="$3"
                    borderRadius="$xl"
                    bg={warnaGlobal.primary}
                    alignItems="center"
                  >
                    <Text fontSize="$sm" fontWeight="$semibold" color="$white">
                      Terapkan
                    </Text>
                  </Box>
                </Pressable>
              </HStack>
            </Box>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Container>
  );
}
