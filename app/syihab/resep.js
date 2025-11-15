import React, { useState } from "react";
import { ScrollView as RNScrollView } from "react-native";
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

export default function SyihabTab() {
  // State management (Props & State - Syarat C)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  // Filter recipes based on selected category
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
                Halo Fuad Gedhangan
              </Heading>
              <Text size="sm" color={warnaGlobal.gray500}>
                Mau masak apa hari ini?
              </Text>
            </VStack>
            <Avatar size="md" bg={warnaGlobal.light}>
              {/* iki icon gawe icon profile */}
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
                <Text color="$white" fontSize="$lg">
                  {/* <Ionicons name="filter" size={24} color="white" /> */}
                  {/* iki gawe icon filter sebelah search bar */}
                  <Ionicons name="filter-outline" size={24} color="white" />
                </Text>
              </Box>
            </Pressable>
          </HStack>
        </Box>

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
