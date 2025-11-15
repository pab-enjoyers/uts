import React from 'react';
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="syihab/splash" options={{ headerShown: false }} />
        <Stack.Screen name="syihab/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="greek-salad-detail"
          options={{
            headerShown: true,         // mau pake header default biar ada tombol back
            title: 'Classic Greek Salad',
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
