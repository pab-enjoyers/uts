import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Pressable,
  ScrollView,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { articles } from "../../data/artikel";
import { warnaGlobal } from "../../styles/theme";

export default function ArtikelDetailScreen() {
  const { id } = useLocalSearchParams();
  const article = articles.find((a) => a.id.toString() === id);
  const [isLiked, setIsLiked] = useState(false);

  if (!article) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white">
        <Text color={warnaGlobal.gray500}>Artikel tidak ditemukan.</Text>
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
        <VStack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
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
                size={20}
                color={warnaGlobal.gray700Hex}
              />
            </Box>
          </Pressable>
          <Pressable onPress={() => setIsLiked(!isLiked)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? warnaGlobal.primaryHex : warnaGlobal.gray500Hex}
            />
          </Pressable>
        </VStack>
      </Box>

      {/* Content */}
      <ScrollView flex={1} pt="$24" px="$5" pb="$24">
        <VStack space="lg">
          <Box alignItems="center">
            <Text fontSize={64}>{article.image}</Text>
          </Box>

          <VStack space="sm" alignItems="center">
            <Heading size="xl" fontWeight="$bold" textAlign="center">
              {article.title}
            </Heading>
            <Text color={warnaGlobal.gray600} textAlign="center" fontSize="$md">
              {article.description}
            </Text>
          </VStack>

          <VStack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <VStack>
              <Text fontSize="$sm" fontWeight="$semibold">
                {article.author}
              </Text>
              <Text fontSize="$xs" color={warnaGlobal.gray500}>
                {article.date}
              </Text>
            </VStack>
            <Text fontSize="$xs" color={warnaGlobal.gray500}>
              {article.readTime}
            </Text>
          </VStack>

          <Box>
            <Text fontSize="$md" color={warnaGlobal.gray700} lineHeight="$lg">
              {article.content}
            </Text>
          </Box>

          <Box mt="$4" alignItems="center">
            <Text fontSize="$sm" color={warnaGlobal.gray500}>
              Terima kasih telah membaca! Bagikan artikel ini jika bermanfaat.
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
