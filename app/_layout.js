import React from 'react';
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="syihab/screen1" />
        <Stack.Screen name="syihab/screen2" />
        <Stack.Screen name="syihab/screen3" />
      </Stack>
    </GluestackUIProvider>
  );
}
