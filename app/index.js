import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { Box, Spinner, Text, VStack } from "@gluestack-ui/themed";
import { useAuth } from "../context/AuthContext";

export default function InitialRedirect() {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
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

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
