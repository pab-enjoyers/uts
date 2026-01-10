// ========================================
// 📋 RECIPE DETAIL SCREEN
// Full recipe details dari TheMealDB API
// UI ASLI ANGELA - HANYA DATA DIGANTI API
// ========================================

import React, { useState, useEffect } from "react";
import { Alert, Linking, Share } from "react-native";
import { Container, warnaGlobal, IconButton, ShareModal } from "../styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";

// API Services
import {
  getMealById,
  parseIngredients,
  hasVideo,
} from "../services/mealService";
import {
  addBookmark,
  removeBookmark,
  isBookmarked as checkIsBookmarked,
} from "../services/userService";

import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";

export default function RecipeDetailScreen() {
  const { mealId } = useLocalSearchParams();
  const { user } = useAuth();

  // State - GUNAKAN STRUKTUR ANGELA
  const [meal, setMeal] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [activeTab, setActiveTab] = useState("bahan");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Load meal details
  useEffect(() => {
    loadMealDetails();
  }, [mealId]);

  // Check bookmark status
  useEffect(() => {
    if (user && mealId) {
      checkBookmarkStatus();
    }
  }, [user, mealId]);

  const loadMealDetails = async () => {
    try {
      setLoading(true);
      const result = await getMealById(mealId);

      if (result.success && result.meal) {
        const mealData = result.meal;
        setMeal(mealData);

        // Parse ingredients
        const parsedIngredients = parseIngredients(mealData);
        setIngredients(parsedIngredients);

        // Parse instructions
        if (mealData.strInstructions) {
          const steps = mealData.strInstructions
            .split(/\r\n|\n/)
            .map((step) => step.trim())
            .filter((step) => step.length > 10);
          setInstructions(steps);
        }
      } else {
        Alert.alert("Error", "Resep tidak ditemukan");
        router.back();
      }
    } catch (error) {
      console.error("Error loading meal:", error);
      Alert.alert("Error", "Gagal memuat detail resep");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const result = await checkIsBookmarked(user.uid, mealId);
      if (result.success) {
        setIsSaved(result.isBookmarked); // Gunakan isSaved, bukan isBookmarked
      }
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      Alert.alert("Login Required", "Silakan login untuk menyimpan bookmark");
      return;
    }

    if (!meal) return;

    try {
      setBookmarkLoading(true);

      if (isSaved) {
        const result = await removeBookmark(user.uid, mealId);
        if (result.success) {
          setIsSaved(false);
          Alert.alert("Success", "Bookmark dihapus");
        }
      } else {
        const result = await addBookmark(user.uid, {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory,
          strArea: meal.strArea,
        });
        if (result.success) {
          setIsSaved(true);
          Alert.alert("Success", "Ditambahkan ke bookmark");
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      Alert.alert("Error", "Gagal menyimpan bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleWatchVideo = () => {
    if (meal && hasVideo(meal)) {
      Linking.openURL(meal.strYoutube);
    } else {
      Alert.alert("Info", "Video tidak tersedia untuk resep ini");
    }
  };

  const handleShare = async () => {
    try {
      if (meal) {
        await Share.share({
          message: `Check out this recipe: ${meal.strMeal}\n\nCategory: ${meal.strCategory}\nArea: ${meal.strArea}`,
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // UI ASLI ANGELA - HANYA DATA API
  const recipe = meal
    ? {
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb, // URL gambar dari API
        rating: "4.5",
        time: "35 menit",
        category: meal.strCategory,
        area: meal.strArea,
      }
    : null;

  if (loading) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color={warnaGlobal.primary} />
          <Text mt="$3" color={warnaGlobal.gray500}>
            Memuat detail resep...
          </Text>
        </VStack>
      </Container>
    );
  }

  if (!meal) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center" p="$5">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={warnaGlobal.gray400}
          />
          <Text mt="$3" color={warnaGlobal.gray600}>
            Resep tidak ditemukan
          </Text>
          <Pressable onPress={() => router.back()} mt="$4">
            <Box bg={warnaGlobal.primary} px="$6" py="$3" borderRadius="$xl">
              <Text color="$white" fontWeight="$semibold">
                Kembali
              </Text>
            </Box>
          </Pressable>
        </VStack>
      </Container>
    );
  }

  // ========================================
  // UI ASLI ANGELA - TIDAK DIUBAH!
  // HANYA DATA DIGANTI DENGAN API
  // ========================================
  return (
    <Box flex={1} position="relative">
      <Container
        scrollable
        bg="$white"
        padding="$0"
        onScroll={() => setShowMenu(false)}
      >
        <Pressable flex={1} onPress={() => setShowMenu(false)}>
          <VStack space="md" mt="$12">
            {/* Header dengan gambar resep - GUNAKAN URL API */}
            <Box position="relative">
              <Box
                bg={warnaGlobal.gray100}
                h={250}
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                {/* Gambar dari API */}
                <Box
                  w="100%"
                  h="100%"
                  bg={warnaGlobal.gray200}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={100}>🍽️</Text>
                  <Text
                    position="absolute"
                    fontSize="$xs"
                    color={warnaGlobal.gray500}
                  >
                    Image: {recipe.image?.substring(0, 50)}...
                  </Text>
                </Box>

                {/* Back button overlay */}
                <IconButton
                  icon={
                    <Ionicons
                      name="arrow-back-outline"
                      size={20}
                      color="gray"
                    />
                  }
                  onPress={() => router.back()}
                  position={{ top: "$4", left: "$4" }}
                />

                {/* More options button */}
                <IconButton
                  icon={
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color="gray"
                    />
                  }
                  onPress={() => setShowMenu(!showMenu)}
                  position={{ top: "$4", right: "$4" }}
                />

                {/* Dropdown Menu */}
                {showMenu && (
                  <Box
                    position="absolute"
                    top={60}
                    right={16}
                    bg={warnaGlobal.white}
                    borderRadius="$xl"
                    py="$3"
                    px="$2"
                    minWidth={160}
                    shadowColor="$black"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={12}
                    elevation={999}
                    zIndex={9999}
                  >
                    <VStack space="xs">
                      <Pressable
                        onPress={() => {
                          setShowShareModal(true);
                          setShowMenu(false);
                        }}
                        py="$2"
                        px="$3"
                        borderRadius="$md"
                      >
                        <HStack space="sm" alignItems="center">
                          <Ionicons
                            name="share-outline"
                            size={22}
                            color="#000000"
                          />
                          <Text
                            fontSize="$sm"
                            color="$black"
                            fontWeight="$normal"
                          >
                            share
                          </Text>
                        </HStack>
                      </Pressable>

                      {hasVideo(meal) && (
                        <Pressable
                          onPress={() => {
                            handleWatchVideo();
                            setShowMenu(false);
                          }}
                          py="$2"
                          px="$3"
                          borderRadius="$md"
                        >
                          <HStack space="sm" alignItems="center">
                            <Ionicons
                              name="play-circle-outline"
                              size={22}
                              color="#000000"
                            />
                            <Text
                              fontSize="$sm"
                              color="$black"
                              fontWeight="$normal"
                            >
                              Tonton Video
                            </Text>
                          </HStack>
                        </Pressable>
                      )}

                      <Pressable
                        onPress={() => {
                          toggleBookmark();
                          setShowMenu(false);
                        }}
                        py="$2"
                        px="$3"
                        borderRadius="$md"
                        isDisabled={bookmarkLoading}
                      >
                        <HStack space="sm" alignItems="center">
                          {bookmarkLoading ? (
                            <Spinner size="small" />
                          ) : (
                            <Ionicons
                              name={isSaved ? "bookmark" : "bookmark-outline"}
                              size={22}
                              color="#000000"
                            />
                          )}
                          <Text
                            fontSize="$sm"
                            color="$black"
                            fontWeight="$normal"
                          >
                            {isSaved ? "Tersimpan" : "Simpan"}
                          </Text>
                        </HStack>
                      </Pressable>
                    </VStack>
                  </Box>
                )}

                {/* Time badge - GUNAKAN DATA API */}
                <Box
                  position="absolute"
                  bottom="$4"
                  right="$4"
                  bg={warnaGlobal.light}
                  borderRadius="$full"
                  px="$3"
                  py="$2"
                >
                  <HStack space="xs" alignItems="center">
                    <Text color={warnaGlobal.primary} fontSize="$xs">
                      <Ionicons name="timer-outline" size={15} color="red" />
                    </Text>
                    <Text
                      color={warnaGlobal.primary}
                      fontSize="$xs"
                      fontWeight="$semibold"
                    >
                      {recipe.time}
                    </Text>
                  </HStack>
                </Box>
              </Box>
            </Box>

            {/* Recipe info section */}
            <VStack space="md" px="$5">
              {/* Title and rating - DATA API */}
              <HStack alignItems="center" justifyContent="space-between">
                <Heading size="lg" fontWeight="$bold">
                  {recipe.name}
                </Heading>
                <Text fontSize="$sm" color="$coolGray500">
                  ⭐ {recipe.rating}
                </Text>
              </HStack>

              {/* Author info - DATA API */}
              <HStack space="sm" alignItems="center">
                <Box
                  bg={warnaGlobal.light}
                  w={40}
                  h={40}
                  borderRadius="$full"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$lg">👤</Text>
                </Box>
                <VStack flex={1}>
                  <Text fontSize="$sm" fontWeight="$semibold">
                    {recipe.area} Cuisine
                  </Text>
                  <HStack space="xs" alignItems="center">
                    <Ionicons name="location" color="#dc2626" size={12} />
                    <Text fontSize="$xs" color="$coolGray500">
                      {recipe.area}, {recipe.category}
                    </Text>
                  </HStack>
                </VStack>
                <Pressable
                  onPress={() => setIsFollowing(!isFollowing)}
                  bg={isFollowing ? warnaGlobal.gray200 : warnaGlobal.primary}
                  px="$5"
                  py="$2"
                  borderRadius="$lg"
                >
                  <Text
                    color={
                      isFollowing ? warnaGlobal.gray700 : warnaGlobal.white
                    }
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    {isFollowing ? "Diikuti" : "Ikuti"}
                  </Text>
                </Pressable>
              </HStack>

              {/* Tab Switcher - UI LAMA ANGELA */}
              <HStack space="md" mt="$2">
                <Pressable
                  flex={1}
                  onPress={() => setActiveTab("bahan")}
                  bg={
                    activeTab === "bahan"
                      ? warnaGlobal.primary
                      : warnaGlobal.gray100
                  }
                  py="$3"
                  borderRadius="$lg"
                  alignItems="center"
                >
                  <Text
                    color={
                      activeTab === "bahan"
                        ? warnaGlobal.white
                        : warnaGlobal.gray600
                    }
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    Bahan
                  </Text>
                </Pressable>
                <Pressable
                  flex={1}
                  onPress={() => setActiveTab("prosedur")}
                  bg={
                    activeTab === "prosedur"
                      ? warnaGlobal.primary
                      : warnaGlobal.gray100
                  }
                  py="$3"
                  borderRadius="$lg"
                  alignItems="center"
                >
                  <Text
                    color={
                      activeTab === "prosedur"
                        ? warnaGlobal.white
                        : warnaGlobal.gray600
                    }
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    Prosedur
                  </Text>
                </Pressable>
              </HStack>

              {/* Content based on active tab - DATA API */}
              {activeTab === "bahan" ? (
                // Bahan List View - DATA DARI API
                <VStack space="sm" mt="$4" pb="$6">
                  {ingredients.map((item, index) => (
                    <HStack
                      key={index}
                      space="md"
                      bg={warnaGlobal.gray50}
                      p="$4"
                      borderRadius="$xl"
                      alignItems="center"
                    >
                      <Box
                        bg={warnaGlobal.white}
                        w={50}
                        h={50}
                        borderRadius="$lg"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize={28}>🥘</Text>
                      </Box>
                      <VStack flex={1}>
                        <Text fontSize="$sm" fontWeight="$semibold">
                          {item.ingredient}
                        </Text>
                      </VStack>
                      <Text fontSize="$sm" color={warnaGlobal.gray500}>
                        {item.measure}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                // Prosedur Steps View - DATA DARI API
                <VStack space="md" mt="$4" pb="$6">
                  {instructions.map((step, index) => (
                    <VStack key={index} space="sm">
                      <HStack space="sm" alignItems="flex-start">
                        <Box
                          bg={warnaGlobal.primary}
                          w={28}
                          h={28}
                          borderRadius="$full"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text
                            color={warnaGlobal.white}
                            fontSize="$sm"
                            fontWeight="$bold"
                          >
                            {index + 1}
                          </Text>
                        </Box>
                        <Text
                          flex={1}
                          fontSize="$sm"
                          color={warnaGlobal.gray700}
                          lineHeight="$lg"
                        >
                          {step}
                        </Text>
                      </HStack>
                      {index < instructions.length - 1 && (
                        <Box ml="$3" h={1} bg={warnaGlobal.gray200} />
                      )}
                    </VStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </VStack>
        </Pressable>
      </Container>

      {/* Share Modal */}
      <ShareModal
        isVisible={showShareModal}
        onClose={() => setShowShareModal(false)}
        recipeName={recipe.name}
        recipeLink={`app.resep.co.id/${recipe.id}`}
      />
    </Box>
  );
}
