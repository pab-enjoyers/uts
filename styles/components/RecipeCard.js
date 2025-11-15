import React from 'react';
import { Box, VStack, Text, Pressable, Badge, BadgeText, HStack } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { warnaGlobal } from '../theme';

/**
 * RECIPE CARD COMPONENT
 * Card untuk featured recipes dengan bookmark dan rating
 * 
 * Props:
 * - recipe: object { id, name, image, rating, time, bgColor }
 * - onPress: function ketika card diklik
 * - isBookmarked: boolean status bookmark
 * - onBookmark: function ketika bookmark diklik
 * - bookmarkBgColor: warna background bookmark saat active
 * - bookmarkActiveColor: warna icon bookmark saat active
 */
export const RecipeCard = ({ 
  recipe,
  onPress,
  isBookmarked = false,
  onBookmark,
  bookmarkBgColor = warnaGlobal.lightHex,
  bookmarkActiveColor = warnaGlobal.primaryHex
}) => {
  return (
    <Pressable
      onPress={onPress}
      sx={{
        ':active': {
          transform: [{ scale: 0.95 }],
        },
      }}
    >
      <Box
        w={170}
        h={220}
        bg={recipe.bgColor}
        borderRadius="$2xl"
        p="$4"
        position="relative"
        sx={{
          ':active': {
            opacity: 0.8,
          },
        }}
      >
        {/* Recipe Image/Icon */}
        <Box alignItems="center" mb="$3" mt="$2">
          <Text fontSize={64}>{recipe.image}</Text>
        </Box>

        {/* Rating Badge */}
        <Box position="absolute" top="$3" right="$3">
          <Badge
            size="md"
            variant="solid"
            borderRadius="$lg"
            bg={warnaGlobal.amber400}
          >
            <HStack space="xs" alignItems="center">
              <Ionicons name="star" size={12} color="white" />
              <BadgeText
                color="$white"
                fontWeight="$bold"
                fontSize="$xs"
              >
                {recipe.rating}
              </BadgeText>
            </HStack>
          </Badge>
        </Box>

        {/* Bookmark Icon */}
        <Pressable
          position="absolute"
          bottom="$4"
          right="$4"
          onPress={(e) => {
            e.stopPropagation();
            onBookmark && onBookmark(recipe.id);
          }}
        >
          <Box
            bg={isBookmarked ? bookmarkBgColor : warnaGlobal.white}
            p="$2"
            borderRadius="$lg"
            shadowColor="$black"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={13}
              color={isBookmarked ? bookmarkActiveColor : warnaGlobal.gray500Hex}
            />
          </Box>
        </Pressable>

        {/* Recipe Info */}
        <VStack
          space="xs"
          position="absolute"
          bottom="$4"
          left="$4"
          right="$12"
        >
          <Text
            fontSize="$sm"
            fontWeight="$bold"
            numberOfLines={2}
            h={36}
          >
            {recipe.name}
          </Text>
          <Text fontSize="$xs" color={warnaGlobal.gray600}>
            Time
          </Text>
          <Text fontSize="$xs" fontWeight="$semibold">
            {recipe.time}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};
