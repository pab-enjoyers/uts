import React from 'react';
import { useRouter } from 'expo-router';
import { Box, VStack, Heading, Text, Button, ButtonText } from '@gluestack-ui/themed';

export default function SyihabTab() {
  const router = useRouter();

  return (
    <Box flex={1} bg="$white" p="$5">
      <VStack space="lg">
        <Heading size="2xl" color="$red500">Syihab Section</Heading>
        <Text>Pilih screen yang ingin dikunjungi:</Text>
        
        <Button bg="$red500" onPress={() => router.push('/syihab/screen1')}>
          <ButtonText>Screen 1</ButtonText>
        </Button>
        <Button bg="$red500" onPress={() => router.push('/syihab/screen2')}>
          <ButtonText>Screen 2</ButtonText>
        </Button>
        <Button bg="$red500" onPress={() => router.push('/syihab/screen3')}>
          <ButtonText>Screen 3</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
