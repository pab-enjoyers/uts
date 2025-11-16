import React, { useState } from "react";
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
import { getReviewsByResep } from "../../data/reviews";

export default function ReviewDetail() {
  const params = useLocalSearchParams();
  const { reviewId, recipeName } = params;

  const reviews = getReviewsByResep(recipeName);
  const review = reviews.find((r) => r.id === parseInt(reviewId));

  // State - Props & State requirement
  const [isHelpful, setIsMembantu] = useState(false);
  const [helpfulCount, setIsMembantuCount] = useState(review?.helpful || 0);

  if (!review) {
    return (
      <Box flex={1} bg="$white" justifyContent="center" alignItems="center">
        <Text>Ulasan tidak ditemukan</Text>
      </Box>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={20}
        color={
          index < rating ? warnaGlobal.amber400Hex : warnaGlobal.gray300Hex
        }
      />
    ));
  };

  const handleMembantu = () => {
    if (!isHelpful) {
      setIsMembantuCount(helpfulCount + 1);
      setIsMembantu(true);
    } else {
      setIsMembantuCount(helpfulCount - 1);
      setIsMembantu(false);
    }
  };

  const handleReport = () => {
    alert(
      "Ulasan telah dilaporkan. Terima kasih telah membantu kami menjaga kualitas konten."
    );
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
            Detail Ulasan
          </Heading>
          <IconButton
            icon={
              <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
            }
            onPress={handleReport}
          />
        </HStack>
      </Box>

      <Container scrollable bg="$white" padding="$0">
        <VStack space="lg" px="$5" mt="$24" pb="$8">
          {/* User Info */}
          <HStack space="md" alignItems="center" mt="$6">
            <Box
              w={60}
              h={60}
              borderRadius="$full"
              overflow="hidden"
              bg={warnaGlobal.light}
              justifyContent="center"
              alignItems="center"
            >
              {typeof review.userAvatar === 'string' && review.userAvatar.startsWith('�') ? (
                <Text fontSize="$2xl">{review.userAvatar}</Text>
              ) : (
                <Image
                  source={review.userAvatar}
                  alt={review.userName}
                  w={60}
                  h={60}
                  borderRadius="$full"
                />
              )}
            </Box>
            <VStack flex={1}>
              <Text fontSize="$lg" fontWeight="$semibold">
                {review.userName}
              </Text>
              <HStack space="xs" alignItems="center">
                <Ionicons
                  name="location"
                  size={14}
                  color={warnaGlobal.primaryHex}
                />
                <Text fontSize="$sm" color={warnaGlobal.gray500}>
                  {review.location}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Rating and Date */}
          <VStack space="sm">
            <HStack space="sm" alignItems="center">
              {renderStars(review.rating)}
              <Text fontSize="$sm" color={warnaGlobal.gray400} ml="$2">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </HStack>
          </VStack>

          {/* Recipe Name */}
          <Box bg={warnaGlobal.gray50} p="$4" borderRadius="$xl">
            <Text fontSize="$xs" color={warnaGlobal.gray500} mb="$1">
              Ulasan untuk
            </Text>
            <Text fontSize="$md" fontWeight="$semibold">
              {recipeName}
            </Text>
          </Box>

          {/* Full Comment */}
          <VStack space="sm">
            <Text
              fontSize="$sm"
              fontWeight="$semibold"
              color={warnaGlobal.gray700}
            >
              Ulasan
            </Text>
            <Text fontSize="$sm" color={warnaGlobal.gray600} lineHeight="$lg">
              {review.comment}
            </Text>
          </VStack>

          {/* Actions */}
          <VStack space="md" mt="$4">
            {/* Helpful Button - State management */}
            <Pressable
              onPress={handleMembantu}
              bg={isHelpful ? warnaGlobal.light : "$white"}
              borderWidth={1}
              borderColor={
                isHelpful ? warnaGlobal.primary : warnaGlobal.gray200
              }
              py="$3"
              px="$4"
              borderRadius="$xl"
            >
              <HStack space="sm" alignItems="center" justifyContent="center">
                <Ionicons
                  name={isHelpful ? "thumbs-up" : "thumbs-up-outline"}
                  size={20}
                  color={
                    isHelpful ? warnaGlobal.primaryHex : warnaGlobal.gray600Hex
                  }
                />
                <Text
                  fontSize="$sm"
                  fontWeight="$semibold"
                  color={isHelpful ? warnaGlobal.primary : warnaGlobal.gray600}
                >
                  Membantu ({helpfulCount})
                </Text>
              </HStack>
            </Pressable>

            {/* Report Button */}
            <Pressable
              onPress={handleReport}
              bg="$white"
              borderWidth={1}
              borderColor={warnaGlobal.gray200}
              py="$3"
              px="$4"
              borderRadius="$xl"
            >
              <HStack space="sm" alignItems="center" justifyContent="center">
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color={warnaGlobal.gray600Hex}
                />
                <Text
                  fontSize="$sm"
                  fontWeight="$semibold"
                  color={warnaGlobal.gray600}
                >
                  Laporkan Ulasan
                </Text>
              </HStack>
            </Pressable>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
