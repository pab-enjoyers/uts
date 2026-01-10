import React from "react";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="auth/edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="syihab/splash" options={{ headerShown: false }} />
          <Stack.Screen
            name="syihab/onboarding"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="angela/detail" options={{ headerShown: false }} />
          <Stack.Screen
            name="najma/artikelDetail"
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="angela/notifikasi" options={{ headerShown: false }} /> */}
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
