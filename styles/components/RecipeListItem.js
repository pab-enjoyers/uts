import React from 'react';
import { Box, VStack, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { warnaGlobal } from '../theme';

/**
 * RECIPE LIST ITEM COMPONENT
 * List item untuk popular recipes dengan rating stars
 * 
 * Props:
 * - recipe: object { id, name, image, rating, time, author }
 * - onPress: function ketika item diklik
 */
export const RecipeListItem = ({ recipe, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      sx={{
        ':active': {
          transform: [{ scale: 0.98 }],
        },
      }}
    >
      <HStack
        space="md"
        bg={warnaGlobal.gray50}
        borderRadius="$xl"
        p="$3"
        alignItems="center"
        sx={{
          ':active': {
            bg: warnaGlobal.gray100,
          },
        }}
      >
        {/* Recipe Image */}
        <Box
          bg={warnaGlobal.gray800}
          borderRadius="$xl"
          w={70}
          h={70}
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={36}>{recipe.image}</Text>
        </Box>

        {/* Recipe Info */}
        <VStack flex={1} space="xs">
          <Text fontSize="$sm" fontWeight="$bold" numberOfLines={1}>
            {recipe.name}
          </Text>
          
          {/* Star Rating */}
          <HStack space="xs" alignItems="center">
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < recipe.rating ? 'star' : 'star-outline'}
                size={14}
                color={warnaGlobal.amber400Hex}
              />
            ))}
          </HStack>
          
          <Text fontSize="$xs" color={warnaGlobal.gray500}>
            {recipe.author}
          </Text>
          
          {/* Time Info */}
          <HStack space="xs" alignItems="center">
            <Ionicons name="timer-outline" size={13} color={warnaGlobal.gray500Hex} />
            <Text fontSize="$xs" color={warnaGlobal.gray600}>
              {recipe.time}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
};
