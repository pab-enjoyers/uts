import React, { useState } from "react";
import { ScrollView as RNScrollView, Image } from "react-native";
import {
  Container,
  warnaGlobal,
  RecipeCard,
  RecipeListItem,
  CategoryChip,
} from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { categories, featuredRecipes, popularRecipes } from "../../data/resep";
import { userData } from "../../data/profile";

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
} from "@gluestack-ui/themed";

export default function HomePage() {
  // State management (Props & State - Syarat C)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  // Combine all recipes for search
  const allRecipes = [...featuredRecipes, ...popularRecipes];

  // Filter by search query first
  const searchFilteredRecipes = searchQuery.trim()
    ? allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Filter recipes based on selected category (only if not searching)
  const filteredFeaturedRecipes =
    selectedCategory === "All"
      ? featuredRecipes
      : featuredRecipes.filter(
          (recipe) => recipe.category === selectedCategory
        );

  const filteredPopularRecipes =
    selectedCategory === "All"
      ? popularRecipes.slice(0, 5)
      : popularRecipes
          .filter((recipe) => recipe.category === selectedCategory)
          .slice(0, 5);

  return (
    <Container scrollable bg="$white" padding="$0">
      <VStack space="md" pb="$24" mt="$12">
        {/* Header Section */}
        <Box px="$5" pt="$5" pb="$3">
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <VStack>
              <Heading size="xl" fontWeight="$bold">
                Halo {userData.name}
              </Heading>
              <Text size="sm" color={warnaGlobal.gray500}>
                Mau masak apa hari ini?
              </Text>
            </VStack>
            {userData.avatarImage ? (
              <Box
                w={48}
                h={48}
                borderRadius="$full"
                overflow="hidden"
                bg={warnaGlobal.gray100}
              >
                <Image
                  source={userData.avatarImage}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </Box>
            ) : (
              <Avatar size="md" bg={warnaGlobal.light}>
                <Text fontSize="$xl">
                  <Ionicons name="person" size={24} color="white" />
                </Text>
              </Avatar>
            )}
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
                {searchQuery.length > 0 && (
                  <InputSlot pr="$3">
                    <Pressable onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </Pressable>
                  </InputSlot>
                )}
              </Input>
            </Box>
            <Pressable>
              <Box
                bg={warnaGlobal.primary}
                p="$3"
                borderRadius="$xl"
                w={48}
                h={48}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="filter-outline" size={24} color="white" />
              </Box>
            </Pressable>
          </HStack>
        </Box>

        {/* Show search results or normal view */}
        {searchFilteredRecipes ? (
          // Search Results View
          <Box px="$5">
            <Heading size="md" mb="$3" fontWeight="$bold">
              Hasil Pencarian ({searchFilteredRecipes.length})
            </Heading>
            {searchFilteredRecipes.length === 0 ? (
              <Box py="$8" alignItems="center">
                <Ionicons name="search-outline" size={48} color="#d1d5db" />
                <Text color={warnaGlobal.gray500} mt="$2">
                  Tidak ada resep ditemukan untuk "{searchQuery}"
                </Text>
              </Box>
            ) : (
              <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="md">
                  {searchFilteredRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={`search-${recipe.id}-${recipe.name}-${index}`}
                      recipe={recipe}
                      isBookmarked={bookmarkedRecipes.includes(recipe.id)}
                      onPress={() =>
                        router.push({
                          pathname: "/angela/detail",
                          params: {
                            id: recipe.id,
                            name: recipe.name,
                            image: recipe.image,
                            rating: recipe.rating,
                            time: recipe.time,
                          },
                        })
                      }
                      onBookmark={(id) => {
                        setBookmarkedRecipes((prev) =>
                          prev.includes(id)
                            ? prev.filter((recipeId) => recipeId !== id)
                            : [...prev, id]
                        );
                      }}
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
                      onPress={() => setSelectedCategory(category.name)}
                      activeColor={warnaGlobal.primary}
                    />
                  ))}
                </HStack>
              </RNScrollView>
            </Box>

            {/* Featured Recipes Section - Horizontal Slider */}
            <Box>
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                <HStack space="md">
                  {filteredFeaturedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isBookmarked={bookmarkedRecipes.includes(recipe.id)}
                      onPress={() =>
                        router.push({
                          pathname: "/angela/detail",
                          params: {
                            id: recipe.id,
                            name: recipe.name,
                            image: recipe.image,
                            rating: recipe.rating,
                            time: recipe.time,
                          },
                        })
                      }
                      onBookmark={(id) => {
                        setBookmarkedRecipes((prev) =>
                          prev.includes(id)
                            ? prev.filter((recipeId) => recipeId !== id)
                            : [...prev, id]
                        );
                      }}
                      bookmarkBgColor={warnaGlobal.lightHex}
                      bookmarkActiveColor={warnaGlobal.primaryHex}
                    />
                  ))}
                </HStack>
              </RNScrollView>
            </Box>
          </>
        )}

        {/* Popular Recipes Section - Vertical List */}
        <Box px="$5">
          <Heading size="md" mb="$3" fontWeight="$bold">
            Resep Terpopuler
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
            {filteredPopularRecipes.length > 0 ? (
              filteredPopularRecipes.map((recipe) => (
                <RecipeListItem
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() =>
                    router.push({
                      pathname: "/angela/detail",
                      params: {
                        id: recipe.id,
                        name: recipe.name,
                        image: recipe.image,
                        rating: recipe.rating,
                        time: recipe.time,
                      },
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
    </Container>
  );
}
