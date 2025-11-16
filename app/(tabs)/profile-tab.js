import React from "react";
import { ScrollView as RNScrollView, Image } from "react-native";
import { Container, warnaGlobal, RecipeCard, SettingsDropdown } from "../../styles";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Avatar,
  Pressable,
  Badge,
  BadgeText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { userData, profileResep } from "../../data/profile";

export default function ProfileTab() {
  // State untuk bookmark dan active tab (Props & State requirement)
  const [bookmarkedRecipes, setBookmarkedRecipes] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("recipe");
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <Box flex={1} bg="$white">
      {/* Sticky Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        px="$5"
        pt="$12"
        pb="$3"
        bg="$white"
      >
        <HStack alignItems="center" justifyContent="space-between">
          <Box w={40} />
          <Heading
            size="lg"
            fontWeight="$bold"
            color={warnaGlobal.gray900}
            textAlign="center"
          >
            Profile
          </Heading>
          <Pressable onPress={() => setShowDropdown(!showDropdown)}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={warnaGlobal.gray700Hex}
            />
          </Pressable>

          {/* Settings Dropdown */}
          <SettingsDropdown
            isVisible={showDropdown}
            onClose={() => setShowDropdown(false)}
            onSelect={(option) => {
              if (option === 'faq') {
                router.push('/angela/faq');
              } else if (option === 'akun') {
                console.log('Akun selected');
              } else if (option === 'help') {
                console.log('Help selected');
              }
            }}
          />
        </HStack>
      </Box>

      {/* Scrollable Content */}
      <Container scrollable bg="$white" padding="$0">
        <VStack space="lg" px="$5" mt="$24" pb="$24">
          {/* Profile Header */}
          <VStack space="sm">
            {/* Avatar + Stats in Row */}
            <HStack space="lg" alignItems="center" w="$full">
              {/* Avatar di kiri */}
              <Box
                w={100}
                h={100}
                borderRadius="$full"
                overflow="hidden"
                bg={warnaGlobal.gray100}
              >
                <Image
                  source={userData.avatarImage}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </Box>

              {/* Stats di kanan */}
              <HStack space="lg" flex={1} justifyContent="space-around">
                <VStack alignItems="center">
                  <Text
                    fontSize="$lg"
                    fontWeight="$bold"
                    color={warnaGlobal.gray900}
                  >
                    {userData.stats.recipes}
                  </Text>
                  <Text fontSize="$xs" color={warnaGlobal.gray500} mt="$1">
                    Resep
                  </Text>
                </VStack>
                <VStack alignItems="center">
                  <Text
                    fontSize="$lg"
                    fontWeight="$bold"
                    color={warnaGlobal.gray900}
                  >
                    {userData.stats.followers}M
                  </Text>
                  <Text fontSize="$xs" color={warnaGlobal.gray500} mt="$1">
                    Pengikut
                  </Text>
                </VStack>
                <VStack alignItems="center">
                  <Text
                    fontSize="$lg"
                    fontWeight="$bold"
                    color={warnaGlobal.gray900}
                  >
                    {userData.stats.following}
                  </Text>
                  <Text fontSize="$xs" color={warnaGlobal.gray500} mt="$1">
                    Mengikuti
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            {/* Name and Bio - Left aligned */}
            <VStack space="xs" alignItems="flex-start" w="$full" mt="$3">
              <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
                {userData.name}
              </Heading>

              <Text
                fontSize="$sm"
                fontWeight="bold"
                color={warnaGlobal.gray500}
              >
                {userData.status}
              </Text>

              <Text
                fontSize="$sm"
                color={warnaGlobal.gray600}
                lineHeight="$sm"
                mt="$1"
              >
                {userData.bio}
              </Text>

              <Pressable onPress={() => console.log("View more")}>
                <Text fontSize="$sm" color={warnaGlobal.primary}>
                  More...
                </Text>
              </Pressable>
            </VStack>
          </VStack>

          {/* Tab Buttons */}
          <HStack space="md" justifyContent="center">
            <Pressable flex={1} onPress={() => setActiveTab("recipe")}>
              {({ pressed }) => (
                <Box
                  bg={
                    activeTab === "recipe"
                      ? warnaGlobal.primary
                      : "$transparent"
                  }
                  py="$2.5"
                  borderRadius="$lg"
                  alignItems="center"
                  borderWidth={activeTab === "recipe" ? 0 : 1}
                  borderColor={warnaGlobal.gray300}
                  opacity={pressed ? 0.8 : 1}
                >
                  <Text
                    fontSize="$sm"
                    fontWeight="$semibold"
                    color={
                      activeTab === "recipe"
                        ? warnaGlobal.whiteHex
                        : warnaGlobal.gray600
                    }
                  >
                    Resep
                  </Text>
                </Box>
              )}
            </Pressable>
            <Pressable flex={1} onPress={() => setActiveTab("video")}>
              {({ pressed }) => (
                <Box
                  bg={
                    activeTab === "video" ? warnaGlobal.primary : "$transparent"
                  }
                  py="$2.5"
                  borderRadius="$lg"
                  alignItems="center"
                  borderWidth={activeTab === "video" ? 0 : 1}
                  borderColor={warnaGlobal.gray300}
                  opacity={pressed ? 0.8 : 1}
                >
                  <Text
                    fontSize="$sm"
                    fontWeight="$medium"
                    color={
                      activeTab === "video"
                        ? warnaGlobal.whiteHex
                        : warnaGlobal.gray600
                    }
                  >
                    Video
                  </Text>
                </Box>
              )}
            </Pressable>
            <Pressable flex={1} onPress={() => setActiveTab("tag")}>
              {({ pressed }) => (
                <Box
                  bg={
                    activeTab === "tag" ? warnaGlobal.primary : "$transparent"
                  }
                  py="$2.5"
                  borderRadius="$lg"
                  alignItems="center"
                  borderWidth={activeTab === "tag" ? 0 : 1}
                  borderColor={warnaGlobal.gray300}
                  opacity={pressed ? 0.8 : 1}
                >
                  <Text
                    fontSize="$sm"
                    fontWeight="$medium"
                    color={
                      activeTab === "tag"
                        ? warnaGlobal.whiteHex
                        : warnaGlobal.gray600
                    }
                  >
                    Tag
                  </Text>
                </Box>
              )}
            </Pressable>
          </HStack>

          {/* Recipe Cards - Horizontal Scroll */}
          <Box>
            <RNScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
            >
              <VStack space="md">
                {profileResep.map((recipe) => (
                  <Pressable
                    key={recipe.id}
                    onPress={() =>
                      router.push({
                        pathname: "/angela/detail",
                        params: {
                          id: recipe.id,
                          name: recipe.name,
                          rating: recipe.rating,
                          time: recipe.time,
                        },
                      })
                    }
                  >
                    <Box
                      bg={warnaGlobal.gray800Hex}
                      borderRadius="$2xl"
                      overflow="hidden"
                      h={140}
                      position="relative"
                    >
                      {/* Badge */}
                      <Badge
                        position="absolute"
                        top="$3"
                        right="$3"
                        size="sm"
                        variant="solid"
                        borderRadius="$full"
                        bg={warnaGlobal.amber400}
                        zIndex={10}
                        px="$2.5"
                        py="$1"
                      >
                        <BadgeText
                          color="$white"
                          fontSize="$xs"
                          fontWeight="$semibold"
                        >
                          {recipe.rating}
                        </BadgeText>
                      </Badge>

                      {/* Content */}
                      <Box
                        position="absolute"
                        bottom="$4"
                        left="$4"
                        right="$4"
                        zIndex={5}
                      >
                        <Text
                          fontSize="$lg"
                          fontWeight="$bold"
                          color="$white"
                          numberOfLines={2}
                          mb="$1"
                        >
                          {recipe.name}
                        </Text>
                        <HStack space="sm" alignItems="center">
                          <Text fontSize="$xs" color={warnaGlobal.gray300}>
                            By {recipe.author}
                          </Text>
                          <HStack space="xs" alignItems="center">
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color="white"
                            />
                            <Text fontSize="$xs" color="$white">
                              {recipe.time}
                            </Text>
                          </HStack>
                        </HStack>
                      </Box>

                      {/* Bookmark */}
                      <Pressable
                        position="absolute"
                        bottom="$4"
                        right="$4"
                        zIndex={10}
                        onPress={(e) => {
                          e.stopPropagation();
                          setBookmarkedRecipes((prev) =>
                            prev.includes(recipe.id)
                              ? prev.filter((id) => id !== recipe.id)
                              : [...prev, recipe.id]
                          );
                        }}
                      >
                        <Box
                          bg={
                            bookmarkedRecipes.includes(recipe.id)
                              ? warnaGlobal.lightHex
                              : "$white"
                          }
                          w={32}
                          h={32}
                          borderRadius="$full"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Ionicons
                            name={
                              bookmarkedRecipes.includes(recipe.id)
                                ? "bookmark"
                                : "bookmark-outline"
                            }
                            size={16}
                            color={
                              bookmarkedRecipes.includes(recipe.id)
                                ? warnaGlobal.primaryHex
                                : warnaGlobal.gray700Hex
                            }
                          />
                        </Box>
                      </Pressable>
                    </Box>
                  </Pressable>
                ))}
              </VStack>
            </RNScrollView>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
