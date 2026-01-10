import React, { useState, useEffect } from "react";
import { FlatList, Image, ActivityIndicator, ScrollView } from "react-native";
import { 
  Box, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Pressable,
  Badge,
  BadgeText,
  Spinner,
  Input,
  InputField,
  Avatar,
  AvatarImage,
  AvatarFallbackText
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { warnaGlobal } from "../../styles/theme";
import { getAllArtikel } from "../../services/artikelService";
import { getUserProfile } from "../../services/userService";
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

export default function ArtikelTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [authorsCache, setAuthorsCache] = useState({});

  // Load articles from Firebase
  const loadArticles = async () => {
    try {
      setLoading(true);
      const result = await getAllArtikel();
      if (result.success && result.articles) {
        setArticles(result.articles);
        // Load author data untuk setiap artikel
        const authors = {};
        for (const article of result.articles) {
          if (article.userId && !authors[article.userId]) {
            const userResult = await getUserProfile(article.userId);
            if (userResult.success) {
              authors[article.userId] = userResult.user;
            }
          }
        }
        setAuthorsCache(authors);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Reload when tab focused
  useFocusEffect(
    React.useCallback(() => {
      loadArticles();
    }, [])
  );

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

  const renderArticleItem = ({ item }) => {
    const author = authorsCache[item.userId];
    return (
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
          <Box h={160} w="$full" bg={warnaGlobal.gray100}>
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
            h={160} 
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
          {/* Author Info */}
          {author && (
            <HStack space="sm" alignItems="center" mb="$3">
              <Avatar size="sm" bg={warnaGlobal.primaryHex}>
                {author.photoURL ? (
                  <AvatarImage source={{ uri: author.photoURL }} />
                ) : (
                  <AvatarFallbackText>
                    {author.nama || author.email || "U"}
                  </AvatarFallbackText>
                )}
              </Avatar>
              <Text fontSize="$sm" fontWeight="$medium" color={warnaGlobal.gray700}>
                {author.nama || author.email || "Anonymous"}
              </Text>
            </HStack>
          )}

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
            fontSize="$lg"
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
  };

  return (
    <Box flex={1} bg="$white">
      {/* Search Bar */}
      <Box pt="$12" pb="$3" px="$5" bg="$white">
        <Input
          variant="outline"
          size="lg"
          borderRadius="$xl"
          bg={warnaGlobal.gray50}
          borderColor={warnaGlobal.gray300}
        >
          <Box ml="$3">
            <Ionicons
              name="search"
              size={20}
              color={warnaGlobal.gray500}
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
        <VStack space="md" pt="$2" pb="$24">
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
          {/* Articles List - Tampilkan Semua */}
          {loading ? (
            <Box alignItems="center" justifyContent="center" py="$10">
              <Spinner size="large" color={warnaGlobal.primaryHex} />
              <Text mt="$4" color={warnaGlobal.gray600}>
                Memuat artikel...
              </Text>
            </Box>
          ) : articles.length === 0 ? (
            <Box alignItems="center" justifyContent="center" py="$10">
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
                Belum Ada Artikel
              </Text>
              <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
                Artikel akan muncul di sini
              </Text>
            </Box>
          ) : (
            <FlatList
              data={filteredArticles}
              keyExtractor={(item) => item.id}
              renderItem={renderArticleItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Box alignItems="center" justifyContent="center" py="$10">
                  <Ionicons
                    name="search-outline"
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
                    Coba kata kunci atau kategori lain
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
