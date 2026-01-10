import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Pressable,
  ScrollView,
  Badge,
  BadgeText,
  Spinner,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { warnaGlobal } from "../../styles/theme";
import { getArtikelById, incrementViews, toggleLikeArtikel, getArtikelComments, addArtikelComment, deleteArtikelComment } from "../../services/artikelService";
import { getUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";

export default function ArtikelDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);
  
  // Comment states
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Load article from Firebase
  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const result = await getArtikelById(id);
      console.log('📄 Article loaded:', result.article?.title);
      if (result.success && result.article) {
        setArticle(result.article);
        setLikesCount(result.article.likes || 0);
        // Load author data - FIX: use result.data instead of result.user
        if (result.article.userId) {
          console.log('👤 Loading author for:', result.article.userId);
          const userResult = await getUserProfile(result.article.userId);
          console.log('👤 Author result:', userResult.success, userResult.data?.nama || 'No name');
          if (userResult.success && userResult.data) {
            setAuthor(userResult.data);
          }
        }
        // Increment views
        await incrementViews(id);
        // Load comments
        loadComments();
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load comments from Firebase
  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const result = await getArtikelComments(id);
      if (result.success) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      Alert.alert("Login Diperlukan", "Silakan login untuk berkomentar");
      return;
    }

    try {
      setSubmittingComment(true);
      const result = await addArtikelComment(id, user.uid, user.nama || user.email, user.photoURL, newComment.trim());
      if (result.success) {
        setNewComment("");
        loadComments(); // Reload comments
      } else {
        Alert.alert("Error", result.error || "Gagal mengirim komentar");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      Alert.alert("Error", "Gagal mengirim komentar");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete comment
  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Hapus Komentar",
      "Apakah Anda yakin ingin menghapus komentar ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const result = await deleteArtikelComment(id, commentId);
            if (result.success) {
              loadComments();
            }
          },
        },
      ]
    );
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (likingInProgress) return;
    
    try {
      setLikingInProgress(true);
      const result = await toggleLikeArtikel(id, isLiked);
      if (result.success) {
        setIsLiked(!isLiked);
        setLikesCount(result.likes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white">
        <Spinner size="large" color={warnaGlobal.primaryHex} />
        <Text mt="$4" color={warnaGlobal.gray600}>
          Memuat artikel...
        </Text>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white" px="$5">
        <Ionicons
          name="document-text-outline"
          size={64}
          color={warnaGlobal.gray400}
        />
        <Text mt="$4" fontSize="$lg" fontWeight="$semibold" color={warnaGlobal.gray700}>
          Artikel Tidak Ditemukan
        </Text>
        <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
          Artikel yang Anda cari tidak tersedia
        </Text>
        <Pressable
          onPress={() => router.back()}
          mt="$6"
          bg={warnaGlobal.primaryHex}
          px="$6"
          py="$3"
          borderRadius="$xl"
        >
          <Text color="$white" fontWeight="$semibold">
            Kembali
          </Text>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        pt="$12"
        pb="$4"
        bg="$white"
        px="$5"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        <HStack
          alignItems="center"
          justifyContent="flex-start"
        >
          <Pressable onPress={() => router.back()}>
            <Box
              w={40}
              h={40}
              borderRadius="$full"
              bg={warnaGlobal.gray100}
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={warnaGlobal.gray700Hex}
              />
            </Box>
          </Pressable>
        </HStack>
      </Box>

      {/* Content */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack space="lg" pb="$10">
          {/* Thumbnail */}
          {article.thumbnail && (
            <Box
              w="$full"
              h={240}
              bg={warnaGlobal.gray100}
              mt="$20"
            >
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

          <VStack space="md" px="$5" mt={article.thumbnail ? "$4" : "$24"}>
            {/* Category Badge dan Author Info - INLINE */}
            <HStack justifyContent="space-between" alignItems="center">
              {/* Category Badge */}
              {article.category && (
                <Badge
                  size="sm"
                  variant="solid"
                  borderRadius="$md"
                  bg={warnaGlobal.primaryHex}
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

              {/* Author Info - KECIL DI KANAN */}
              {author && (
                <HStack space="xs" alignItems="center">
                  <Avatar size="xs" bg={warnaGlobal.primaryHex}>
                    {author.photoURL ? (
                      <AvatarImage source={{ uri: author.photoURL }} />
                    ) : (
                      <AvatarFallbackText>
                        {author.nama || author.email || "U"}
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <Text fontSize="$xs" color={warnaGlobal.gray600}>
                    {author.nama || author.email || "Anonymous"}
                  </Text>
                </HStack>
              )}
            </HStack>

            {/* Title */}
            <Heading size="2xl" fontWeight="$bold" color={warnaGlobal.gray900} lineHeight={36}>
              {article.title}
            </Heading>

            {/* Meta Info with CLICKABLE LIKE */}
            <HStack space="lg" alignItems="center">
              <HStack space="xs" alignItems="center">
                <Ionicons
                  name="eye-outline"
                  size={18}
                  color={warnaGlobal.gray500}
                />
                <Text fontSize="$sm" color={warnaGlobal.gray600}>
                  {article.views || 0}
                </Text>
              </HStack>
              
              {/* LIKE BUTTON - CLICKABLE */}
              <Pressable 
                onPress={handleLikeToggle}
                disabled={likingInProgress}
              >
                <HStack space="xs" alignItems="center">
                  {likingInProgress ? (
                    <ActivityIndicator size="small" color={warnaGlobal.primaryHex} />
                  ) : (
                    <>
                      <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? warnaGlobal.primaryHex : warnaGlobal.gray500}
                      />
                      <Text fontSize="$sm" color={warnaGlobal.gray600} fontWeight="$medium">
                        {likesCount}
                      </Text>
                    </>
                  )}
                </HStack>
              </Pressable>

              <Text fontSize="$sm" color={warnaGlobal.gray500}>
                {article.createdAt?.toDate
                  ? new Date(article.createdAt.toDate()).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : ""}
              </Text>
            </HStack>
          </VStack>

          {/* Content */}
          <Box px="$5" mt="$4">
            <Text
              fontSize="$md"
              color={warnaGlobal.gray700}
              lineHeight={24}
              textAlign="justify"
            >
              {article.content}
            </Text>
          </Box>

          {/* Comment Section */}
          <Box mt="$6" px="$5">
            <HStack space="sm" alignItems="center" mb="$4">
              <Ionicons name="chatbubbles-outline" size={20} color={warnaGlobal.gray700} />
              <Heading size="md" color={warnaGlobal.gray900}>
                Komentar ({comments.length})
              </Heading>
            </HStack>

            {/* Comment Input */}
            {user ? (
              <HStack space="sm" mb="$4" alignItems="flex-end">
                <Avatar size="sm" bg={warnaGlobal.primaryHex}>
                  {user.photoURL ? (
                    <AvatarImage source={{ uri: user.photoURL }} />
                  ) : (
                    <AvatarFallbackText>{user.nama || user.email || "U"}</AvatarFallbackText>
                  )}
                </Avatar>
                <Box flex={1}>
                  <Input
                    variant="outline"
                    borderRadius="$xl"
                    bg={warnaGlobal.gray50}
                  >
                    <InputField
                      placeholder="Tulis komentar..."
                      value={newComment}
                      onChangeText={setNewComment}
                      multiline
                    />
                  </Input>
                </Box>
                <Pressable
                  onPress={handleSubmitComment}
                  disabled={submittingComment || !newComment.trim()}
                  bg={newComment.trim() ? warnaGlobal.primaryHex : warnaGlobal.gray200}
                  p="$3"
                  borderRadius="$full"
                >
                  {submittingComment ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={18} color={newComment.trim() ? "#fff" : warnaGlobal.gray400} />
                  )}
                </Pressable>
              </HStack>
            ) : (
              <Pressable 
                onPress={() => router.push("/auth/login")}
                bg={warnaGlobal.gray100}
                p="$4"
                borderRadius="$xl"
                mb="$4"
              >
                <Text textAlign="center" color={warnaGlobal.gray600}>
                  <Text fontWeight="$bold" color={warnaGlobal.primaryHex}>Login</Text> untuk berkomentar
                </Text>
              </Pressable>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <Box py="$6" alignItems="center">
                <Spinner size="small" color={warnaGlobal.primaryHex} />
              </Box>
            ) : comments.length === 0 ? (
              <Box py="$6" alignItems="center">
                <Ionicons name="chatbubble-outline" size={40} color={warnaGlobal.gray300} />
                <Text mt="$2" color={warnaGlobal.gray500} textAlign="center">
                  Belum ada komentar.\nJadilah yang pertama berkomentar!
                </Text>
              </Box>
            ) : (
              <VStack space="md">
                {comments.map((comment) => (
                  <Box
                    key={comment.id}
                    bg={warnaGlobal.gray50}
                    p="$4"
                    borderRadius="$xl"
                  >
                    <HStack space="sm" alignItems="flex-start">
                      <Avatar size="sm" bg={warnaGlobal.primaryHex}>
                        {comment.userPhotoURL ? (
                          <AvatarImage source={{ uri: comment.userPhotoURL }} />
                        ) : (
                          <AvatarFallbackText>{comment.userName || "U"}</AvatarFallbackText>
                        )}
                      </Avatar>
                      <VStack flex={1} space="xs">
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$sm" fontWeight="$bold" color={warnaGlobal.gray900}>
                            {comment.userName || "Anonymous"}
                          </Text>
                          <HStack space="sm" alignItems="center">
                            <Text fontSize="$xs" color={warnaGlobal.gray400}>
                              {comment.createdAt?.toDate
                                ? new Date(comment.createdAt.toDate()).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                  })
                                : "Baru"}
                            </Text>
                            {/* Delete button for own comments */}
                            {user && comment.userId === user.uid && (
                              <Pressable onPress={() => handleDeleteComment(comment.id)}>
                                <Ionicons name="trash-outline" size={14} color={warnaGlobal.gray400} />
                              </Pressable>
                            )}
                          </HStack>
                        </HStack>
                        <Text fontSize="$sm" color={warnaGlobal.gray700}>
                          {comment.content}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Footer */}
          <Box
            mt="$6"
            pt="$6"
            mx="$5"
            borderTopWidth={1}
            borderTopColor={warnaGlobal.gray200}
          >
            <Text fontSize="$sm" color={warnaGlobal.gray500} textAlign="center">
              Terima kasih telah membaca! 
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
