import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Box } from "@gluestack-ui/themed";
// import { FontAwesome } from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { colors, warnaGlobal } from "../../styles/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="artikel"
        options={{
          title: "Artikel",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Box alignItems="center" gap="$1">
              {focused && (
                <Box w={40} h={3} bg={warnaGlobal.primary} borderRadius="$full" />
              )}
              <Ionicons
                name={focused ? "newspaper" : "newspaper-outline"}
                size={22}
                color={color}
              />
            </Box>
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Disimpan",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Box alignItems="center" gap="$1">
              {focused && (
                <Box w={40} h={3} bg={warnaGlobal.primary} borderRadius="$full" />
              )}
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={22}
                color={color}
              />
            </Box>
          ),
        }}
      />

      {/* Center Home Button */}
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Box
              position="absolute"
              top={-35}
              alignItems="center"
              justifyContent="center"
              w={70}
              h={70}
            >
              <Box
                w={60}
                h={60}
                borderRadius="$full"
                alignItems="center"
                justifyContent="center"
                bg={warnaGlobal.primary}
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.2}
                shadowRadius={6}
                elevation={8}
              >
                <Ionicons
                  name={focused ? "book" : "book-outline"}
                  size={28}
                  color="white"
                />
              </Box>
            </Box>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="notifikasi"
        options={{
          title: "Notifikasi",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Box alignItems="center" gap="$1">
              {focused && (
                <Box w={40} h={3} bg={warnaGlobal.primary} borderRadius="$full" />
              )}
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={22}
                color={color}
              />
            </Box>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Box alignItems="center" gap="$1">
              {focused && (
                <Box w={40} h={3} bg={warnaGlobal.primary} borderRadius="$full" />
              )}
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={24}
                color={color}
              />
            </Box>
          ),
        }}
      />
    </Tabs>
  );
}
