import React, { useState } from "react";
import { ScrollView as RNScrollView, Image, Alert } from "react-native";
import { Container, warnaGlobal, CustomInput, CustomButton } from "../styles";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { searchMealByIngredient, estimateCookingTime } from "../services/mealService";

/**
 * INGREDIENT SEARCH SCREEN
 * Search meals by ingredient name
 */
export default function IngredientSearchScreen() {
  const [ingredient, setIngredient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!ingredient.trim()) {
      Alert.alert("Error", "Masukkan nama bahan makanan");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const result = await searchMealByIngredient(ingredient);

      if (result.success && result.meals) {
        const meals = result.meals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb || "🍽️",
          time: estimateCookingTime(meal),
          category: meal.strCategory || "",
        }));
        setSearchResults(meals);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Ingredient search error:", error);
      Alert.alert("Error", "Gagal mencari resep");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        px="$5"
        pt="$12"
        pb="$4"
        bg="$white"
        borderBottomWidth={1}
        borderBottomColor={warnaGlobal.gray100}
      >
        <HStack alignItems="center" space="md" mb="$4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={warnaGlobal.gray900Hex} />
          </Pressable>
          <VStack flex={1}>
            <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
              Cari Berdasarkan Bahan
            </Heading>
            <Text fontSize="$sm" color={warnaGlobal.gray500}>
              Masukkan bahan makanan yang ingin digunakan
            </Text>
          </VStack>
        </HStack>

        {/* Search Input */}
        <HStack space="md">
          <Box flex={1}>
            <CustomInput
              placeholder="Contoh: chicken, beef, tomato"
              value={ingredient}
              onChangeText={setIngredient}
              leftIcon={<Ionicons name="search" size={20} color={warnaGlobal.gray400Hex} />}
              onSubmitEditing={handleSearch}
            />
          </Box>
          <CustomButton
            title="Cari"
            onPress={handleSearch}
            isLoading={loading}
            size="lg"
          />
        </HStack>
      </Box>

      {/* Results */}
      <Container scrollable bg="$white" padding="$0">
        <RNScrollView showsVerticalScrollIndicator={false}>
          <VStack space="md" p="$5" pb="$24">
            {loading ? (
              <Box py="$10" alignItems="center">
                <Spinner size="large" color={warnaGlobal.primary} />
                <Text mt="$3" color={warnaGlobal.gray500}>
                  Mencari resep...
                </Text>
              </Box>
            ) : !hasSearched ? (
              <Box py="$10" alignItems="center">
                <Ionicons name="search-outline" size={80} color={warnaGlobal.gray300Hex} />
                <Text mt="$3" fontSize="$lg" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Cari Resep Favorit
                </Text>
                <Text mt="$2" color={warnaGlobal.gray500} textAlign="center" px="$8">
                  Masukkan nama bahan makanan untuk menemukan resep yang menggunakan bahan tersebut
                </Text>
              </Box>
            ) : searchResults.length === 0 ? (
              <Box py="$10" alignItems="center">
                <Ionicons name="sad-outline" size={64} color={warnaGlobal.gray300Hex} />
                <Text mt="$3" fontSize="$lg" fontWeight="$medium" color={warnaGlobal.gray700}>
                  Tidak Ditemukan
                </Text>
                <Text mt="$2" color={warnaGlobal.gray500} textAlign="center" px="$8">
                  Tidak ada resep dengan bahan "{ingredient}". Coba bahan lain!
                </Text>
              </Box>
            ) : (
              <>
                <Text fontSize="$md" fontWeight="$semibold" color={warnaGlobal.gray900}>
                  Ditemukan {searchResults.length} resep dengan "{ingredient}"
                </Text>
                <VStack space="md">
                  {searchResults.map((meal) => (
                    <Pressable
                      key={meal.id}
                      onPress={() => {
                        router.push({
                          pathname: "/recipe-detail",
                          params: { mealId: meal.id },
                        });
                      }}
                    >
                      {({ pressed }) => (
                        <Box
                          bg="$white"
                          borderRadius="$xl"
                          borderWidth={1}
                          borderColor={warnaGlobal.gray200}
                          p="$3"
                          opacity={pressed ? 0.8 : 1}
                        >
                          <HStack space="md" alignItems="center">
                            {/* Image */}
                            <Box
                              w={80}
                              h={80}
                              borderRadius="$lg"
                              overflow="hidden"
                              bg={warnaGlobal.gray100}
                            >
                              {typeof meal.image === 'string' && meal.image.startsWith('http') ? (
                                <Image
                                  source={{ uri: meal.image }}
                                  style={{ width: '100%', height: '100%' }}
                                  resizeMode="cover"
                                />
                              ) : (
                                <Box flex={1} justifyContent="center" alignItems="center">
                                  <Text fontSize="$3xl">{meal.image}</Text>
                                </Box>
                              )}
                            </Box>

                            {/* Info */}
                            <VStack flex={1} space="xs">
                              <Text
                                fontSize="$md"
                                fontWeight="$semibold"
                                color={warnaGlobal.gray900}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {meal.name}
                              </Text>
                              <HStack space="md" alignItems="center">
                                {meal.category && (
                                  <HStack space="xs" alignItems="center">
                                    <Ionicons
                                      name="pricetag-outline"
                                      size={14}
                                      color={warnaGlobal.gray500Hex}
                                    />
                                    <Text fontSize="$xs" color={warnaGlobal.gray500}>
                                      {meal.category}
                                    </Text>
                                  </HStack>
                                )}
                                <HStack space="xs" alignItems="center">
                                  <Ionicons
                                    name="time-outline"
                                    size={14}
                                    color={warnaGlobal.gray500Hex}
                                  />
                                  <Text fontSize="$xs" color={warnaGlobal.gray500}>
                                    {meal.time} min
                                  </Text>
                                </HStack>
                              </HStack>
                            </VStack>

                            {/* Arrow */}
                            <Ionicons
                              name="chevron-forward"
                              size={20}
                              color={warnaGlobal.gray400Hex}
                            />
                          </HStack>
                        </Box>
                      )}
                    </Pressable>
                  ))}
                </VStack>
              </>
            )}
          </VStack>
        </RNScrollView>
      </Container>
    </Box>
  );
}
