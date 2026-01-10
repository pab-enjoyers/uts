import React, { useState, useEffect, useRef } from "react";
import { ScrollView as RNScrollView, Image, ActivityIndicator, Alert, RefreshControl } from "react-native";
import {
  Container,
  warnaGlobal,
  RecipeCard,
  RecipeListItem,
  CategoryChip,
} from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
  
  // API Data states
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);
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
        // Convert API format ke format lokal dengan estimasi waktu
        const meals = randomResult.meals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb || "🍽️",
          rating: (Math.random() * 2 + 3).toFixed(1), // Random 3-5
          time: estimateCookingTime(meal), // Estimasi dari ingredients + instructions
          bgColor: "$coolGray100",
          category: meal.strCategory,
          area: meal.strArea,
        }));

        setFeaturedMeals(meals.slice(0, 8));
        setPopularMeals(meals.slice(8, 15));
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
        const meals = result.meals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb || "🍽️",
          rating: (Math.random() * 2 + 3).toFixed(1),
          time: estimateCookingTime(meal), // Estimasi dari complexity
          bgColor: "$coolGray100",
          category: meal.strCategory,
          area: meal.strArea,
        }));
        setSearchResults(meals);
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
  // 🏷️ CATEGORY FILTER HANDLER
  // ========================================
  const handleCategoryChange = async (categoryName) => {
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
        const meals = result.meals.slice(0, 15).map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb || "🍽️",
          rating: (Math.random() * 2 + 3).toFixed(1),
          time: estimateCookingTime(meal), // Estimasi dari complexity
          bgColor: "$coolGray100",
          category: categoryName,
          area: meal.strArea || "",
        }));

        setFeaturedMeals(meals.slice(0, 8));
        setPopularMeals(meals.slice(8, 15));
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

    try {
      const isCurrentlyBookmarked = bookmarkedIds.includes(mealId);

      if (isCurrentlyBookmarked) {
        // Remove bookmark
        const result = await removeBookmark(user.uid, mealId);
        if (result.success) {
          setBookmarkedIds((prev) => prev.filter((id) => id !== mealId));
        }
      } else {
        // Add bookmark
        const result = await addBookmark(user.uid, {
          idMeal: mealId,
          strMeal: mealData.name,
          strMealThumb: typeof mealData.image === 'string' ? mealData.image : '',
          strCategory: mealData.category || "",
          strArea: mealData.area || "",
        });
        if (result.success) {
          setBookmarkedIds((prev) => [...prev, mealId]);
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
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
              <Pressable onPress={onRefresh}>
                <Box
                  bg={warnaGlobal.primary}
                  p="$3"
                  borderRadius="$xl"
                  w={48}
                  h={48}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons 
                    name={refreshing ? "refresh-outline" : "filter-outline"} 
                    size={24} 
                    color="white" 
                  />
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
                        onPress={() => handleCategoryChange(category.name)}
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
    </Container>
  );
}
