import React, { useState } from "react";
import { Container, temaKelompok } from "../../styles";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, router } from "expo-router";

export default function RecipeDetail() {
  const params = useLocalSearchParams();
  const { id, name, image, rating, time } = params;

  // State untuk tab switcher (Props & State requirement)
  const [activeTab, setActiveTab] = useState("ingredient");

  // Data dummy resep lengkap
  const recipeData = {
    "Spicy chicken burger with French fries": {
      description: "Burger ayam pedas yang juicy dengan kentang goreng renyah. Cocok untuk makan siang atau makan malam yang mengenyangkan.",
      ingredients: [
        { icon: "🍅", name: "Tomatos", amount: "500g" },
        { icon: "🥬", name: "Cabbage", amount: "300g" },
        { icon: "🌮", name: "Taco", amount: "300g" },
        { icon: "🍞", name: "Slice Bread", amount: "300g" },
      ],
      steps: [
        "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
      ],
    },
    "Classic Greek Salad": {
      description: "Salad khas Yunani yang segar dengan tomat, timun, paprika, zaitun, dan keju feta.",
      ingredients: [
        { icon: "🍅", name: "Tomatos", amount: "500g" },
        { icon: "🥒", name: "Cucumber", amount: "300g" },
        { icon: "🧀", name: "Feta Cheese", amount: "100g" },
        { icon: "🫒", name: "Olives", amount: "150g" },
      ],
      steps: [
        "Siapkan semua sayuran: potong tomat, timun, paprika, dan iris tipis bawang merah.",
        "Masukkan semua sayuran ke dalam mangkuk besar, tambahkan zaitun hitam.",
        "Tambahkan potongan keju feta di atas sayuran.",
        "Dalam mangkuk kecil, campurkan minyak zaitun, air lemon, oregano, garam, dan lada. Aduk rata hingga menjadi dressing.",
        "Tuang dressing ke atas salad, lalu aduk perlahan agar sayuran tidak hancur.",
        "Sajikan segera sebagai hidangan pembuka atau pendamping.",
      ],
    },
  };

  // Ambil data resep sesuai nama atau gunakan default
  const currentRecipe = recipeData[name] || recipeData["Classic Greek Salad"];
  
  const recipe = {
    id: id || "1",
    name: name || "Classic Greek Salad",
    image: image || "🥗",
    rating: rating || "4.5",
    time: time || "15 Mins",
    description: currentRecipe.description,
    ingredients: currentRecipe.ingredients,
    steps: currentRecipe.steps,
  };

  return (
    <Container scrollable bg="$white" padding="$0">
      <VStack space="md">
        {/* Header dengan gambar resep */}
        <Box position="relative">
          {/* Gambar resep full width */}
          <Box
            bg="$coolGray100"
            h={250}
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Text fontSize={100}>{recipe.image}</Text>
            
            {/* Back button overlay */}
            <Pressable
              position="absolute"
              top="$4"
              left="$4"
              onPress={() => router.back()}
              bg="$white"
              borderRadius="$full"
              p="$2"
              w={40}
              h={40}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$lg">←</Text>
            </Pressable>

            {/* More options button */}
            <Pressable
              position="absolute"
              top="$4"
              right="$4"
              bg="$white"
              borderRadius="$full"
              p="$2"
              w={40}
              h={40}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$lg">⋯</Text>
            </Pressable>

            {/* Time badge */}
            <Box
              position="absolute"
              bottom="$4"
              right="$4"
              bg="$blackAlpha800"
              borderRadius="$full"
              px="$3"
              py="$2"
            >
              <HStack space="xs" alignItems="center">
                <Text color="$white" fontSize="$xs">⏱️</Text>
                <Text color="$white" fontSize="$xs" fontWeight="$semibold">
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
              (15 Reviews)
            </Text>
          </VStack>

          {/* Author info */}
          <HStack space="sm" alignItems="center">
            <Box
              bg={temaKelompok.syihab.light}
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
                Laura Wilson
              </Text>
              <HStack space="xs" alignItems="center">
                <Text color="$amber500" fontSize="$xs">📍</Text>
                <Text fontSize="$xs" color="$coolGray500">
                  Kuala Lumpur, Malaysia
                </Text>
              </HStack>
            </VStack>
            <Pressable
              bg={temaKelompok.syihab.primary}
              px="$5"
              py="$2"
              borderRadius="$lg"
            >
              <Text color="$white" fontSize="$sm" fontWeight="$semibold">
                Follow
              </Text>
            </Pressable>
          </HStack>

          {/* Tab Switcher - Ingredient / Procedure */}
          <HStack space="md" mt="$2">
            <Pressable
              flex={1}
              onPress={() => setActiveTab("ingredient")}
              bg={activeTab === "ingredient" ? temaKelompok.syihab.primary : "$coolGray100"}
              py="$3"
              borderRadius="$lg"
              alignItems="center"
            >
              <Text
                color={activeTab === "ingredient" ? "$white" : "$coolGray600"}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                Ingredient
              </Text>
            </Pressable>
            <Pressable
              flex={1}
              onPress={() => setActiveTab("procedure")}
              bg={activeTab === "procedure" ? temaKelompok.syihab.primary : "$coolGray100"}
              py="$3"
              borderRadius="$lg"
              alignItems="center"
            >
              <Text
                color={activeTab === "procedure" ? "$white" : "$coolGray600"}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                Procedure
              </Text>
            </Pressable>
          </HStack>

          {/* Content based on active tab */}
          {activeTab === "ingredient" ? (
            // Ingredient List View
            <VStack space="sm" mt="$4" pb="$6">
              {recipe.ingredients.map((item, index) => (
                <HStack
                  key={index}
                  space="md"
                  bg="$coolGray50"
                  p="$4"
                  borderRadius="$xl"
                  alignItems="center"
                >
                  <Box
                    bg="$white"
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
                  <Text fontSize="$sm" color="$coolGray500">
                    {item.amount}
                  </Text>
                </HStack>
              ))}
            </VStack>
          ) : (
            // Procedure Steps View
            <VStack space="md" mt="$4" pb="$6">
              {recipe.steps.map((step, index) => (
                <VStack key={index} space="sm">
                  <HStack space="sm" alignItems="flex-start">
                    <Box
                      bg={temaKelompok.syihab.primary}
                      w={28}
                      h={28}
                      borderRadius="$full"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text color="$white" fontSize="$sm" fontWeight="$bold">
                        {index + 1}
                      </Text>
                    </Box>
                    <Text flex={1} fontSize="$sm" color="$coolGray700" lineHeight="$lg">
                      {step}
                    </Text>
                  </HStack>
                  {index < recipe.steps.length - 1 && (
                    <Box ml="$3" h={1} bg="$coolGray200" />
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