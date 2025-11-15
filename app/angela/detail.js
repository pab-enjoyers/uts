import React, { useState } from "react";
import { Container, warnaGlobal, IconButton } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable
} from "@gluestack-ui/themed";
import { useLocalSearchParams, router } from "expo-router";
import { recipeDetails } from "../../data/resep";

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const { id, name, image, rating, time } = params;

  // State untuk tab switcher (Props & State requirement)
  const [activeTab, setActiveTab] = useState("bahan");

  // Ambil data resep sesuai nama atau gunakan default
  const currentRecipe =
    recipeDetails[name] || recipeDetails["Classic Greek Salad"];

  const recipe = {
    id: id || "1",
    name: name || "Classic Greek Salad",
    image: image || "🥗",
    rating: rating || "4.5",
    time: time || "15 Mins",
    description: currentRecipe.description,
    bahans: currentRecipe.bahans,
    steps: currentRecipe.steps,
  };

  return (
    <Container scrollable bg="$white" padding="$0">
      <VStack space="md" mt="$12">
        {/* Header dengan gambar resep */}
        <Box position="relative">
          {/* Gambar resep full width */}
          <Box
            bg={warnaGlobal.gray100}
            h={250}
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Text fontSize={100}>{recipe.image}</Text>

            {/* Back button overlay */}
            <IconButton
              icon={<Ionicons name="arrow-back-outline" size={20} color="gray" />}
              onPress={() => router.back()}
              position={{ top: '$4', left: '$4' }}
            />

            {/* More options button */}
            <IconButton
              icon={<Ionicons name="ellipsis-horizontal" size={20} color="gray" />}
              onPress={() => {}}
              position={{ top: '$4', right: '$4' }}
            />

            {/* Time badge */}
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
          {/* Title and rating */}
          <VStack space="xs">
            <Heading size="lg" fontWeight="$bold">
              {recipe.name}
            </Heading>
            <Text fontSize="$sm" color="$coolGray500">
              (15 Ulasan)
            </Text>
          </VStack>

          {/* Author info */}
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
                Fuad Gedhangan
              </Text>
              <HStack space="xs" alignItems="center">
                <Ionicons name="location" color="#dc2626" size={12} />

                <Text fontSize="$xs" color="$coolGray500">
                  Gedhangan Aloha, Malaysia
                </Text>
              </HStack>
            </VStack>
            <Pressable
              bg={warnaGlobal.primary}
              px="$5"
              py="$2"
              borderRadius="$lg"
            >
              <Text color={warnaGlobal.white} fontSize="$sm" fontWeight="$semibold">
                Ikuti
              </Text>
            </Pressable>
          </HStack>

          {/* Tab Switcher - Bahan / Prosedur */}
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
                color={activeTab === "bahan" ? warnaGlobal.white : warnaGlobal.gray600}
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
                color={activeTab === "prosedur" ? warnaGlobal.white : warnaGlobal.gray600}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                Prosedur
              </Text>
            </Pressable>
          </HStack>

          {/* Content based on active tab */}
          {activeTab === "bahan" ? (
            // Bahan List View
            <VStack space="sm" mt="$4" pb="$6">
              {recipe.bahans.map((item, index) => (
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
                    <Text fontSize={28}>{item.icon}</Text>
                  </Box>
                  <VStack flex={1}>
                    <Text fontSize="$sm" fontWeight="$semibold">
                      {item.name}
                    </Text>
                  </VStack>
                  <Text fontSize="$sm" color={warnaGlobal.gray500}>
                    {item.amount}
                  </Text>
                </HStack>
              ))}
            </VStack>
          ) : (
            // Prosedur Steps View
            <VStack space="md" mt="$4" pb="$6">
              {recipe.steps.map((step, index) => (
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
                      <Text color={warnaGlobal.white} fontSize="$sm" fontWeight="$bold">
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
                  {index < recipe.steps.length - 1 && (
                    <Box ml="$3" h={1} bg={warnaGlobal.gray200} />
                  )}
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Container>
  );
}
