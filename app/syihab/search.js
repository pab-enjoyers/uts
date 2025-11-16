import React, { useState } from "react";
import { Container, warnaGlobal } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  Box,
  Text,
  Pressable,
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { featuredRecipes, popularRecipes } from "../../data/resep";

export default function SearchRecipes() {
  // State - Props & State requirement
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Traditional spare ribs baked",
    "Lamb chops with fruity couscous and mint",
    "Spice roasted chicken with flavored rice",
    "Chinese style egg fried rice with sliced pork",
  ]);

  // Combine all recipes
  const allRecipes = [...featuredRecipes, ...popularRecipes];

  // Filter recipes based on search query
  const filteredRecipes = searchQuery.trim()
    ? allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRecentSearchClick = (search) => {
    setSearchQuery(search);
  };

  const handleRecipeClick = (recipe) => {
    // Add to recent searches if not already there
    if (!recentSearches.includes(recipe.name)) {
      setRecentSearches([recipe.name, ...recentSearches.slice(0, 7)]);
    }

    // Navigate to detail
    router.push({
      pathname: "/angela/detail",
      params: {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        rating: recipe.rating,
        time: recipe.time,
      },
    });
  };

  const renderRecipeCard = (recipe, index) => (
    <Pressable
      key={`${recipe.id}-${index}`}
      onPress={() => handleRecipeClick(recipe)}
      w="48%"
      mb="$3"
    >
      <Box
        borderRadius="$2xl"
        overflow="hidden"
        position="relative"
        h={140}
      >
        {/* Background Image/Gradient */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={warnaGlobal.gray800}
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={70}>{recipe.image}</Text>
        </Box>

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.3)"
        />

        {/* Time Badge */}
        <Box position="absolute" top="$2" right="$2">
          <Box
            bg="rgba(255,255,255,0.9)"
            borderRadius="$full"
            px="$2"
            py="$1"
          >
            <HStack space="xs" alignItems="center">
              <Ionicons name="timer-outline" size={10} color="#ef4444" />
              <Text
                color={warnaGlobal.primary}
                fontSize="$xs"
                fontWeight="$semibold"
              >
                {recipe.time}
              </Text>
            </HStack>
          </Box>
        </Box>

        {/* Recipe Info - Positioned at bottom */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p="$3"
        >
          <Text
            fontSize="$sm"
            fontWeight="$bold"
            numberOfLines={2}
            color="$white"
            mb="$1"
          >
            {recipe.name}
          </Text>
          {recipe.author && (
            <Text fontSize="$xs" color="rgba(255,255,255,0.8)" numberOfLines={1}>
              {recipe.author}
            </Text>
          )}
        </Box>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg="$white"
        px="$5"
        pt="$12"
        pb="$3"
      >
        <HStack alignItems="center" space="md">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </Pressable>
          <Text fontSize="$lg" fontWeight="$semibold" flex={1}>
            Search recipes
          </Text>
        </HStack>

        {/* Search Input with Button */}
        <HStack space="sm" mt="$4">
          <Box flex={1}>
            <Input
              bg={warnaGlobal.gray50}
              borderRadius="$xl"
              borderWidth={0}
              h={48}
            >
              <InputSlot pl="$4">
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={warnaGlobal.gray400Hex}
                />
              </InputSlot>
              <InputField
                placeholder="Search recipe"
                value={searchQuery}
                onChangeText={handleSearch}
                fontSize="$sm"
              />
              {searchQuery.length > 0 && (
                <InputSlot pr="$4">
                  <Pressable onPress={() => setSearchQuery("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={warnaGlobal.gray400Hex}
                    />
                  </Pressable>
                </InputSlot>
              )}
            </Input>
          </Box>
          <Pressable
            bg={warnaGlobal.primary}
            w={48}
            h={48}
            borderRadius="$xl"
            justifyContent="center"
            alignItems="center"
            onPress={() => handleSearch(searchQuery)}
          >
            <Ionicons name="search" size={20} color="white" />
          </Pressable>
        </HStack>
      </Box>

      <Container scrollable bg="$white" padding="$0">
        <VStack space="md" px="$5" mt="$32" pb="$8">
          {/* Search Results or Recent Searches */}
          {searchQuery.trim() ? (
            // Search Results
            <VStack space="md">
              <Text fontSize="$md" fontWeight="$semibold">
                Search Results ({filteredRecipes.length})
              </Text>
              {filteredRecipes.length === 0 ? (
                <VStack alignItems="center" py="$8">
                  <Ionicons
                    name="search-outline"
                    size={48}
                    color={warnaGlobal.gray300Hex}
                  />
                  <Text
                    fontSize="$sm"
                    color={warnaGlobal.gray500}
                    mt="$2"
                    textAlign="center"
                  >
                    No recipes found for "{searchQuery}"
                  </Text>
                </VStack>
              ) : (
                <HStack flexWrap="wrap" gap="$3">
                  {filteredRecipes.map((recipe, index) =>
                    renderRecipeCard(recipe, index)
                  )}
                </HStack>
              )}
            </VStack>
          ) : (
            // Recent Searches
            <VStack space="md">
              <Text fontSize="$md" fontWeight="$semibold">
                Recent Search
              </Text>
              <HStack flexWrap="wrap" gap="$3">
                {recentSearches.map((recipe, index) => {
                  const recipeData = allRecipes.find(
                    (r) => r.name === recipe
                  ) || {
                    id: index,
                    name: recipe,
                    image: "🍽️",
                    rating: 4.5,
                    time: "20 Mins",
                  };
                  return renderRecipeCard(recipeData, index);
                })}
              </HStack>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
