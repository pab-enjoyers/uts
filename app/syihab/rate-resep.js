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
  TextareaInput,
  Textarea,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, router } from "expo-router";

export default function RateRecipe() {
  const params = useLocalSearchParams();
  const { recipeName = "Recipe" } = params;

  // State - Props & State requirement
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log("Submitted:", { recipeName, rating, review });
    // Simulate success
    alert("Thank you for your review!");
    router.back();
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
      >
        <HStack alignItems="center" justifyContent="space-between">
          <IconButton
            icon={<Ionicons name="close-outline" size={24} color="#000" />}
            onPress={() => router.back()}
          />
          <Heading size="md" fontWeight="$semibold">
            Beri Penilaian Resep
          </Heading>
          <Box w={40} />
        </HStack>
      </Box>

      <Container scrollable bg="$white" padding="$0">
        <VStack space="xl" px="$5" mt="$24" pb="$8">
          {/* Recipe Name */}
          <VStack space="sm" alignItems="center" mt="$8">
            <Text fontSize="$lg" fontWeight="$semibold" textAlign="center">
              {recipeName}
            </Text>
            <Text fontSize="$sm" color={warnaGlobal.gray500} textAlign="center">
              Bagaimana pengalaman Anda?
            </Text>
          </VStack>

          {/* Star Rating - State management */}
          <VStack space="md" alignItems="center">
            <HStack space="sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)} p="$2">
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={40}
                    color={
                      star <= rating
                        ? warnaGlobal.amber400Hex
                        : warnaGlobal.gray300Hex
                    }
                  />
                </Pressable>
              ))}
            </HStack>
            {rating > 0 && (
              <Text fontSize="$sm" color={warnaGlobal.gray600}>
                {rating === 1 && "Buruk"}
                {rating === 2 && "Lumayan"}
                {rating === 3 && "Baik"}
                {rating === 4 && "Sangat Baik"}
                {rating === 5 && "Luar Biasa"}
              </Text>
            )}
          </VStack>

          {/* Review Text Input - State management */}
          <VStack space="sm">
            <Text
              fontSize="$sm"
              fontWeight="$semibold"
              color={warnaGlobal.gray700}
            >
              Tulis ulasan Anda
            </Text>
            <Textarea
              bg={warnaGlobal.gray50}
              borderRadius="$xl"
              borderWidth={1}
              borderColor={warnaGlobal.gray200}
              minHeight={150}
            >
              <TextareaInput
                placeholder="Share your experience with this recipe..."
                value={review}
                onChangeText={setReview}
                fontSize="$sm"
              />
            </Textarea>
            <Text fontSize="$xs" color={warnaGlobal.gray400}>
              {review.length} / 500 karakter
            </Text>
          </VStack>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            bg={rating > 0 ? warnaGlobal.primary : warnaGlobal.gray300}
            py="$4"
            borderRadius="$xl"
            alignItems="center"
            mt="$4"
          >
            <Text color="$white" fontSize="$md" fontWeight="$semibold">
              Kirim Ulasan
            </Text>
          </Pressable>
        </VStack>
      </Container>
    </Box>
  );
}
