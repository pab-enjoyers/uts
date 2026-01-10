import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Pressable,
  ScrollView,
  Badge,
  BadgeText,
  Spinner,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { warnaGlobal } from "../../styles/theme";
import { getArtikelById, incrementViews, toggleLikeArtikel } from "../../services/artikelService";
import { getUserProfile } from "../../services/userService";
import { Image, ActivityIndicator } from "react-native";

export default function ArtikelDetailScreen() {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);

  // Load article from Firebase
  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const result = await getArtikelById(id);
      if (result.success && result.artikel) {
        setArticle(result.artikel);
        setLikesCount(result.artikel.likes || 0);
        // Load author data
        if (result.artikel.userId) {
          const userResult = await getUserProfile(result.artikel.userId);
          if (userResult.success) {
            setAuthor(userResult.user);
          }
        }
        // Increment views
        await incrementViews(id);
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (likingInProgress) return;
    
    try {
      setLikingInProgress(true);
      const result = await toggleLikeArtikel(id, isLiked);
      if (result.success) {
        setIsLiked(!isLiked);
        setLikesCount(result.likes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white">
        <Spinner size="large" color={warnaGlobal.primaryHex} />
        <Text mt="$4" color={warnaGlobal.gray600}>
          Memuat artikel...
        </Text>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white" px="$5">
        <Ionicons
          name="document-text-outline"
          size={64}
          color={warnaGlobal.gray400}
        />
        <Text mt="$4" fontSize="$lg" fontWeight="$semibold" color={warnaGlobal.gray700}>
          Artikel Tidak Ditemukan
        </Text>
        <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
          Artikel yang Anda cari tidak tersedia
        </Text>
        <Pressable
          onPress={() => router.back()}
          mt="$6"
          bg={warnaGlobal.primaryHex}
          px="$6"
          py="$3"
          borderRadius="$xl"
        >
          <Text color="$white" fontWeight="$semibold">
            Kembali
          </Text>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        pt="$12"
        pb="$4"
        bg="$white"
        px="$5"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        <HStack
          alignItems="center"
          justifyContent="flex-start"
        >
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
                size={24}
                color={warnaGlobal.gray700Hex}
              />
            </Box>
          </Pressable>
        </HStack>
      </Box>

      {/* Content */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack space="lg" pb="$10">
          {/* Thumbnail */}
          {article.thumbnail && (
            <Box
              w="$full"
              h={240}
              bg={warnaGlobal.gray100}
              mt="$20"
            >
              <Image
                source={{ uri: article.thumbnail }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </Box>
          )}

          <VStack space="md" px="$5" mt={article.thumbnail ? "$4" : "$24"}>
            {/* Author Info - HARUS ADA DI SINI */}
            {author && (
              <HStack space="md" alignItems="center" mb="$2">
                <Avatar size="md" bg={warnaGlobal.primaryHex}>
                  {author.photoURL ? (
                    <AvatarImage source={{ uri: author.photoURL }} />
                  ) : (
                    <AvatarFallbackText>
                      {author.nama || author.email || "U"}
                    </AvatarFallbackText>
                  )}
                </Avatar>
                <VStack>
                  <Text fontSize="$md" fontWeight="$semibold" color={warnaGlobal.gray900}>
                    {author.nama || author.email || "Anonymous"}
                  </Text>
                  {author.status && (
                    <Text fontSize="$xs" color={warnaGlobal.gray500}>
                      {author.status}
                    </Text>
                  )}
                </VStack>
              </HStack>
            )}

            {/* Category Badge */}
            {article.category && (
              <Badge
                size="sm"
                variant="solid"
                borderRadius="$md"
                bg={warnaGlobal.primaryHex}
                alignSelf="flex-start"
              >
                <BadgeText
                  color="$white"
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {article.category}
                </BadgeText>
              </Badge>
            )}

            {/* Title */}
            <Heading size="2xl" fontWeight="$bold" color={warnaGlobal.gray900} lineHeight={36}>
              {article.title}
            </Heading>

            {/* Meta Info with CLICKABLE LIKE */}
            <HStack space="lg" alignItems="center">
              <HStack space="xs" alignItems="center">
                <Ionicons
                  name="eye-outline"
                  size={18}
                  color={warnaGlobal.gray500}
                />
                <Text fontSize="$sm" color={warnaGlobal.gray600}>
                  {article.views || 0}
                </Text>
              </HStack>
              
              {/* LIKE BUTTON - CLICKABLE */}
              <Pressable 
                onPress={handleLikeToggle}
                disabled={likingInProgress}
              >
                <HStack space="xs" alignItems="center">
                  {likingInProgress ? (
                    <ActivityIndicator size="small" color={warnaGlobal.primaryHex} />
                  ) : (
                    <>
                      <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? warnaGlobal.primaryHex : warnaGlobal.gray500}
                      />
                      <Text fontSize="$sm" color={warnaGlobal.gray600} fontWeight="$medium">
                        {likesCount}
                      </Text>
                    </>
                  )}
                </HStack>
              </Pressable>

              <Text fontSize="$sm" color={warnaGlobal.gray500}>
                {article.createdAt?.toDate
                  ? new Date(article.createdAt.toDate()).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : ""}
              </Text>
            </HStack>
          </VStack>

          {/* Content */}
          <Box px="$5" mt="$4">
            <Text
              fontSize="$md"
              color={warnaGlobal.gray700}
              lineHeight={24}
              textAlign="justify"
            >
              {article.content}
            </Text>
          </Box>

          {/* Footer */}
          <Box
            mt="$6"
            pt="$6"
            mx="$5"
            borderTopWidth={1}
            borderTopColor={warnaGlobal.gray200}
          >
            <Text fontSize="$sm" color={warnaGlobal.gray500} textAlign="center">
              Terima kasih telah membaca! 
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
