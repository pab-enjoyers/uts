import React from "react";
import { Container, warnaGlobal, IconButton } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  Image,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, router } from "expo-router";
import { getReviewsByResep, getAverageRating, getTotalReviews } from "../../data/reviews";

export default function Reviews() {
  const params = useLocalSearchParams();
  const { recipeName = "Classic Greek Salad" } = params;
  
  const reviews = getReviewsByResep(recipeName);
  const avgRating = getAverageRating(recipeName);
  const totalReviews = getTotalReviews(recipeName);

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
                  {totalReviews} Reviews
                </Text>
              </VStack>
            </HStack>

            <Pressable
              onPress={() => router.push({
                pathname: "/syihab/rate-resep",
                params: { recipeName }
              })}
              bg={warnaGlobal.primary}
              py="$3"
              borderRadius="$xl"
              alignItems="center"
            >
              <Text color="$white" fontSize="$sm" fontWeight="$semibold">
                Tulis Ulasan
              </Text>
            </Pressable>
          </VStack>

          {/* Reviews List */}
          <VStack space="md" px="$5">
            {reviews.length === 0 ? (
              <VStack alignItems="center" py="$8">
                <Text fontSize="$sm" color={warnaGlobal.gray500}>
                  Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
                </Text>
              </VStack>
            ) : (
              reviews.map((review) => (
                <Pressable
                  key={review.id}
                  onPress={() => router.push({
                    pathname: "/syihab/review-detail",
                    params: { 
                      reviewId: review.id,
                      recipeName 
                    }
                  })}
                >
                  <Box
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
                        bg={warnaGlobal.light}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {typeof review.userAvatar === 'string' && review.userAvatar.startsWith('�') ? (
                          <Text fontSize="$lg">{review.userAvatar}</Text>
                        ) : (
                          <Image
                            source={review.userAvatar}
                            alt={review.userName}
                            w={40}
                            h={40}
                            borderRadius="$full"
                          />
                        )}
                      </Box>

                      {/* Review Content */}
                      <VStack flex={1} space="xs">
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$sm" fontWeight="$semibold">
                            {review.userName}
                          </Text>
                          <Text fontSize="$xs" color={warnaGlobal.gray400}>
                            {new Date(review.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Text>
                        </HStack>

                        <HStack space="xs">
                          {renderStars(review.rating)}
                        </HStack>

                        <Text 
                          fontSize="$sm" 
                          color={warnaGlobal.gray600}
                          numberOfLines={2}
                        >
                          {review.comment}
                        </Text>

                        <HStack space="xs" alignItems="center" mt="$1">
                          <Ionicons 
                            name="thumbs-up-outline" 
                            size={14} 
                            color={warnaGlobal.gray400Hex} 
                          />
                          <Text fontSize="$xs" color={warnaGlobal.gray400}>
                            {review.helpful} membantu
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                </Pressable>
              ))
            )}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
