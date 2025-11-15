import React, { useState } from "react";
import { ScrollView as RNScrollView } from "react-native";
import { Container, warnaGlobalMerah } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
  AvatarImage,
  Badge,
  BadgeText,
} from "@gluestack-ui/themed";
import { SearchIcon } from "@gluestack-ui/themed";

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
      <VStack space="md" pb="$4" mt="$12">
        {/* Header Section */}
        <Box px="$5" pt="$5" pb="$3">
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <VStack>
              <Heading size="xl" fontWeight="$bold">
                Halo Fuad Gedhangan
              </Heading>
              <Text size="sm" color="$coolGray500">
                Mau masak apa hari ini?
              </Text>
            </VStack>
            <Avatar size="md" bg={warnaGlobalMerah.light}>
              {/* iki icon gawe icon profile */}
              <Text fontSize="$xl">
                <FontAwesome name="user" size={24} color="white" />
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
                bg="$coolGray50"
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
                bg={warnaGlobalMerah.primary}
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
                  <FontAwesome name="filter" size={24} color="white" />
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
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Box
                    bg={
                      selectedCategory === category.name
                        ? warnaGlobalMerah.primary
                        : "$coolGray100"
                    }
                    px="$5"
                    py="$2"
                    borderRadius="$xl"
                  >
                    <Text
                      color={
                        selectedCategory === category.name
                          ? "$white"
                          : "$coolGray700"
                      }
                      fontWeight="$semibold"
                      fontSize="$sm"
                    >
                      {category.name}
                    </Text>
                  </Box>
                </Pressable>
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
                <Pressable
                  key={recipe.id}
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
                  sx={{
                    ":active": {
                      transform: [{ scale: 0.95 }],
                    },
                  }}
                >
                  <Box
                    w={170}
                    h={220}
                    bg={recipe.bgColor}
                    borderRadius="$2xl"
                    p="$4"
                    position="relative"
                    sx={{
                      ":active": {
                        opacity: 0.8,
                      },
                    }}
                  >
                    {/* Recipe Image/Icon */}
                    <Box alignItems="center" mb="$3" mt="$2">
                      <Text fontSize={64}>{recipe.image}</Text>
                    </Box>

                    {/* Rating Badge */}
                    <Box position="absolute" top="$3" right="$3">
                      <Badge
                        size="md"
                        variant="solid"
                        borderRadius="$lg"
                        bg="$amber400"
                      >
                        <BadgeText
                          color="$white"
                          fontWeight="$bold"
                          fontSize="$xs"
                        >
                          {recipe.rating}
                        </BadgeText>
                      </Badge>
                    </Box>

                    {/* Bookmark Icon */}
                    <Pressable
                      position="absolute"
                      bottom="$4"
                      right="$4"
                      onPress={(e) => {
                        e.stopPropagation();
                        setBookmarkedRecipes((prev) =>
                          prev.includes(recipe.id)
                            ? prev.filter((id) => id !== recipe.id)
                            : [...prev, recipe.id]
                        );
                      }}
                    >
                      <Box
                        bg={
                          bookmarkedRecipes.includes(recipe.id)
                            ? warnaGlobalMerah.light
                            : "$white"
                        }
                        p="$2"
                        borderRadius="$lg"
                        shadowColor="$black"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={4}
                      >
                        <FontAwesome
                          name={
                            bookmarkedRecipes.includes(recipe.id)
                              ? "bookmark"
                              : "bookmark-o"
                          }
                          size={13}
                          color={
                            bookmarkedRecipes.includes(recipe.id)
                              ? "#dc2626"
                              : "#6b7280"
                          }
                        />
                      </Box>
                    </Pressable>

                    {/* Recipe Info */}
                    <VStack
                      space="xs"
                      position="absolute"
                      bottom="$4"
                      left="$4"
                      right="$12"
                    >
                      <Text
                        fontSize="$sm"
                        fontWeight="$bold"
                        numberOfLines={2}
                        h={36}
                      >
                        {recipe.name}
                      </Text>
                      <Text fontSize="$xs" color="$coolGray600">
                        Time
                      </Text>
                      <Text fontSize="$xs" fontWeight="$semibold">
                        {recipe.time}
                      </Text>
                    </VStack>
                  </Box>
                </Pressable>
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
                color={warnaGlobalMerah.primary}
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
                <Pressable
                  key={recipe.id}
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
                  sx={{
                    ":active": {
                      transform: [{ scale: 0.98 }],
                    },
                  }}
                >
                  {/* Recipe Card */}
                  <HStack
                    space="md"
                    bg="$coolGray50"
                    borderRadius="$xl"
                    p="$3"
                    alignItems="center"
                    sx={{
                      ":active": {
                        bg: "$coolGray100",
                      },
                    }}
                  >
                    {/* Recipe Image */}
                    <Box
                      bg="$coolGray800"
                      borderRadius="$xl"
                      w={70}
                      h={70}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={36}>{recipe.image}</Text>
                    </Box>

                    {/* Recipe Info */}
                    <VStack flex={1} space="xs">
                      <Text fontSize="$sm" fontWeight="$bold" numberOfLines={1}>
                        {recipe.name}
                      </Text>
                      <HStack space="xs" alignItems="center">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesome
                            key={i}
                            name={i < recipe.rating ? "star" : "star-o"}
                            size={14}
                            color="#f59e0b"
                          />
                        ))}
                      </HStack>
                      <Text fontSize="$xs" color="$coolGray500">
                        {recipe.author}
                      </Text>
                      <HStack space="xs" alignItems="center">
                        <FontAwesome name="clock-o" size={13} color="#6b7280" />
                        <Text fontSize="$xs" color="$coolGray600">
                          {recipe.time}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Pressable>
              ))
            ) : (
              <Box py="$6" alignItems="center">
                <Text color="$coolGray500">
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
