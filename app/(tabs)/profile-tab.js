import React from "react";
import { ScrollView as RNScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { Container, warnaGlobal, RecipeCard, CustomButton } from "../../styles";
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
  Spinner,
  Fab,
  FabIcon,
  AddIcon,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { profileResep } from "../../data/profile";
import { useAuth } from "../../context/AuthContext";
import { getBookmarks } from "../../services/userService";
import { getArtikelByUser } from "../../services/artikelService";

export default function ProfileTab() {
  // State untuk bookmark dan active tab (Props & State requirement)
  const [bookmarkedRecipes, setBookmarkedRecipes] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("artikel");

  const [bookmarkCount, setBookmarkCount] = React.useState(0);
  const [loadingStats, setLoadingStats] = React.useState(true);
  
  // Artikel state
  const [articles, setArticles] = React.useState([]);
  const [loadingArticles, setLoadingArticles] = React.useState(false);
  
  // Auth context
  const { user, refreshUserProfile } = useAuth();

  /**
   * Load bookmark count dari Firebase
   */
  const loadBookmarkCount = async () => {
    if (!user || !user.uid) {
      setBookmarkCount(0);
      setLoadingStats(false);
      return;
    }

    try {
      setLoadingStats(true);
      const result = await getBookmarks(user.uid);
      if (result.success && result.bookmarks) {
        setBookmarkCount(result.bookmarks.length);
      } else {
        setBookmarkCount(0);
      }
    } catch (error) {
      console.log("Error loading bookmark count:", error);
      setBookmarkCount(0);
    } finally {
      setLoadingStats(false);
    }
  };
  
  /**
   * Load user's articles dari Firebase
   */
  const loadUserArticles = async () => {
    if (!user || !user.uid) {
      setArticles([]);
      setLoadingArticles(false);
      return;
    }

    try {
      setLoadingArticles(true);
      const result = await getArtikelByUser(user.uid);
      if (result.success && result.articles) {
        setArticles(result.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.log("Error loading articles:", error);
      setArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  };

  /**
   * Auto-refresh bookmark count when screen focused
   */
  useFocusEffect(
    React.useCallback(() => {
      loadBookmarkCount();
      // Refresh user profile juga
      if (refreshUserProfile) {
        refreshUserProfile();
      }
      // Load articles if tab is artikel
      if (activeTab === "artikel") {
        loadUserArticles();
      }
    }, [user?.uid])
  );
  
  /**
   * Reload articles when tab changes to artikel
   */
  React.useEffect(() => {
    if (activeTab === "artikel" && user?.uid) {
      loadUserArticles();
    }
  }, [activeTab]);

  /**
   * Handle logout dengan konfirmasi
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLogoutLoading(true);
            const result = await logout();
            setLogoutLoading(false);
            
            if (result.success) {
              router.replace('/auth/login');
            } else {
              Alert.alert('Error', result.error || 'Gagal logout');
            }
          }
        }
      ]
    );
  };

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
          <Pressable onPress={() => router.push('/syihab/settings')}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={warnaGlobal.gray700Hex}
            />
          </Pressable>
        </HStack>
      </Box>

      {/* Not logged in view */}
      {!user ? (
        <Container scrollable bg="$white" padding="$0">
          <VStack space="lg" px="$5" mt="$24" pb="$24">
            <VStack space="md" alignItems="center" py="$10">
              <Ionicons name="person-circle-outline" size={80} color={warnaGlobal.gray300Hex} />
              <Heading size="md" color={warnaGlobal.gray900}>
                Belum Login
              </Heading>
              <Text fontSize="$sm" color={warnaGlobal.gray500} textAlign="center">
                Silakan login untuk melihat profile dan bookmark Anda
              </Text>
              <CustomButton
                title="Login"
                onPress={() => router.push('/auth/login')}
                variant="solid"
                size="md"
                mt="$4"
              />
            </VStack>
          </VStack>
        </Container>
      ) : (
        // Logged in view
        <Container scrollable bg="$white" padding="$0">
          <VStack space="lg" px="$5" mt="$24" pb="$24">{/* Profile content continues... */}
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
                justifyContent="center"
                alignItems="center"
              >
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text fontSize={42} color={warnaGlobal.primary}>
                    {(user?.nama || user?.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                )}
              </Box>

              {/* Stats di kanan */}
              <HStack space="lg" flex={1} justifyContent="space-around">
                <VStack alignItems="center">
                  <Text
                    fontSize="$lg"
                    fontWeight="$bold"
                    color={warnaGlobal.gray900}
                  >
                    {user?.recipesCount || 0}
                  </Text>
                  <Text fontSize="$xs" color={warnaGlobal.gray500} mt="$1">
                    Resep
                  </Text>
                </VStack>
                <VStack alignItems="center">
                  {loadingStats ? (
                    <Spinner size="small" color={warnaGlobal.primary} />
                  ) : (
                    <Text
                      fontSize="$lg"
                      fontWeight="$bold"
                      color={warnaGlobal.gray900}
                    >
                      {bookmarkCount}
                    </Text>
                  )}
                  <Text fontSize="$xs" color={warnaGlobal.gray500} mt="$1">
                    Bookmark
                  </Text>
                </VStack>
                <VStack alignItems="center">
                  <Text
                    fontSize="$lg"
                    fontWeight="$bold"
                    color={warnaGlobal.gray900}
                  >
                    {user?.followingCount || 0}
                  </Text>
                  <Text fontSize="$xs" color={warnaGlobal.gray500} mt="$1">
                    Mengikuti
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            {/* Name and Bio - Left aligned */}
            <VStack space="xs" alignItems="flex-start" w="$full" mt="$3">
              <HStack justifyContent="space-between" alignItems="center" w="$full">
                <Heading size="lg" fontWeight="$bold" color={warnaGlobal.gray900}>
                  {user?.nama || 'User'}
                </Heading>
                <Pressable onPress={() => router.push('/auth/edit-profile')}>
                  <Ionicons name="create-outline" size={20} color="#EF4444" />
                </Pressable>
              </HStack>

              <Text
                fontSize="$sm"
                fontWeight="bold"
                color={warnaGlobal.gray500}
              >
                {user?.status || 'Food Enthusiast'}
              </Text>

              <Text
                fontSize="$sm"
                color={warnaGlobal.gray600}
                lineHeight="$sm"
                mt="$1"
              >
                {user?.bio || 'Belum ada bio'}
              </Text>

              {/* Phone Number */}
              {/* {user?.phone && (
                <HStack space="xs" alignItems="center" mt="$2">
                  <Ionicons name="call" size={14} color={warnaGlobal.gray500} />
                  <Text fontSize="$xs" color={warnaGlobal.gray500}>
                    {user.phone}
                  </Text>
                </HStack>
              )} */}

              {/* Location */}
              {user?.location && (
                <HStack space="xs" alignItems="center" mt="$1">
                  <Ionicons name="location" size={14} color={warnaGlobal.gray500} />
                  <Text fontSize="$xs" color={warnaGlobal.gray500}>
                    {user.location}
                  </Text>
                </HStack>
              )}

              {/* <Pressable onPress={() => console.log("View more")}>
                <Text fontSize="$sm" color={warnaGlobal.primary}>
                  More...
                </Text>
              </Pressable>
               */}
              {/* Display logged in user email if available */}
              {/* {user && user.email && (
                <Box mt="$2" w="$full">
                  <Text fontSize="$xs" color={warnaGlobal.gray400}>
                    🔐 {user.email}
                  </Text>
                </Box>
              )} */}
            </VStack>
          </VStack>

          {/* Tab Buttons */}
          <HStack space="md" justifyContent="center">
            <Pressable flex={1} onPress={() => setActiveTab("artikel")}>
              {({ pressed }) => (
                <Box
                  bg={
                    activeTab === "artikel"
                      ? warnaGlobal.primary
                      : "$transparent"
                  }
                  py="$2.5"
                  borderRadius="$lg"
                  alignItems="center"
                  borderWidth={activeTab === "artikel" ? 0 : 1}
                  borderColor={warnaGlobal.gray300}
                  opacity={pressed ? 0.8 : 1}
                >
                  <Text
                    fontSize="$sm"
                    fontWeight="$semibold"
                    color={
                      activeTab === "artikel"
                        ? warnaGlobal.whiteHex
                        : warnaGlobal.gray600
                    }
                  >
                    Artikel
                  </Text>
                </Box>
              )}
            </Pressable>
            <Pressable flex={1} onPress={() => setActiveTab("ulasan")}>
              {({ pressed }) => (
                <Box
                  bg={
                    activeTab === "ulasan" ? warnaGlobal.primary : "$transparent"
                  }
                  py="$2.5"
                  borderRadius="$lg"
                  alignItems="center"
                  borderWidth={activeTab === "ulasan" ? 0 : 1}
                  borderColor={warnaGlobal.gray300}
                  opacity={pressed ? 0.8 : 1}
                >
                  <Text
                    fontSize="$sm"
                    fontWeight="$medium"
                    color={
                      activeTab === "ulasan"
                        ? warnaGlobal.whiteHex
                        : warnaGlobal.gray600
                    }
                  >
                    Ulasan
                  </Text>
                </Box>
              )}
            </Pressable>
          </HStack>

          {/* Tab Content: Artikel */}
          {activeTab === "artikel" && (
            <Box mt="$6">
              {loadingArticles ? (
                <Box alignItems="center" justifyContent="center" py="$10">
                  <Spinner size="large" color={warnaGlobal.primaryHex} />
                  <Text mt="$4" color={warnaGlobal.gray600}>
                    Memuat artikel...
                  </Text>
                </Box>
              ) : articles.length === 0 ? (
                <Box alignItems="center" justifyContent="center" py="$10">
                  <Ionicons
                    name="document-text-outline"
                    size={64}
                    color={warnaGlobal.gray400}
                  />
                  <Text
                    mt="$4"
                    fontSize="$lg"
                    fontWeight="$semibold"
                    color={warnaGlobal.gray700}
                  >
                    Belum Ada Artikel
                  </Text>
                  <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
                    Mulai berbagi pengetahuan dengan membuat artikel pertamamu
                  </Text>
                </Box>
              ) : (
                <VStack space="md">
                  {articles.map((article, index) => (
                    <Pressable
                      key={article.id || index}
                      onPress={() =>
                        router.push({
                          pathname: "/najma/artikelDetail",
                          params: { id: article.id },
                        })
                      }
                    >
                      <Box
                        bg="$white"
                        borderRadius="$xl"
                        overflow="hidden"
                        borderWidth={1}
                        borderColor={warnaGlobal.gray200}
                      >
                        {/* Thumbnail */}
                        {article.thumbnail && (
                          <Box h={180} w="$full" bg={warnaGlobal.gray100}>
                            <Image
                              source={{ uri: article.thumbnail }}
                              style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "cover",
                              }}
                            />
                          </Box>
                        )}

                        {/* Content */}
                        <Box p="$4">
                          {/* Category Badge */}
                          {article.category && (
                            <Badge
                              size="sm"
                              variant="solid"
                              borderRadius="$md"
                              bg={warnaGlobal.primaryHex}
                              mb="$2"
                              alignSelf="flex-start"
                            >
                              <BadgeText
                                color="$white"
                                fontSize="$xs"
                                fontWeight="$medium"
                              >
                                {article.category}
                              </BadgeText>
                            </Badge>
                          )}

                          {/* Title */}
                          <Text
                            fontSize="$xl"
                            fontWeight="$bold"
                            color={warnaGlobal.gray900}
                            numberOfLines={2}
                            mb="$2"
                          >
                            {article.title}
                          </Text>

                          {/* Excerpt */}
                          {article.content && (
                            <Text
                              fontSize="$sm"
                              color={warnaGlobal.gray600}
                              numberOfLines={2}
                              mb="$3"
                            >
                              {article.content}
                            </Text>
                          )}

                          {/* Meta Info */}
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            mt="$2"
                          >
                            <HStack space="md" alignItems="center">
                              <HStack space="xs" alignItems="center">
                                <Ionicons
                                  name="eye-outline"
                                  size={16}
                                  color={warnaGlobal.gray500}
                                />
                                <Text fontSize="$xs" color={warnaGlobal.gray600}>
                                  {article.views || 0}
                                </Text>
                              </HStack>
                              <HStack space="xs" alignItems="center">
                                <Ionicons
                                  name="heart-outline"
                                  size={16}
                                  color={warnaGlobal.gray500}
                                />
                                <Text fontSize="$xs" color={warnaGlobal.gray600}>
                                  {article.likes || 0}
                                </Text>
                              </HStack>
                            </HStack>

                            <Text fontSize="$xs" color={warnaGlobal.gray500}>
                              {article.createdAt?.toDate
                                ? new Date(
                                    article.createdAt.toDate()
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Baru saja"}
                            </Text>
                          </HStack>
                        </Box>
                      </Box>
                    </Pressable>
                  ))}
                </VStack>
              )}
            </Box>
          )}

          {/* Tab Content: Ulasan */}
          {activeTab === "ulasan" && (
            <Box mt="$6">
              <Box alignItems="center" justifyContent="center" py="$10">
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={warnaGlobal.gray400}
                />
                <Text
                  mt="$4"
                  fontSize="$lg"
                  fontWeight="$semibold"
                  color={warnaGlobal.gray700}
                >
                  Belum Ada Ulasan
                </Text>
                <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
                  Ulasan yang kamu berikan akan muncul di sini
                </Text>
              </Box>
            </Box>
          )}

          {/* FAB Button untuk Buat Artikel */}
          {activeTab === "artikel" && (
            <Fab
              size="lg"
              placement="bottom right"
              bg={warnaGlobal.primaryHex}
              onPress={() => router.push("/artikel/create-artikel")}
            >
              <FabIcon as={AddIcon} color="$white" />
            </Fab>
          )}
        </VStack>
      </Container>
      )}
    </Box>
  );
}
