import React from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Pressable,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { warnaGlobal } from "../theme";

export function ShareModal({ isVisible, onClose, recipeName, recipeLink }) {
  if (!isVisible) return null;

  const handleCopyLink = () => {
    Alert.alert("Sukses", "Tautan berhasil disalin!");
    console.log("Link copied:", recipeLink);
  };

  return (
    <>
      {/* Overlay */}
      <Pressable
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0,0,0,0.5)"
        zIndex={998}
        onPress={onClose}
      />

      {/* Modal Content */}
      <Box
        position="absolute"
        top="50%"
        left="$5"
        right="$5"
        zIndex={999}
        bg={warnaGlobal.white}
        borderRadius="$2xl"
        p="$5"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.25}
        shadowRadius={16}
        elevation={10}
        style={{ transform: [{ translateY: -120 }] }}
      >
        <VStack space="lg">
          {/* Close Button */}
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$lg" fontWeight="$bold" color={warnaGlobal.gray900}>
              Tautan Resep
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={warnaGlobal.gray400Hex} />
            </Pressable>
          </HStack>

          {/* Description */}
          <Text fontSize="$sm" color={warnaGlobal.gray600}>
            Salin tautan resep dan bagikan tautan resep Anda dengan teman dan keluarga.
          </Text>

          {/* Link Display */}
          <Box
            bg={warnaGlobal.gray50}
            borderRadius="$xl"
            px="$4"
            py="$3"
            borderWidth={1}
            borderColor={warnaGlobal.gray200}
          >
            <Text
              fontSize="$sm"
              color={warnaGlobal.gray700}
              numberOfLines={1}
            >
              {recipeLink}
            </Text>
          </Box>

          {/* Copy Link Button */}
          <Pressable
            onPress={handleCopyLink}
            bg={warnaGlobal.primary}
            py="$3.5"
            borderRadius="$xl"
            alignItems="center"
          >
            <Text
              color={warnaGlobal.white}
              fontSize="$md"
              fontWeight="$semibold"
            >
              Salin Tautan
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </>
  );
}
