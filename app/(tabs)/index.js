import React, { useState } from "react";
import { ScrollView as RNScrollView } from "react-native";
import { Container, temaKelompok } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from "expo-router";


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

  // Data dummy - Categories
  const categories = [
    { id: 1, name: "All" },
    { id: 2, name: "Indian" },
    { id: 3, name: "Italian" },
    { id: 4, name: "Asian" },
    { id: 5, name: "Chinese" },
  ];

  // Data dummy - Featured Recipes (Horizontal Slider)
  const featuredRecipes = [
    {
      id: 1,
      name: "Classic Greek Salad",
      image: "🥗",
      rating: 4.5,
      time: "15 Mins",
      bgColor: "$coolGray100",
      category: "Italian",
    },
    {
      id: 2,
      name: "Crunchy Nut Coleslaw",
      image: "🥙",
      rating: 3.5,
      time: "10 Mins",
      bgColor: "$warmGray100",
      category: "Asian",
    },
    {
      id: 3,
      name: "Sushi Roll Special",
      image: "🍣",
      rating: 4.8,
      time: "25 Mins",
      bgColor: "$red50",
      category: "Asian",
    },
    {
      id: 4,
      name: "Spicy Ramen Bowl",
      image: "🍜",
      rating: 4.2,
      time: "20 Mins",
      bgColor: "$orange50",
      category: "Asian",
    },
    {
      id: 5,
      name: "Butter Chicken Curry",
      image: "🍛",
      rating: 4.7,
      time: "30 Mins",
      bgColor: "$yellow50",
      category: "Indian",
    },
    {
      id: 6,
      name: "Kung Pao Chicken",
      image: "🥘",
      rating: 4.3,
      time: "25 Mins",
      bgColor: "$orange100",
      category: "Chinese",
    },
  ];

  // Data dummy - Popular Recipes (Vertical List - 5 items)
  const popularRecipes = [
    {
      id: 1,
      name: "Steak with tomato sauce",
      author: "By James Milner",
      rating: 5,
      time: "20 mins",
      image: "🥩",
      category: "Italian",
    },
    {
      id: 2,
      name: "Pilaf sweet with chicken",
      author: "By Laura Wilson",
      rating: 4,
      time: "30 mins",
      image: "🍚",
      category: "Asian",
    },
    {
      id: 3,
      name: "Grilled Salmon Teriyaki",
      author: "By Mike Chen",
      rating: 5,
      time: "25 mins",
      image: "🐟",
      category: "Asian",
    },
    {
      id: 4,
      name: "Pasta Carbonara Classic",
      author: "By Sofia Romano",
      rating: 4,
      time: "15 mins",
      image: "🍝",
      category: "Italian",
    },
    {
      id: 5,
      name: "Korean BBQ Tacos",
      author: "By David Kim",
      rating: 5,
      time: "35 mins",
      image: "🌮",
      category: "Asian",
    },
    {
      id: 6,
      name: "Tandoori Chicken",
      author: "By Raj Patel",
      rating: 5,
      time: "40 mins",
      image: "🍗",
      category: "Indian",
    },
    {
      id: 7,
      name: "Sweet and Sour Pork",
      author: "By Li Wei",
      rating: 4,
      time: "30 mins",
      image: "🍖",
      category: "Chinese",
    },
  ];

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
      <VStack space="md" pb="$4">
        {/* Header Section */}
        <Box px="$5" pt="$5" pb="$3">
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <VStack>
              <Heading size="xl" fontWeight="$bold">
                Halo Fuad
              </Heading>
              <Text size="sm" color="$coolGray500">
                Mau masak apa hari ini?
              </Text>
            </VStack>
            <Avatar size="md" bg={temaKelompok.syihab.light}>
              {/* iki icon gawe icon profile */}
              <Text fontSize="$xl"><FontAwesome name="user" size={24} color="white" /></Text> 
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
                bg={temaKelompok.syihab.primary}
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
                        ? temaKelompok.syihab.primary
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
                  onPress={() => router.push({
                    pathname: "/angela/detail",
                    params: {
                      id: recipe.id,
                      name: recipe.name,
                      image: recipe.image,
                      rating: recipe.rating,
                      time: recipe.time,
                    }
                  })}
                >
                  <Box
                    w={170}
                    h={220}
                    bg={recipe.bgColor}
                    borderRadius="$2xl"
                    p="$4"
                    position="relative"
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

                    {/* Recipe Info */}
                    <VStack
                      space="xs"
                      position="absolute"
                      bottom="$4"
                      left="$4"
                      right="$4"
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
                color={temaKelompok.syihab.primary}
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
                  onPress={() => router.push({
                    pathname: "/angela/detail",
                    params: {
                      id: recipe.id,
                      name: recipe.name,
                      image: recipe.image,
                      rating: recipe.rating,
                      time: recipe.time,
                    }
                  })}
                >
                  {/* Recipe Card */}
                  <HStack
                    space="md"
                    bg="$coolGray50"
                    borderRadius="$xl"
                    p="$3"
                    alignItems="center"
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
                      <HStack space="2px">
                        {[...Array(5)].map((_, i) => (
                          <Text key={i} fontSize="$xs" color="$amber500">
                            {i < recipe.rating ? "⭐" : "☆"}
                          </Text>
                        ))}
                      </HStack>
                      <Text fontSize="$xs" color="$coolGray500">
                        {recipe.author}
                      </Text>
                      <HStack space="xs" alignItems="center">
                        <Text fontSize="$xs" color="$coolGray600">
                          ⏱️
                        </Text>
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
