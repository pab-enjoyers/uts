import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  Box,
  VStack,
  Text,
  Heading,
  Spinner,
} from "@gluestack-ui/themed";
import { Container, warnaGlobal, spacing } from "../../styles";

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
        {/* Logo/Icon */}
        <Box
          bg={warnaGlobal.primary}
          p="$8"
          borderRadius="$full"
          w={140}
          h={140}
          justifyContent="center"
          alignItems="center"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
        >
          <Text fontSize={64}>🍳</Text>
        </Box>

        {/* App Title */}
        <VStack space="xs" alignItems="center" mt="$4">
          <Heading 
            size="3xl" 
            color={warnaGlobal.primary}
            fontWeight="$bold"
          >
            Resep App
          </Heading>
          <Text 
            size="md" 
            color={warnaGlobal.accent}
            fontWeight="$medium"
          >
            Kelompok 67
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
