import React, { useState, useEffect } from "react";
import { Container, warnaGlobal, IconButton } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
  TextareaInput,
  Textarea,
  Spinner,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { addRating, getUserRating, addNotification } from "../../services/userService";

export default function RateRecipe() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { mealId, mealName = "Recipe", mealThumb } = params;

  // State - Props & State requirement
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUserRating();
  }, [user, mealId]);

  const loadUserRating = async () => {
    if (!user || !mealId) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserRating(user.uid, mealId);
      if (result.success && result.rating > 0) {
        setRating(result.rating);
        setReview(result.review || "");
      }
    } catch (error) {
      console.error("Error loading user rating:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Login Required", "Silakan login untuk memberikan rating");
      return;
    }

    if (rating === 0) {
      Alert.alert("Rating Required", "Silakan pilih rating");
      return;
    }

    try {
      setSubmitting(true);
      console.log("📊 Submitting rating:", { mealId, rating, review });

      const result = await addRating(user.uid, mealId, rating, review.trim(), mealName, mealThumb);

      console.log("📊 Rating result:", result);

      if (result.success) {
        // Send notification
        await addNotification(user.uid, {
          title: "Rating Tersimpan",
          message: `Anda memberikan rating ${rating}⭐ untuk ${mealName}`,
          type: "rating",
          mealId: mealId,
        });

        console.log("✅ Rating saved successfully, navigating back...");

        Alert.alert("Terima Kasih!", "Rating Anda berhasil disimpan", [
          { 
            text: "OK", 
            onPress: () => {
              console.log("🔙 Navigating back to reviews...");
              router.back();
            }
          }
        ]);
      } else {
        Alert.alert("Error", "Gagal menyimpan rating");
      }
    } catch (error) {
      console.error("❌ Error submitting rating:", error);
      Alert.alert("Error", "Gagal menyimpan rating");
    } finally {
      setSubmitting(false);
    }
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
        {loading ? (
          <VStack flex={1} justifyContent="center" alignItems="center" mt="$32">
            <Spinner size="large" color={warnaGlobal.primary} />
            <Text mt="$3" color={warnaGlobal.gray500}>Memuat...</Text>
          </VStack>
        ) : (
          <VStack space="xl" px="$5" mt="$24" pb="$8">
            {/* Recipe Name */}
            <VStack space="sm" alignItems="center" mt="$8">
              <Text fontSize="$lg" fontWeight="$semibold" textAlign="center">
                {mealName}
              </Text>
              <Text fontSize="$sm" color={warnaGlobal.gray500} textAlign="center">
                Bagaimana pengalaman Anda?
              </Text>
            </VStack>

            {/* Star Rating - State management */}
            <VStack space="md" alignItems="center">
              <HStack space="sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable 
                    key={star} 
                    onPress={() => setRating(star)} 
                    p="$2"
                    disabled={submitting}
                  >
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
                Tulis ulasan Anda (opsional)
              </Text>
              <Textarea
                bg={warnaGlobal.gray50}
                borderRadius="$xl"
                borderWidth={1}
                borderColor={warnaGlobal.gray200}
                minHeight={150}
                isDisabled={submitting}
              >
                <TextareaInput
                  placeholder="Ceritakan pengalaman Anda dengan resep ini..."
                  value={review}
                  onChangeText={setReview}
                  fontSize="$sm"
                  maxLength={500}
                />
              </Textarea>
              <Text fontSize="$xs" color={warnaGlobal.gray400}>
                {review.length} / 500 karakter
              </Text>
            </VStack>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              bg={rating > 0 && !submitting ? warnaGlobal.primary : warnaGlobal.gray300}
              py="$4"
              borderRadius="$xl"
              alignItems="center"
              mt="$4"
              disabled={rating === 0 || submitting}
            >
              {submitting ? (
                <HStack space="sm" alignItems="center">
                  <Spinner size="small" color="$white" />
                  <Text color="$white" fontSize="$md" fontWeight="$semibold">
                    Menyimpan...
                  </Text>
                </HStack>
              ) : (
                <Text color="$white" fontSize="$md" fontWeight="$semibold">
                  Kirim Ulasan
                </Text>
              )}
            </Pressable>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
