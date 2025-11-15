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
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
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
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Disimpan",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Center Home Button with Floating Circle */}
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Box
              position="absolute"
              top={-30}
              alignItems="center"
              justifyContent="center"
              w={70}
              h={70}
            >
              <Box
                w={65}
                h={65}
                borderRadius="$full"
                alignItems="center"
                justifyContent="center"
                bg={
                  focused
                    ? warnaGlobal.primary
                    : warnaGlobal.secondary
                }
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={10}
                borderWidth={5}
                borderColor="$white"
                transform={[{ scale: focused ? 1.05 : 1 }]}
              >
                <Ionicons
                  name={focused ? "book" : "book-outline"}
                  size={30}
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
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pengaturan-tab"
        options={{
          title: "Pengaturan",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
