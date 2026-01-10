// ========================================
// 📋 RECIPE DETAIL SCREEN
// Full recipe details dari TheMealDB API
// UI ASLI ANGELA - HANYA DATA DIGANTI API
// ========================================

import React, { useState, useEffect } from "react";
import { Alert, Linking, Share, Image } from "react-native";
import { Container, warnaGlobal, IconButton, ShareModal } from "../styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";

// API Services
import {
  getMealById,
  parseIngredients,
  hasVideo,
  estimateCookingTime,
} from "../services/mealService";
import {
  addBookmark,
  removeBookmark,
  isBookmarked as checkIsBookmarked,
  getAverageRating,
  getUserRating,
  addRating,
  addNotification,
} from "../services/userService";

import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
  Image as GluestackImage,
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
  const [averageRating, setAverageRating] = useState(4.0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);

  // Load meal details
  useEffect(() => {
    loadMealDetails();
  }, [mealId]);

  // Check bookmark status & load rating
  useEffect(() => {
    if (user && mealId) {
      checkBookmarkStatus();
      loadRatings();
    } else if (mealId) {
      // Load average rating even if not logged in
      loadAverageRating();
    }
  }, [user, mealId]);

  // Reload ratings when screen gains focus (e.g., returning from reviews page)
  useFocusEffect(
    React.useCallback(() => {
      if (mealId) {
        loadAverageRating();
        if (user) {
          loadRatings();
        }
      }
    }, [mealId, user])
  );

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
      // Silent fail - jangan alert jika offline
      console.log("Bookmark check skipped (offline or error):", error.message);
      // Default ke false jika offline
      setIsSaved(false);
    }
  };

  const loadAverageRating = async () => {
    try {
      const result = await getAverageRating(mealId);
      if (result.success) {
        setAverageRating(result.rating || 4.0);
        setRatingCount(result.count || 0);
      }
    } catch (error) {
      console.log("Error loading rating:", error);
    }
  };

  const loadRatings = async () => {
    try {
      // Load average rating
      const avgResult = await getAverageRating(mealId);
      if (avgResult.success) {
        setAverageRating(avgResult.rating || 4.0);
        setRatingCount(avgResult.count || 0);
      }

      // Load user's rating
      const userRatingResult = await getUserRating(user.uid, mealId);
      if (userRatingResult.success) {
        setUserRating(userRatingResult.rating || 0);
      }
    } catch (error) {
      console.log("Error loading ratings:", error);
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      Alert.alert("Login Required", "Silakan login untuk memberikan rating");
      return;
    }

    try {
      const result = await addRating(user.uid, mealId, rating);
      if (result.success) {
        setUserRating(rating);
        // Reload average rating
        loadAverageRating();
        
        // Add notification
        console.log("📢 Sending RATING notification...");
        const notifResult = await addNotification(user.uid, {
          title: "Rating Tersimpan",
          message: `Anda memberikan rating ${rating}⭐ untuk ${meal?.strMeal || 'resep ini'}`,
          type: "rating",
          mealId: mealId,
        });
        console.log("📢 Notification result:", notifResult);
        
        Alert.alert("Success", "Rating berhasil disimpan");
      } else {
        Alert.alert("Error", result.message || "Gagal menyimpan rating");
      }
    } catch (error) {
      console.error("Error adding rating:", error);
      Alert.alert("Error", "Gagal menyimpan rating");
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      Alert.alert("Login Required", "Silakan login untuk menyimpan bookmark");
      return;
    }

    console.log('📌 toggleBookmark called, user:', user.uid);
    console.log('📌 isSaved:', isSaved);
    console.log('📌 meal:', meal?.strMeal);

    try {
      setBookmarkLoading(true);
      
      if (isSaved) {
        // Remove bookmark
        console.log('🗑️ Removing bookmark...');
        const result = await removeBookmark(user.uid, mealId);
        console.log('🗑️ Remove result:', result);
        
        if (result.success) {
          setIsSaved(false);
          
          // Add notification - PASTI DIPANGGIL
          console.log("📢 STARTING REMOVE bookmark notification...");
          console.log("📢 User ID:", user.uid);
          console.log("📢 Meal name:", meal.strMeal);
          console.log("📢 Meal ID:", mealId);
          
          try {
            const notifResult = await addNotification(user.uid, {
              title: "Bookmark Dihapus",
              message: `${meal.strMeal} dihapus dari bookmark`,
              type: "bookmark",
              mealId: mealId,
            });
            console.log("📢 ✅ REMOVE Notification result:", notifResult);
            
            if (!notifResult.success) {
              console.error("📢 ❌ REMOVE Notification GAGAL:", notifResult.message);
            }
          } catch (notifError) {
            console.error("📢 ❌ REMOVE Notification ERROR:", notifError);
          }
          
          Alert.alert("Success", "Bookmark dihapus");
        }
      } else {
        // Add bookmark
        console.log('➕ Adding bookmark...');
        const result = await addBookmark(user.uid, {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory,
          strArea: meal.strArea,
        });
        console.log('➕ Add result:', result);
        
        if (result.success) {
          setIsSaved(true);
          
          // Add notification - PASTI DIPANGGIL
          console.log("📢 STARTING ADD bookmark notification...");
          console.log("📢 User ID:", user.uid);
          console.log("📢 Meal name:", meal.strMeal);
          console.log("📢 Meal ID:", mealId);
          
          try {
            const notifResult = await addNotification(user.uid, {
              title: "Bookmark Tersimpan",
              message: `${meal.strMeal} ditambahkan ke bookmark`,
              type: "bookmark",
              mealId: mealId,
            });
            console.log("📢 ✅ ADD Notification result:", notifResult);
            
            if (!notifResult.success) {
              console.error("📢 ❌ ADD Notification GAGAL:", notifResult.message);
            }
          } catch (notifError) {
            console.error("📢 ❌ ADD Notification ERROR:", notifError);
          }
          
          Alert.alert("Success", "Ditambahkan ke bookmark");
        } else {
          console.error('❌ Bookmark failed:', result.error);
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
        time: estimateCookingTime(meal), // Estimasi dari ingredients + instructions
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
              {/* Gambar dari API */}
              <Image
                source={{ uri: recipe.image }}
                style={{
                  width: '100%',
                  height: 250,
                  resizeMode: 'cover',
                  backgroundColor: '#f3f4f6'
                }}
              />

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

                    {/* Review & Rating Menu - STAR ICON */}
                    <Pressable
                      onPress={() => {
                        setShowMenu(false);
                        router.push({
                          pathname: "/syihab/reviews",
                          params: { 
                            mealId: meal.idMeal,
                            mealName: meal.strMeal,
                            mealThumb: meal.strMealThumb
                          },
                        });
                      }}
                      py="$2"
                      px="$3"
                      borderRadius="$md"
                    >
                      <HStack space="sm" alignItems="center">
                        <Ionicons
                          name="star-outline"
                          size={22}
                          color="#000000"
                        />
                        <Text
                          fontSize="$sm"
                          color="$black"
                          fontWeight="$normal"
                        >
                          Review
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

            {/* Recipe info section */}
            <VStack space="md" px="$5">
              {/* Title and rating - DATA API */}
              <HStack alignItems="center" justifyContent="space-between">
                <Heading size="lg" fontWeight="$bold" flex={1}>
                  {recipe.name}
                </Heading>
                <VStack alignItems="flex-end" space="xs">
                  <HStack space="xs" alignItems="center">
                    <Text fontSize="$sm" color={warnaGlobal.primary} fontWeight="$bold">
                      ⭐ {averageRating}
                    </Text>
                    <Text fontSize="$xs" color="$coolGray500">
                      ({ratingCount})
                    </Text>
                  </HStack>
                  {userRating > 0 && (
                    <Text fontSize="$xs" color="$coolGray400">
                      Rating Anda: {userRating}⭐
                    </Text>
                  )}
                </VStack>
              </HStack>

              {/* Rating buttons */}
              {/* {user && (
                <Box>
                  <Text fontSize="$xs" color={warnaGlobal.gray600} mb="$2">
                    Berikan rating:
                  </Text>
                  <HStack space="xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => handleRating(star)}>
                        <Ionicons
                          name={userRating >= star ? "star" : "star-outline"}
                          size={24}
                          color={userRating >= star ? "#FFD700" : "#D1D5DB"}
                        />
                      </Pressable>
                    ))}
                  </HStack>
                </Box>
              )} */}

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
                // Bahan List View - DATA DARI API (GANTI EMOJI DENGAN ANGKA)
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
                        bg={warnaGlobal.primary}
                        w={32}
                        h={32}
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
                      <VStack flex={1}>
                        <Text fontSize="$sm" fontWeight="$semibold">
                          {item.ingredient}
                        </Text>
                      </VStack>
                      <Text fontSize="$sm" color={warnaGlobal.gray500} fontWeight="$semibold">
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
