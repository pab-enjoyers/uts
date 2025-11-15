import React, { useState } from 'react';
import { Container, temaKelompok, spacing } from '../../styles';
import { VStack, HStack, Box, Heading, Text, Input, InputField, InputSlot, InputIcon, Pressable } from '@gluestack-ui/themed';
import { SearchIcon } from '@gluestack-ui/themed';
import { Card } from '../../styles/components/Card';
import { Section } from '../../styles/components/Layout';

export default function SyihabTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: 'Jepang', icon: '🍣', color: '$red100', count: 25 },
    { id: 2, name: 'Korea', icon: '🍜', color: '$orange100', count: 18 },
    { id: 3, name: 'China', icon: '🥟', color: '$yellow100', count: 30 },
    { id: 4, name: 'Indonesia', icon: '🍛', color: '$green100', count: 45 },
    { id: 5, name: 'Western', icon: '🍔', color: '$blue100', count: 22 },
    { id: 6, name: 'Thailand', icon: '🍲', color: '$purple100', count: 20 },
  ];

  const popularRecipes = [
    { id: 1, name: 'Sushi Roll', category: 'Jepang', time: '30 min' },
    { id: 2, name: 'Kimchi Jiggae', category: 'Korea', time: '45 min' },
    { id: 3, name: 'Nasi Goreng', category: 'Indonesia', time: '20 min' },
  ];

  return (
    <Container scrollable bg="$coolGray50">
      <VStack space="lg" p="$5" pb="$6">
        {/* Header */}
        <Card variant="elevated" bg={temaKelompok.syihab.primary} p="$5" mb="$2">
          <Heading size="2xl" color="$white" mb="$1">Recipe App</Heading>
          <Text color="$white" opacity={0.9} fontSize="$sm">Temukan resep favoritmu</Text>
        </Card>

        {/* Search Bar */}
        <Box mb="$2">
          <Input size="lg" variant="outline" bg="$white" h="$12">
            <InputSlot pl="$3">
              <InputIcon as={SearchIcon} color="$coolGray400" />
            </InputSlot>
            <InputField 
              placeholder="Cari resep..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>

        {/* Categories Section */}
        <Section title="Kategori Resep" mb="$2">
          <HStack flexWrap="wrap" gap="$3" justifyContent="space-between">
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.name)}
                width="48%"
                mb="$2"
              >
                <Box
                  bg={category.color}
                  p="$4"
                  borderRadius="$xl"
                  alignItems="center"
                  borderWidth={selectedCategory === category.name ? 2 : 0}
                  borderColor={temaKelompok.syihab.primary}
                  minHeight={110}
                  justifyContent="center"
                >
                  <Text fontSize="$4xl" mb="$2">{category.icon}</Text>
                  <Text fontSize="$md" fontWeight="$semibold" mb="$1">{category.name}</Text>
                  <Text fontSize="$xs" color="$coolGray600">{category.count} resep</Text>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </Section>

        {/* Selected Category Info */}
        {selectedCategory && (
          <Box bg={temaKelompok.syihab.light} p="$3" borderRadius="$lg" mb="$2">
            <Text color={temaKelompok.syihab.primary} fontWeight="$medium">
              📂 Kategori dipilih: {selectedCategory}
            </Text>
          </Box>
        )}

        {/* Popular Recipes Section */}
        <Section title="Resep Populer" mb="$2">
          <VStack space="md">
            {popularRecipes.map((recipe) => (
              <Card key={recipe.id} variant="outlined" p="$4" bg="$white">
                <VStack space="sm">
                  <Heading size="md" mb="$1">{recipe.name}</Heading>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text color="$coolGray600" fontSize="$sm">{recipe.category}</Text>
                    <Box bg={temaKelompok.syihab.light} px="$3" py="$1" borderRadius="$full">
                      <Text fontSize="$xs" color={temaKelompok.syihab.primary} fontWeight="$medium">
                        ⏱️ {recipe.time}
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </Card>
            ))}
          </VStack>
        </Section>
      </VStack>
    </Container>
  );
}
