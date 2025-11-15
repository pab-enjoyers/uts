// app/greek-salad-detail.js
import React from "react";
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

export default function GreekSaladDetail() {
  // params dikirim dari router.push di tab
  const params = useLocalSearchParams();
  const { id, name, image, rating, time } = params;

  // data default Greek Salad (kalau mau kamu bisa pindah ke file data terpisah)
  const defaultRecipe = {
    id: id ?? 1,
    name: name ?? "Classic Greek Salad",
    image: image ?? "🥗",
    rating: rating ?? 4.5,
    time: time ?? "15 Mins",
    description:
      "Salad khas Yunani yang segar dengan tomat, timun, paprika, zaitun, dan keju feta. Cocok untuk makan siang ringan atau pendamping makanan utama.",
    ingredients: [
      "2 buah tomat, potong dadu",
      "1 buah timun, iris setengah lingkaran",
      "1/2 buah bawang bombai merah, iris tipis",
      "1 buah paprika hijau, potong dadu",
      "80–100g keju feta, potong kotak kecil",
      "Zaitun hitam secukupnya",
      "2 sdm minyak zaitun",
      "1 sdm air perasan lemon",
      "1/2 sdt oregano kering",
      "Garam dan lada hitam secukupnya",
    ],
    steps: [
      "Siapkan semua sayuran: potong tomat, timun, paprika, dan iris tipis bawang merah.",
      "Masukkan semua sayuran ke dalam mangkuk besar, tambahkan zaitun hitam.",
      "Tambahkan potongan keju feta di atas sayuran.",
      "Dalam mangkuk kecil, campurkan minyak zaitun, air lemon, oregano, garam, dan lada. Aduk rata hingga menjadi dressing.",
      "Tuang dressing ke atas salad, lalu aduk perlahan agar sayuran tidak hancur.",
      "Sajikan segera sebagai hidangan pembuka atau pendamping.",
    ],
  };

  // bentukkan objek recipe dari params + default
  const recipe = {
    ...defaultRecipe,
    name: name || defaultRecipe.name,
    image: image || defaultRecipe.image,
    rating: rating || defaultRecipe.rating,
    time: time || defaultRecipe.time,
  };

  return (
    <Container scrollable bg="$white" padding="$5">
      {/* Tombol back */}
      <Pressable mb="$4" onPress={() => router.back()}>
        <Text color={temaKelompok.syihab.primary} fontSize="$sm">
          {"<"} Kembali
        </Text>
      </Pressable>

      <VStack space="lg">
        {/* Gambar / emoji resep */}
        <Box
          bg="$coolGray100"
          borderRadius="$2xl"
          justifyContent="center"
          alignItems="center"
          h={200}
        >
          <Text fontSize={80}>{recipe.image}</Text>
        </Box>

        {/* Judul + info singkat */}
        <VStack space="xs">
          <Heading size="lg" fontWeight="$bold">
            {recipe.name}
          </Heading>
          <HStack space="md" alignItems="center">
            <Text fontSize="$sm">⭐ {recipe.rating}</Text>
            <Text fontSize="$sm">• ⏱️ {recipe.time}</Text>
          </HStack>
        </VStack>

        {/* Deskripsi */}
        <Box>
          <Heading size="sm" mb="$1">
            Deskripsi
          </Heading>
          <Text fontSize="$sm" color="$coolGray700">
            {recipe.description}
          </Text>
        </Box>

        {/* Bahan-bahan */}
        <Box>
          <Heading size="sm" mb="$2">
            Bahan-bahan
          </Heading>
          <VStack space="xs">
            {recipe.ingredients.map((item, index) => (
              <HStack key={index} space="sm" alignItems="flex-start">
                <Text fontSize="$sm">•</Text>
                <Text fontSize="$sm" flex={1}>
                  {item}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Langkah-langkah */}
        <Box mb="$6">
          <Heading size="sm" mb="$2">
            Langkah-langkah
          </Heading>
          <VStack space="xs">
            {recipe.steps.map((step, index) => (
              <HStack key={index} space="sm" alignItems="flex-start">
                <Text fontSize="$sm">{index + 1}.</Text>
                <Text fontSize="$sm" flex={1}>
                  {step}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}