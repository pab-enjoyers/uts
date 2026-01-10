import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { Box, Spinner, Text, VStack } from "@gluestack-ui/themed";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InitialRedirect() {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [checking, setChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if "always show onboarding" toggle is ON
        const alwaysShow = await AsyncStorage.getItem('alwaysShowOnboarding');
        
        if (alwaysShow === 'true') {
          // Toggle is ON - always show onboarding
          setShowOnboarding(true);
        } else {
          // Toggle is OFF - check if first time user
          const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
          setShowOnboarding(hasSeenOnboarding !== 'true');
        }
      } catch (error) {
        console.log('Error checking onboarding status:', error);
        setShowOnboarding(false);
      }
      
      await checkAuthStatus();
      setChecking(false);
    };
    
    init();
  }, []);

  // Show loading spinner while checking auth
  if (loading || checking) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white">
        <VStack space="md" alignItems="center">
          <Spinner size="large" color="$red500" />
          <Text color="$textLight500">Memuat...</Text>
        </VStack>
      </Box>
    );
  }

  // Show splash/onboarding if needed
  if (showOnboarding) {
    return <Redirect href="/syihab/splash" />;
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
