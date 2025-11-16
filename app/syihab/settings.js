import React from "react";
import { Container, warnaGlobal } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  Box,
  Text,
  Pressable,
  Heading,
} from "@gluestack-ui/themed";
import { router } from "expo-router";

export default function Settings() {
  // Menu sections - Props & State requirement (bisa jadi props atau state)
  const menuSections = [
    {
      id: "account",
      title: "Akun Anda",
      items: [
        {
          id: "pusat-akun",
          label: "Pusat Akun",
          icon: "person-circle-outline",
          route: "/deru/account",
          description: "Kata sandi, keamanan, detail pribadi, preferensi iklan",
        },
      ],
    },
    {
      id: "usage",
      title: "Bagaimana Anda menggunakan Resep App",
      items: [
        {
          id: "tersimpan",
          label: "Tersimpan",
          icon: "bookmark-outline",
          route: "/najma/favorite",
          description: null,
        },
        {
          id: "arsip",
          label: "Arsip",
          icon: "archive-outline",
          route: "/deru/archive",
          description: null,
        },
        {
          id: "aktivitas",
          label: "Aktivitas Anda",
          icon: "bar-chart-outline",
          route: "/deru/activity",
          description: null,
        },
        {
          id: "notifikasi",
          label: "Notifikasi",
          icon: "notifications-outline",
          route: "/deru/notifications",
          description: null,
        },
        {
          id: "waktu",
          label: "Manajemen waktu",
          icon: "time-outline",
          route: "/deru/time-management",
          description: null,
        },
      ],
    },
    {
      id: "more",
      title: "Lainnya",
      items: [
        {
          id: "help",
          label: "Help",
          icon: "help-circle-outline",
          route: "/deru/help",
          description: null,
        },
        {
          id: "faq",
          label: "FAQ",
          icon: "information-circle-outline",
          route: "/angela/faq",
          description: null,
        },
      ],
    },
  ];

  const handleMenuPress = (route) => {
    router.push(route);
  };

  const handleLogout = () => {
    // Logout logic - bisa ditambahkan nanti
    console.log("Logout pressed");
  };

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg="$white"
        px="$5"
        pt="$12"
        pb="$3"
        borderBottomWidth={1}
        borderBottomColor={warnaGlobal.gray200}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </Pressable>
          <Heading
            size="lg"
            fontWeight="$bold"
            color={warnaGlobal.gray900}
          >
            Pengaturan
          </Heading>
          <Box w={24} />
        </HStack>
      </Box>

      {/* Content */}
      <Container scrollable bg="$white" padding="$0">
        <VStack space="lg" mt="$24" pb="$8">
          {/* Menu Sections */}
          {menuSections.map((section) => (
            <VStack key={section.id} space="xs">
              {/* Section Title */}
              <Text
                fontSize="$xs"
                fontWeight="$semibold"
                color={warnaGlobal.gray500}
                px="$5"
                py="$2"
              >
                {section.title}
              </Text>

              {/* Section Items */}
              {section.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleMenuPress(item.route)}
                >
                  {({ pressed }) => (
                    <Box
                      bg={pressed ? warnaGlobal.gray50 : "$white"}
                      px="$5"
                      py="$3.5"
                      borderBottomWidth={1}
                      borderBottomColor={warnaGlobal.gray100}
                    >
                      <HStack alignItems="center" justifyContent="space-between">
                        <HStack space="md" alignItems="center" flex={1}>
                          {/* Icon */}
                          <Ionicons
                            name={item.icon}
                            size={24}
                            color={warnaGlobal.gray900Hex}
                          />

                          {/* Text Content */}
                          <VStack flex={1}>
                            <Text
                              fontSize="$md"
                              color={warnaGlobal.gray900}
                            >
                              {item.label}
                            </Text>
                            {item.description && (
                              <Text
                                fontSize="$xs"
                                color={warnaGlobal.gray500}
                                mt="$1"
                                numberOfLines={2}
                              >
                                {item.description}
                              </Text>
                            )}
                          </VStack>
                        </HStack>

                        {/* Chevron Right */}
                        <Ionicons
                          name="chevron-forward-outline"
                          size={20}
                          color={warnaGlobal.gray400Hex}
                        />
                      </HStack>
                    </Box>
                  )}
                </Pressable>
              ))}
            </VStack>
          ))}

          {/* Logout Button */}
          <Box px="$5" mt="$4">
            <Pressable onPress={handleLogout}>
              {({ pressed }) => (
                <Box
                  bg={pressed ? warnaGlobal.gray50 : "$white"}
                  px="$5"
                  py="$3.5"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor={warnaGlobal.gray200}
                >
                  <HStack alignItems="center" space="md">
                    <Ionicons
                      name="log-out-outline"
                      size={24}
                      color={warnaGlobal.primary}
                    />
                    <Text
                      fontSize="$md"
                      color={warnaGlobal.primary}
                      fontWeight="$semibold"
                    >
                      Keluar
                    </Text>
                  </HStack>
                </Box>
              )}
            </Pressable>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
