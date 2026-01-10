import React, { useState, useEffect, useCallback } from "react";
import { Container, warnaGlobal, IconButton } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { 
  getMealRatings, 
  getAverageRating,
  getUserRating,
  toggleReviewLike
} from "../../services/userService";

export default function Reviews() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { mealId, mealName = "Recipe", mealThumb } = params;
  
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState("0.0");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    loadReviews();
    checkUserReview();
  }, [mealId, user]);

  useFocusEffect(
    useCallback(() => {
      // Reload reviews when screen comes into focus
      console.log("🔄 Reviews screen focused - reloading data");
      loadReviews();
      checkUserReview();
    }, [mealId, user])
  );

  const checkUserReview = async () => {
    if (!user?.uid || !mealId) {
      setHasUserReviewed(false);
      return;
    }

    try {
      const result = await getUserRating(user.uid, mealId);
      if (result.success && result.rating > 0) {
        setHasUserReviewed(true);
        console.log("✅ User sudah pernah review");
      } else {
        setHasUserReviewed(false);
        console.log("❌ User belum pernah review");
      }
    } catch (error) {
      console.error("Error checking user review:", error);
      setHasUserReviewed(false);
    }
  };

  const loadReviews = async () => {
    if (!mealId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log("📊 Loading reviews for meal:", mealId);
      
      // Load all ratings
      const ratingsResult = await getMealRatings(mealId);
      if (ratingsResult.success && ratingsResult.ratings) {
        setReviews(ratingsResult.ratings);
        console.log("📊 Loaded", ratingsResult.ratings.length, "reviews");
      }

      // Load average rating
      const avgResult = await getAverageRating(mealId);
      if (avgResult.success) {
        setAvgRating(avgResult.rating.toFixed(1));
        setTotalCount(avgResult.count);
        console.log("📊 Average rating:", avgResult.rating, "- Total:", avgResult.count);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (reviewId) => {
    if (!user?.uid) return;
    
    try {
      await toggleReviewLike(mealId, reviewId, user.uid);
      loadReviews(); // Reload to get updated likes
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={14}
        color={index < rating ? warnaGlobal.amber400Hex : warnaGlobal.gray300Hex}
      />
    ));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0];
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Baru saja";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 30) return `${diffDays} hari lalu`;
    
    // Format like "Nov 10"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg="$white"
        px="$5"
        pt="$12"
        pb="$3"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={4}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <IconButton
            icon={<Ionicons name="arrow-back-outline" size={24} color="#000" />}
            onPress={() => router.back()}
          />
          <Heading size="md" fontWeight="$semibold">
            Ulasan
          </Heading>
          <Box w={40} />
        </HStack>
      </Box>

      <Container scrollable bg="$white" padding="$0">
        {loading ? (
          <VStack flex={1} justifyContent="center" alignItems="center" mt="$32" py="$20">
            <Spinner size="large" color={warnaGlobal.primary} />
            <Text mt="$3" color={warnaGlobal.gray500}>Memuat ulasan...</Text>
          </VStack>
        ) : (
          <VStack space="md" mt="$24" pb="$8">
            {/* Rating Summary */}
            <VStack space="md" px="$5" py="$6" bg={warnaGlobal.gray50}>
              <HStack alignItems="center" justifyContent="center" space="md">
                <VStack alignItems="center">
                  <Text fontSize="$4xl" fontWeight="$bold" color={warnaGlobal.primary}>
                    {avgRating}
                  </Text>
                  <HStack space="xs" mt="$1">
                    {renderStars(Math.round(parseFloat(avgRating)))}
                  </HStack>
                  <Text fontSize="$sm" color={warnaGlobal.gray500} mt="$1">
                    {totalCount} Reviews
                  </Text>
                </VStack>
              </HStack>

              <Pressable
                onPress={() => {
                  console.log("🔄 Navigating to rate-resep, hasReviewed:", hasUserReviewed);
                  router.push({
                    pathname: "/syihab/rate-resep",
                    params: { 
                      mealId,
                      mealName,
                      mealThumb
                    }
                  });
                }}
                bg={warnaGlobal.primary}
                py="$3"
                borderRadius="$xl"
                alignItems="center"
              >
                <Text color="$white" fontSize="$sm" fontWeight="$semibold">
                  {hasUserReviewed ? "Edit Ulasan" : "Tulis Ulasan"}
                </Text>
              </Pressable>
            </VStack>

            {/* Reviews List */}
            <VStack space="md" px="$5">
              {reviews.length === 0 ? (
                <VStack alignItems="center" py="$8">
                  <Ionicons 
                    name="chatbox-outline" 
                    size={64} 
                    color={warnaGlobal.gray300Hex} 
                  />
                  <Text fontSize="$sm" color={warnaGlobal.gray500} mt="$3" textAlign="center">
                    Belum ada ulasan.{'\n'}Jadilah yang pertama memberikan ulasan!
                  </Text>
                </VStack>
              ) : (
                reviews.map((review, index) => (
                  <Box
                    key={review.id || index}
                    bg="$white"
                    borderRadius="$xl"
                    p="$4"
                    borderWidth={1}
                    borderColor={warnaGlobal.gray200}
                  >
                    <HStack space="sm" alignItems="flex-start">
                      {/* Avatar */}
                      <Box
                        w={40}
                        h={40}
                        borderRadius="$full"
                        overflow="hidden"
                        bg={warnaGlobal.primary}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$md" fontWeight="$bold" color="$white">
                          {getInitials(review.userName || "User")}
                        </Text>
                      </Box>

                      {/* Review Content */}
                      <VStack flex={1} space="xs">
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$sm" fontWeight="$semibold">
                            {review.userName || "Anonymous"}
                          </Text>
                          <Text fontSize="$xs" color={warnaGlobal.gray400}>
                            {getTimeAgo(review.createdAt)}
                          </Text>
                        </HStack>

                        <HStack space="xs">
                          {renderStars(review.rating || 0)}
                        </HStack>

                        {review.review && (
                          <Text 
                            fontSize="$sm" 
                            color={warnaGlobal.gray600}
                            mt="$1"
                          >
                            {review.review}
                          </Text>
                        )}

                        {/* Like Button */}
                        <HStack space="xs" alignItems="center" mt="$2">
                          <TouchableOpacity 
                            onPress={() => handleToggleLike(review.uid)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                          >
                            <Ionicons
                              name={review.likedBy?.includes(user?.uid) ? "thumbs-up" : "thumbs-up-outline"}
                              size={16}
                              color={warnaGlobal.gray400Hex}
                            />
                            <Text fontSize="$xs" color={warnaGlobal.gray400} ml="$1">
                              {review.likes || 0} membantu
                            </Text>
                          </TouchableOpacity>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
