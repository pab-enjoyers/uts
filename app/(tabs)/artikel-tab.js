import React, { useState, useEffect } from "react";
import { FlatList, Image, ActivityIndicator, ScrollView as RNScrollView } from "react-native";
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
  InputSlot,
  InputIcon,
  SearchIcon,
  Avatar,
  AvatarImage,
  AvatarFallbackText
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { warnaGlobal, CategoryChip } from "../../styles";
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
      console.log('📰 Articles loaded:', result.articles?.length || 0);
      if (result.success && result.articles) {
        setArticles(result.articles);
        // Load author data untuk setiap artikel
        const authors = {};
        for (const article of result.articles) {
          if (article.userId && !authors[article.userId]) {
            console.log('👤 Loading author for userId:', article.userId);
            const userResult = await getUserProfile(article.userId);
            console.log('👤 Author result:', userResult.success, userResult.data?.nama || 'No name');
            if (userResult.success && userResult.data) {
              authors[article.userId] = userResult.data;
            }
          }
        }
        console.log('👤 Authors cache:', Object.keys(authors).length, 'authors loaded');
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

  const renderArticleItem = ({ item }) => {
    const author = authorsCache[item.userId];
    console.log('Rendering article:', item.id, 'Author:', author?.nama || 'No author loaded');
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
          {/* Category Badge dan Author Info - INLINE */}
          <HStack justifyContent="space-between" alignItems="center" mb="$2">
            {/* Category Badge */}
            {item.category && (
              <Badge
                size="sm"
                variant="solid"
                borderRadius="$md"
                bg={warnaGlobal.primaryHex}
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

            {/* Author Info - KECIL DI KANAN */}
            <HStack space="xs" alignItems="center">
              <Avatar size="xs" bg={warnaGlobal.primaryHex}>
                {author?.photoURL ? (
                  <AvatarImage source={{ uri: author.photoURL }} />
                ) : (
                  <AvatarFallbackText>
                    {author?.nama || author?.email || "U"}
                  </AvatarFallbackText>
                )}
              </Avatar>
              <Text fontSize="$xs" color={warnaGlobal.gray600}>
                {author?.nama || author?.email || "..."}
              </Text>
            </HStack>
          </HStack>

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
              <HStack space="xs" alignItems="center">
                <Ionicons
                  name="chatbubble-outline"
                  size={16}
                  color={warnaGlobal.gray500}
                />
                <Text fontSize="$xs" color={warnaGlobal.gray600}>
                  {item.commentsCount || 0}
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
      {/* Search Bar - Sama seperti Dashboard */}
      <Box pt="$10" pb="$2" px="$5" bg="$white">
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
            placeholder="Cari artikel..."
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

      {/* Content */}
      <Container>
        <VStack space="sm" pt="$1" pb="$24">
          {/* Kategori Filter - Sama seperti Dashboard */}
          <RNScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <HStack space="sm">
              {CATEGORIES.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category.name}
                  isActive={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  activeColor={warnaGlobal.primary}
                />
              ))}
            </HStack>
          </RNScrollView>
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

      {/* FAB - Fixed position, tidak terpengaruh scroll */}
      <Pressable
        position="absolute"
        bottom={90}
        right={20}
        w={56}
        h={56}
        borderRadius="$full"
        bg={warnaGlobal.primaryHex}
        alignItems="center"
        justifyContent="center"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={4}
        elevation={8}
        zIndex={100}
        onPress={() => router.push("/artikel/create-artikel")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </Box>
  );
}
