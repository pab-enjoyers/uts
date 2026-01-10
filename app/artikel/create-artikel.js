import React, { useState } from "react";
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
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Container, warnaGlobal } from "../../styles";
import { useAuth } from "../../context/AuthContext";
import { createArtikel } from "../../services/artikelService";
import * as ImagePicker from "expo-image-picker";

const CATEGORIES = [
  "Umum",
  "Tips Memasak",
  "Tutorial",
  "Review Bahan",
  "Cerita Kuliner",
  "Lainnya",
];

export default function CreateArtikel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Umum");
  const [thumbnail, setThumbnail] = useState(null);

  // Request permission for image picker
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Aplikasi memerlukan izin akses galeri untuk memilih gambar thumbnail."
      );
      return false;
    }
    return true;
  };

  // Pick thumbnail image
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setThumbnail(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih gambar");
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnail(null);
  };

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Validasi", "Judul artikel harus diisi");
      return false;
    }
    if (title.trim().length < 5) {
      Alert.alert("Validasi", "Judul artikel minimal 5 karakter");
      return false;
    }
    if (!content.trim()) {
      Alert.alert("Validasi", "Konten artikel harus diisi");
      return false;
    }
    if (content.trim().length < 50) {
      Alert.alert("Validasi", "Konten artikel minimal 50 karakter");
      return false;
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const artikelData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        thumbnail: thumbnail || null,
      };

      const result = await createArtikel(user.uid, artikelData);

      if (result.success) {
        Alert.alert("Berhasil", "Artikel berhasil dibuat!", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Gagal membuat artikel");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      Alert.alert("Error", "Terjadi kesalahan saat membuat artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        bg={warnaGlobal.primaryHex}
        pt="$12"
        pb="$4"
        px="$4"
      >
        <HStack alignItems="center" space="md">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text fontSize="$xl" fontWeight="$bold" color="$white" flex={1}>
            Buat Artikel Baru
          </Text>
        </HStack>
      </Box>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        <Container>
          <VStack space="xl" py="$6">
            {/* Title Input */}
            <VStack space="sm">
              <Text fontSize="$sm" fontWeight="$semibold" color={warnaGlobal.gray700}>
                Judul Artikel *
              </Text>
              <Input
                size="lg"
                variant="outline"
                borderColor={warnaGlobal.gray300}
              >
                <InputField
                  placeholder="Masukkan judul artikel"
                  value={title}
                  onChangeText={setTitle}
                />
              </Input>
            </VStack>

            {/* Category Select */}
            <VStack space="sm">
              <Text fontSize="$sm" fontWeight="$semibold" color={warnaGlobal.gray700}>
                Kategori
              </Text>
              <Select selectedValue={category} onValueChange={setCategory}>
                <SelectTrigger
                  variant="outline"
                  size="lg"
                  borderColor={warnaGlobal.gray300}
                >
                  <SelectInput placeholder="Pilih kategori" />
                  <SelectIcon mr="$3">
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={warnaGlobal.gray600}
                    />
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
            </VStack>

            {/* Thumbnail Upload */}
            <VStack space="sm">
              <Text fontSize="$sm" fontWeight="$semibold" color={warnaGlobal.gray700}>
                Thumbnail (Opsional)
              </Text>
              {thumbnail ? (
                <Box position="relative">
                  <RNImage
                    source={{ uri: thumbnail }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 12,
                      backgroundColor: warnaGlobal.gray100,
                    }}
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={removeThumbnail}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 20,
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </Pressable>
                </Box>
              ) : (
                <Pressable onPress={pickImage}>
                  <Box
                    borderWidth={2}
                    borderColor={warnaGlobal.gray300}
                    borderStyle="dashed"
                    borderRadius="$xl"
                    h={200}
                    alignItems="center"
                    justifyContent="center"
                    bg={warnaGlobal.gray50}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={48}
                      color={warnaGlobal.gray400}
                    />
                    <Text mt="$2" color={warnaGlobal.gray600} fontSize="$sm">
                      Tap untuk upload thumbnail
                    </Text>
                    <Text color={warnaGlobal.gray500} fontSize="$xs">
                      Ratio 16:9 disarankan
                    </Text>
                  </Box>
                </Pressable>
              )}
            </VStack>

            {/* Content Textarea */}
            <VStack space="sm">
              <Text fontSize="$sm" fontWeight="$semibold" color={warnaGlobal.gray700}>
                Konten Artikel *
              </Text>
              <Textarea
                size="lg"
                variant="outline"
                borderColor={warnaGlobal.gray300}
                h={300}
              >
                <TextareaInput
                  placeholder="Tulis konten artikel Anda di sini... (minimal 50 karakter)"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                />
              </Textarea>
              <Text fontSize="$xs" color={warnaGlobal.gray500}>
                {content.length} karakter
              </Text>
            </VStack>

            {/* Action Buttons */}
            <VStack space="md" mt="$4" mb="$6">
              <Button
                size="lg"
                bg={warnaGlobal.primaryHex}
                onPress={handleSubmit}
                isDisabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ButtonText color="$white" fontWeight="$semibold">
                    Publikasikan Artikel
                  </ButtonText>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                borderColor={warnaGlobal.gray300}
                onPress={() => router.back()}
                isDisabled={loading}
              >
                <ButtonText color={warnaGlobal.gray700}>Batal</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Container>
      </ScrollView>
    </Box>
  );
}
