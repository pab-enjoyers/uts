import React from 'react';
import { Container, warnaGlobalMerah } from '../../styles';
import { VStack, Heading, Text, Button, ButtonText } from '@gluestack-ui/themed';
import { router } from 'expo-router';

export default function SyihabTab() {
  return (
    <Container scrollable>
      <VStack space="lg" p="$5">
        <VStack space="sm" alignItems="center" mb="$4">
          <Text fontSize={60}>👨‍🍳</Text>
          <Heading size="xl" color={warnaGlobalMerah.primary}>
            Syihab's Section
          </Heading>
          <Text color="$coolGray600" textAlign="center">
            3 Screen Demo: Splash, Onboarding, Homepage
          </Text>
        </VStack>

        <Button 
          size="lg" 
          bg={warnaGlobalMerah.primary}
          onPress={() => router.push('/syihab/splash')}
        >
          <ButtonText>🚀 Lihat Demo Screens</ButtonText>
        </Button>
      </VStack>
    </Container>
  );
}
