import React, { useState } from "react";
import { FlatList, ScrollView } from "react-native";
import {
  Box,
  VStack,
  Heading,
  Text,
  Pressable,
  Input,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { articles, articleCategories } from "../../data/artikel";
import { warnaGlobal } from "../../styles/theme";

export default function ArtikelScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePressArticle = (articleId) => {
    router.push({
      pathname: "/najma/artikelDetail",
      params: { id: articleId },
    });
  };

  const renderCategoryChip = ({ item }) => (
    <Pressable
      onPress={() => setSelectedCategory(item.name)}
      bg={
        selectedCategory === item.name
          ? warnaGlobal.primary
          : warnaGlobal.gray100
      }
      px="$4"
      py="$2"
      borderRadius="$lg"
      mr="$2"
    >
      <Text
        color={
          selectedCategory === item.name
            ? warnaGlobal.white
            : warnaGlobal.gray600
        }
      >
        {item.name}
      </Text>
    </Pressable>
  );

  const renderArticleItem = ({ item }) => (
    <Pressable
      onPress={() => handlePressArticle(item.id)}
      bg={warnaGlobal.gray50}
      p="$4"
      mb="$3"
      borderRadius="$lg"
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={2}
    >
      <VStack space="sm">
        <Text fontSize={32} textAlign="center">
          {item.image}
        </Text>
        <Heading size="md" fontWeight="$bold">
          {item.title}
        </Heading>
        <Text color={warnaGlobal.gray600} numberOfLines={2}>
          {item.description}
        </Text>
        <VStack flexDirection="row" justifyContent="space-between">
          <Text fontSize="$xs" color={warnaGlobal.gray500}>
            {item.author}
          </Text>
          <Text fontSize="$xs" color={warnaGlobal.gray500}>
            {item.readTime}
          </Text>
        </VStack>
      </VStack>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$white" p="$5" pb="$24">
      <VStack space="lg">
        <VStack flexDirection="row" alignItems="center" space="md">
          <Pressable onPress={() => router.back()}>
            <Box
              w={40}
              h={40}
              borderRadius="$full"
              bg={warnaGlobal.gray100}
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={warnaGlobal.gray700Hex}
              />
            </Box>
          </Pressable>
          <Heading size="xl" fontWeight="$bold" flex={1}>
            Semua Artikel
          </Heading>
        </VStack>

        {/* Search Bar */}
        <Input
          variant="outline"
          size="lg"
          borderRadius="$xl"
          bg={warnaGlobal.gray50}
          placeholder="Cari artikel..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          InputLeftElement={
            <Ionicons
              name="search"
              size={20}
              color={warnaGlobal.gray400Hex}
              style={{ marginLeft: 10 }}
            />
          }
        />

        {/* Kategori Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <VStack flexDirection="row" space="sm">
            {articleCategories.map((category) => (
              <Box key={category.id}>
                {renderCategoryChip({ item: category })}
              </Box>
            ))}
          </VStack>
        </ScrollView>

        {/* List Artikel */}
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderArticleItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Box py="$10" alignItems="center">
              <Text color={warnaGlobal.gray500}>
                Tidak ada artikel ditemukan.
              </Text>
            </Box>
          }
        />
      </VStack>
    </Box>
  );
}
