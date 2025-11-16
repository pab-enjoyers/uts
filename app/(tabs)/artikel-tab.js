import React, { useState } from "react";
import { FlatList } from "react-native";
import { Box, VStack, Heading, Text, Pressable } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { articles } from "../../data/artikel";
import { warnaGlobal } from "../../styles/theme";

export default function ArtikelTab() {
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handlePressArticle = (articleId) => {
    router.push({
      pathname: "/najma/artikelDetail",
      params: { id: articleId },
    });
  };

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
        <Heading size="2xl" color={warnaGlobal.primary} textAlign="center">
          Artikel Kuliner
        </Heading>
        <Text color={warnaGlobal.gray500} textAlign="center">
          Temukan tips, resep, dan edukasi kuliner terbaru!
        </Text>
        <Pressable
          onPress={() => router.push("/najma/artikel")}
          bg={warnaGlobal.primary}
          p="$3"
          borderRadius="$lg"
          alignItems="center"
        >
          <Text color={warnaGlobal.white} fontWeight="$semibold">
            Lihat Semua Artikel
          </Text>
        </Pressable>
        <FlatList
          data={filteredArticles.slice(0, 3)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderArticleItem}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </Box>
  );
}
