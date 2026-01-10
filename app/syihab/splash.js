import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { Image } from "react-native";
import {
  Box,
  VStack,
  Text,
  Heading,
  Spinner,
} from "@gluestack-ui/themed";
import { Container, warnaGlobal, spacing } from "../../styles";

// Logo app
const APP_LOGO = 'https://media.discordapp.net/attachments/1353606414383448065/1459527535414218753/Screenshot_2026-01-10_020147-removebg-preview.png?ex=69639a71&is=696248f1&hm=e411cbfbd3b2c81dd88a894c677cea60cdcb90f3ebcbb129657cdeed1926fcba&=&format=webp&quality=lossless';

export default function SplashScreen() {
  // iki loading state (Props & State)
  const [loading, setLoading] = useState(true);

  // Auto redirect setelah 3 detik ke Onboarding
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      router.replace('/syihab/onboarding');
    }, 3000);

    // Cleanup timeout
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container bg={warnaGlobal.light}>
      <VStack 
        flex={1} 
        justifyContent="center" 
        alignItems="center"
        space="2xl"
        px="$6"
      >
        {/* Logo App */}
        <Box
          w={180}
          h={180}
          justifyContent="center"
          alignItems="center"
        >
          <Image
            source={{ uri: APP_LOGO }}
            style={{ width: 180, height: 180, resizeMode: 'contain' }}
          />
        </Box>

        {/* App Title */}
        <VStack space="xs" alignItems="center" mt="$4">
          <Heading 
            size="3xl" 
            color={warnaGlobal.primary}
            fontWeight="$bold"
          >
            Gudang Resep
          </Heading>
          <Text 
            size="md" 
            color={warnaGlobal.accent}
            fontWeight="$medium"
          >
            Kelompok 4 PAB IS-05-02
          </Text>
        </VStack>

        {/* Loading Indicator */}
        {loading && (
          <VStack space="sm" alignItems="center" mt="$8">
            <Spinner size="large" color={warnaGlobal.primary} />
            <Text 
              size="sm" 
              color={warnaGlobal.accent}
              mt="$2"
            >
              Loading...
            </Text>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
