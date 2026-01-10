import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  Image as RNImage,
  ActivityIndicator,
} from "react-native";
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Container, warnaGlobal } from "../../styles";
import { useAuth } from "../../context/AuthContext";
import { getArtikelById, updateArtikel } from "../../services/artikelService";
import { uploadArtikelThumbnailToCloudinary } from "../../services/cloudinaryService";
import * as ImagePicker from "expo-image-picker";

const CATEGORIES = [
  "Umum",
  "Tips Memasak",
  "Tutorial",
  "Review Bahan",
  "Cerita Kuliner",
  "Lainnya",
];

export default function EditArtikel() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [originalThumbnail, setOriginalThumbnail] = useState(null);
  const [errors, setErrors] = useState({});

  // Load article data
  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) {
      Alert.alert("Error", "ID artikel tidak ditemukan");
      router.back();
      return;
    }

    try {
      setLoading(true);
      const result = await getArtikelById(id);
      
      if (result.success && result.article) {
        const article = result.article;
        setTitle(article.title || "");
        setContent(article.content || "");
        setCategory(article.category || "Umum");
        setThumbnail(article.thumbnail || null);
        setOriginalThumbnail(article.thumbnail || null);
      } else {
        Alert.alert("Error", "Artikel tidak ditemukan");
        router.back();
      }
    } catch (error) {
      console.error("Error loading article:", error);
      Alert.alert("Error", "Gagal memuat artikel");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Pick image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Diperlukan", "Izin akses foto diperlukan");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setThumbnail(result.assets[0].uri);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Judul wajib diisi";
    } else if (title.length < 10) {
      newErrors.title = "Judul minimal 10 karakter";
    }

    if (!content.trim()) {
      newErrors.content = "Konten wajib diisi";
    } else if (content.length < 50) {
      newErrors.content = "Konten minimal 50 karakter";
    }

    if (!category) {
      newErrors.category = "Kategori wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      // Check if thumbnail changed (new local file)
      let thumbnailURL = thumbnail;
      if (thumbnail && thumbnail.startsWith('file://')) {
        console.log('📷 Uploading new thumbnail to Cloudinary...');
        const uploadResult = await uploadArtikelThumbnailToCloudinary(user.uid, thumbnail);
        if (uploadResult.success) {
          thumbnailURL = uploadResult.thumbnailURL;
          console.log('📷 New Thumbnail URL:', thumbnailURL);
        } else {
          console.warn('📷 Thumbnail upload failed:', uploadResult.error);
        }
      }

      const updates = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        thumbnail: thumbnailURL,
      };

      const result = await updateArtikel(id, updates);

      if (result.success) {
        Alert.alert("Berhasil", "Artikel berhasil diupdate!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Gagal mengupdate artikel");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengupdate artikel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color={warnaGlobal.primaryHex} />
          <Text mt="$4" color={warnaGlobal.gray600}>Memuat artikel...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        px="$4"
        pt="$12"
        pb="$4"
        bg="$white"
        borderBottomWidth={1}
        borderBottomColor={warnaGlobal.gray200}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.back()}>
            <Box p="$2">
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Box>
          </Pressable>
          <Text fontSize="$lg" fontWeight="$bold" color={warnaGlobal.gray900}>
            Edit Artikel
          </Text>
          <Box w={40} />
        </HStack>
      </Box>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <VStack space="lg" p="$4" pb="$10">
          {/* Thumbnail */}
          <VStack space="sm">
            <Text fontWeight="$semibold" color={warnaGlobal.gray700}>
              Thumbnail
            </Text>
            <TouchableOpacity onPress={pickImage}>
              <Box
                h={200}
                borderRadius="$xl"
                overflow="hidden"
                bg={warnaGlobal.gray100}
                borderWidth={1}
                borderColor={warnaGlobal.gray200}
                borderStyle="dashed"
                alignItems="center"
                justifyContent="center"
              >
                {thumbnail ? (
                  <RNImage
                    source={{ uri: thumbnail }}
                    style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                  />
                ) : (
                  <VStack alignItems="center" space="sm">
                    <Ionicons name="image-outline" size={48} color={warnaGlobal.gray400} />
                    <Text color={warnaGlobal.gray500}>Tap untuk ganti gambar</Text>
                  </VStack>
                )}
              </Box>
            </TouchableOpacity>
          </VStack>

          {/* Title */}
          <VStack space="sm">
            <Text fontWeight="$semibold" color={warnaGlobal.gray700}>
              Judul Artikel <Text color="$red500">*</Text>
            </Text>
            <Input
              variant="outline"
              size="lg"
              borderColor={errors.title ? "$red500" : warnaGlobal.gray300}
              borderRadius="$xl"
            >
              <InputField
                placeholder="Masukkan judul artikel"
                value={title}
                onChangeText={setTitle}
              />
            </Input>
            {errors.title && (
              <Text fontSize="$xs" color="$red500">{errors.title}</Text>
            )}
          </VStack>

          {/* Category */}
          <VStack space="sm">
            <Text fontWeight="$semibold" color={warnaGlobal.gray700}>
              Kategori <Text color="$red500">*</Text>
            </Text>
            <Select
              selectedValue={category}
              onValueChange={setCategory}
            >
              <SelectTrigger
                variant="outline"
                size="lg"
                borderColor={errors.category ? "$red500" : warnaGlobal.gray300}
                borderRadius="$xl"
              >
                <SelectInput placeholder="Pilih kategori" />
                <SelectIcon mr="$3">
                  <Ionicons name="chevron-down" size={20} color={warnaGlobal.gray500} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} label={cat} value={cat} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            {errors.category && (
              <Text fontSize="$xs" color="$red500">{errors.category}</Text>
            )}
          </VStack>

          {/* Content */}
          <VStack space="sm">
            <Text fontWeight="$semibold" color={warnaGlobal.gray700}>
              Konten <Text color="$red500">*</Text>
            </Text>
            <Textarea
              size="lg"
              borderColor={errors.content ? "$red500" : warnaGlobal.gray300}
              borderRadius="$xl"
              h={200}
            >
              <TextareaInput
                placeholder="Tulis konten artikel di sini..."
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
              />
            </Textarea>
            {errors.content && (
              <Text fontSize="$xs" color="$red500">{errors.content}</Text>
            )}
            <Text fontSize="$xs" color={warnaGlobal.gray500}>
              {content.length}/50 karakter minimum
            </Text>
          </VStack>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={saving}
            mt="$4"
          >
            <Box
              bg={saving ? warnaGlobal.gray400 : warnaGlobal.primaryHex}
              py="$4"
              borderRadius="$xl"
              alignItems="center"
            >
              {saving ? (
                <HStack space="sm" alignItems="center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text color="$white" fontWeight="$bold">
                    Menyimpan...
                  </Text>
                </HStack>
              ) : (
                <Text color="$white" fontWeight="$bold" fontSize="$md">
                  Simpan Perubahan
                </Text>
              )}
            </Box>
          </Pressable>
        </VStack>
      </ScrollView>
    </Box>
  );
}
