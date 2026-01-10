import React, { useState, useEffect } from "react";
import { ScrollView as RNScrollView, Image, RefreshControl, ActivityIndicator } from "react-native";
import { Container, warnaGlobal, CustomButton } from "../styles";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { listAllCategories, filterByCategory, estimateCookingTime } from "../services/mealService";

/**
 * CATEGORY EXPLORATION SCREEN
 * Browse all available categories and explore meals by category
 */
export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryMeals, setCategoryMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await listAllCategories();
      
      if (result.success && result.categories) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category);
    
    try {
      setMealsLoading(true);
      const result = await filterByCategory(category.strCategory);
      
      if (result.success && result.meals) {
        const meals = result.meals.slice(0, 20).map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb || "🍽️",
          time: estimateCookingTime(meal),
          category: category.strCategory,
        }));
        setCategoryMeals(meals);
      }
    } catch (error) {
      console.error("Error loading category meals:", error);
    } finally {
      setMealsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    if (selectedCategory) {
      await handleCategoryPress(selectedCategory);
    }
    setRefreshing(false);
  };

  // Show category meals view
  if (selectedCategory) {
    return (
      <Box flex={1} bg="$white">
        {/* Header */}
        <Box
          px="$5"
          pt="$12"
          pb="$4"
          bg="$white"
          borderBottomWidth={1}
          borderBottomColor={warnaGlobal.gray100}
        >
          <HStack alignItems="center" space="md">
            <Pressable onPress={() => setSelectedCategory(null)}>
              <Ionicons name="arrow-back" size={24} color={warnaGlobal.gray900Hex} />
            </Pressable>
            <VStack flex={1}>
              <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
                {selectedCategory.strCategory}
              </Heading>
              <Text fontSize="$sm" color={warnaGlobal.gray500}>
                {categoryMeals.length} resep tersedia
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Meals Grid */}
        <Container scrollable bg="$white" padding="$0">
          <RNScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            <VStack space="md" p="$5" pb="$24">
              {mealsLoading ? (
                <Box py="$10" alignItems="center">
                  <Spinner size="large" color={warnaGlobal.primary} />
                  <Text mt="$3" color={warnaGlobal.gray500}>
                    Memuat resep...
                  </Text>
                </Box>
              ) : categoryMeals.length === 0 ? (
                <Box py="$10" alignItems="center">
                  <Ionicons name="restaurant-outline" size={64} color={warnaGlobal.gray300Hex} />
                  <Text mt="$3" color={warnaGlobal.gray500}>
                    Tidak ada resep tersedia
                  </Text>
                </Box>
              ) : (
                <VStack space="md">
                  {categoryMeals.map((meal) => (
                    <Pressable
                      key={meal.id}
                      onPress={() => {
                        router.push({
                          pathname: "/recipe-detail",
                          params: { mealId: meal.id },
                        });
                      }}
                    >
                      {({ pressed }) => (
                        <Box
                          bg="$white"
                          borderRadius="$xl"
                          borderWidth={1}
                          borderColor={warnaGlobal.gray200}
                          p="$3"
                          opacity={pressed ? 0.8 : 1}
                        >
                          <HStack space="md" alignItems="center">
                            {/* Image */}
                            <Box
                              w={80}
                              h={80}
                              borderRadius="$lg"
                              overflow="hidden"
                              bg={warnaGlobal.gray100}
                            >
                              {typeof meal.image === 'string' && meal.image.startsWith('http') ? (
                                <Image
                                  source={{ uri: meal.image }}
                                  style={{ width: '100%', height: '100%' }}
                                  resizeMode="cover"
                                />
                              ) : (
                                <Box flex={1} justifyContent="center" alignItems="center">
                                  <Text fontSize="$3xl">{meal.image}</Text>
                                </Box>
                              )}
                            </Box>

                            {/* Info */}
                            <VStack flex={1} space="xs">
                              <Text
                                fontSize="$md"
                                fontWeight="$semibold"
                                color={warnaGlobal.gray900}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {meal.name}
                              </Text>
                              <HStack space="md" alignItems="center">
                                <HStack space="xs" alignItems="center">
                                  <Ionicons
                                    name="time-outline"
                                    size={14}
                                    color={warnaGlobal.gray500Hex}
                                  />
                                  <Text fontSize="$xs" color={warnaGlobal.gray500}>
                                    {meal.time} min
                                  </Text>
                                </HStack>
                              </HStack>
                            </VStack>

                            {/* Arrow */}
                            <Ionicons
                              name="chevron-forward"
                              size={20}
                              color={warnaGlobal.gray400Hex}
                            />
                          </HStack>
                        </Box>
                      )}
                    </Pressable>
                  ))}
                </VStack>
              )}
            </VStack>
          </RNScrollView>
        </Container>
      </Box>
    );
  }

  // Show categories grid
  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        px="$5"
        pt="$12"
        pb="$4"
        bg="$white"
        borderBottomWidth={1}
        borderBottomColor={warnaGlobal.gray100}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={warnaGlobal.gray900Hex} />
          </Pressable>
          <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
            Kategori Resep
          </Heading>
          <Box w={24} />
        </HStack>
      </Box>

      {/* Categories Grid */}
      <Container scrollable bg="$white" padding="$0">
        <RNScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <VStack space="md" p="$5" pb="$24">
            {loading ? (
              <Box py="$10" alignItems="center">
                <Spinner size="large" color={warnaGlobal.primary} />
                <Text mt="$3" color={warnaGlobal.gray500}>
                  Memuat kategori...
                </Text>
              </Box>
            ) : categories.length === 0 ? (
              <Box py="$10" alignItems="center">
                <Ionicons name="list-outline" size={64} color={warnaGlobal.gray300Hex} />
                <Text mt="$3" color={warnaGlobal.gray500}>
                  Tidak ada kategori tersedia
                </Text>
              </Box>
            ) : (
              <VStack space="md">
                {categories.map((category, index) => (
                  <Pressable
                    key={category.idCategory || index}
                    onPress={() => handleCategoryPress(category)}
                  >
                    {({ pressed }) => (
                      <Box
                        bg="$white"
                        borderRadius="$xl"
                        borderWidth={1}
                        borderColor={warnaGlobal.gray200}
                        p="$4"
                        opacity={pressed ? 0.8 : 1}
                      >
                        <HStack space="md" alignItems="center">
                          {/* Category Image */}
                          <Box
                            w={70}
                            h={70}
                            borderRadius="$lg"
                            overflow="hidden"
                            bg={warnaGlobal.gray100}
                          >
                            {category.strCategoryThumb ? (
                              <Image
                                source={{ uri: category.strCategoryThumb }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                              />
                            ) : (
                              <Box flex={1} justifyContent="center" alignItems="center">
                                <Ionicons
                                  name="restaurant"
                                  size={32}
                                  color={warnaGlobal.gray400Hex}
                                />
                              </Box>
                            )}
                          </Box>

                          {/* Category Info */}
                          <VStack flex={1} space="xs">
                            <Text
                              fontSize="$lg"
                              fontWeight="$bold"
                              color={warnaGlobal.gray900}
                            >
                              {category.strCategory}
                            </Text>
                            <Text
                              fontSize="$xs"
                              color={warnaGlobal.gray500}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {category.strCategoryDescription || "Explore recipes"}
                            </Text>
                          </VStack>

                          {/* Arrow */}
                          <Ionicons
                            name="chevron-forward"
                            size={24}
                            color={warnaGlobal.gray400Hex}
                          />
                        </HStack>
                      </Box>
                    )}
                  </Pressable>
                ))}
              </VStack>
            )}
          </VStack>
        </RNScrollView>
      </Container>
    </Box>
  );
}
