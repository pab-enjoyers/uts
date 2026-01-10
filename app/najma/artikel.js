import React, { useState, useEffect } from "react";
import { FlatList, ScrollView, Image, ActivityIndicator } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Pressable,
  Input,
  InputField,
  Badge,
  BadgeText,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { warnaGlobal } from "../../styles/theme";
import { getAllArtikel } from "../../services/artikelService";
import { Container } from "../../styles";

const CATEGORIES = [
  { id: "all", name: "Semua" },
  { id: "umum", name: "Umum" },
  { id: "tips", name: "Tips Memasak" },
  { id: "tutorial", name: "Tutorial" },
  { id: "review", name: "Review Bahan" },
  { id: "cerita", name: "Cerita Kuliner" },
  { id: "lainnya", name: "Lainnya" },
];

export default function ArtikelScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load articles from Firebase
  const loadArticles = async () => {
    try {
      setLoading(true);
      const result = await getAllArtikel();
      if (result.success && result.articles) {
        setArticles(result.articles);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload when screen focused
  useFocusEffect(
    React.useCallback(() => {
      loadArticles();
    }, [])
  );

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || 
      article.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "tips" && article.category?.toLowerCase().includes("tips"));
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
      onPress={() => setSelectedCategory(item.id)}
      bg={
        selectedCategory === item.id
          ? warnaGlobal.primaryHex
          : warnaGlobal.gray100
      }
      px="$4"
      py="$2.5"
      borderRadius="$full"
      mr="$2"
      borderWidth={1}
      borderColor={
        selectedCategory === item.id
          ? warnaGlobal.primaryHex
          : warnaGlobal.gray300
      }
    >
      <Text
        color={
          selectedCategory === item.id
            ? "$white"
            : warnaGlobal.gray700
        }
        fontWeight="$medium"
        fontSize="$sm"
      >
        {item.name}
      </Text>
    </Pressable>
  );

  const renderArticleItem = ({ item }) => (
    <Pressable
      onPress={() => handlePressArticle(item.id)}
      mb="$3"
    >
      <Box
        bg="$white"
        borderRadius="$xl"
        overflow="hidden"
        borderWidth={1}
        borderColor={warnaGlobal.gray200}
      >
        {/* Thumbnail */}
        {item.thumbnail ? (
          <Box h={180} w="$full" bg={warnaGlobal.gray100}>
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </Box>
        ) : (
          <Box 
            h={180} 
            w="$full" 
            bg={warnaGlobal.gray100}
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons 
              name="document-text-outline" 
              size={48} 
              color={warnaGlobal.gray400}
            />
          </Box>
        )}

        {/* Content */}
        <Box p="$4">
          {/* Category Badge */}
          {item.category && (
            <Badge
              size="sm"
              variant="solid"
              borderRadius="$md"
              bg={warnaGlobal.primaryHex}
              mb="$2"
              alignSelf="flex-start"
            >
              <BadgeText
                color="$white"
                fontSize="$xs"
                fontWeight="$medium"
              >
                {item.category}
              </BadgeText>
            </Badge>
          )}

          {/* Title */}
          <Text
            fontSize="$xl"
            fontWeight="$bold"
            color={warnaGlobal.gray900}
            numberOfLines={2}
            mb="$2"
          >
            {item.title}
          </Text>

          {/* Excerpt */}
          {item.content && (
            <Text
              fontSize="$sm"
              color={warnaGlobal.gray600}
              numberOfLines={2}
              mb="$3"
            >
              {item.content}
            </Text>
          )}

          {/* Meta Info */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack space="md" alignItems="center">
              <HStack space="xs" alignItems="center">
                <Ionicons
                  name="eye-outline"
                  size={16}
                  color={warnaGlobal.gray500}
                />
                <Text fontSize="$xs" color={warnaGlobal.gray600}>
                  {item.views || 0}
                </Text>
              </HStack>
              <HStack space="xs" alignItems="center">
                <Ionicons
                  name="heart-outline"
                  size={16}
                  color={warnaGlobal.gray500}
                />
                <Text fontSize="$xs" color={warnaGlobal.gray600}>
                  {item.likes || 0}
                </Text>
              </HStack>
            </HStack>

            <Text fontSize="$xs" color={warnaGlobal.gray500}>
              {item.createdAt?.toDate
                ? new Date(
                    item.createdAt.toDate()
                  ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Baru saja"}
            </Text>
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        bg={warnaGlobal.primaryHex}
        pt="$12"
        pb="$5"
        px="$4"
      >
        <HStack alignItems="center" space="md" mb="$4">
          <Pressable onPress={() => router.back()}>
            <Box
              w={40}
              h={40}
              borderRadius="$full"
              bg="rgba(255,255,255,0.2)"
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="white"
              />
            </Box>
          </Pressable>
          <Heading size="xl" fontWeight="$bold" color="$white" flex={1}>
            Semua Artikel
          </Heading>
        </HStack>

        {/* Search Bar */}
        <Input
          variant="outline"
          size="lg"
          borderRadius="$xl"
          bg="$white"
          borderColor="transparent"
        >
          <Box ml="$3">
            <Ionicons
              name="search"
              size={20}
              color={warnaGlobal.gray400}
            />
          </Box>
          <InputField
            placeholder="Cari artikel..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            pl="$2"
          />
        </Input>
      </Box>

      {/* Content */}
      <Container>
        <VStack space="lg" py="$5">
          {/* Kategori Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space="sm">
              {CATEGORIES.map((category) => (
                <Box key={category.id}>
                  {renderCategoryChip({ item: category })}
                </Box>
              ))}
            </HStack>
          </ScrollView>

          {/* List Artikel */}
          {loading ? (
            <Box alignItems="center" justifyContent="center" py="$10">
              <Spinner size="large" color={warnaGlobal.primaryHex} />
              <Text mt="$4" color={warnaGlobal.gray600}>
                Memuat artikel...
              </Text>
            </Box>
          ) : (
            <FlatList
              data={filteredArticles}
              keyExtractor={(item) => item.id}
              renderItem={renderArticleItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Box py="$10" alignItems="center">
                  <Ionicons
                    name="document-text-outline"
                    size={64}
                    color={warnaGlobal.gray400}
                  />
                  <Text
                    mt="$4"
                    fontSize="$lg"
                    fontWeight="$semibold"
                    color={warnaGlobal.gray700}
                  >
                    Tidak Ada Artikel
                  </Text>
                  <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
                    {searchQuery || selectedCategory !== "all"
                      ? "Tidak ada artikel yang sesuai dengan pencarian"
                      : "Belum ada artikel yang dipublikasikan"}
                  </Text>
                </Box>
              }
            />
          )}
        </VStack>
      </Container>
    </Box>
  );
}
