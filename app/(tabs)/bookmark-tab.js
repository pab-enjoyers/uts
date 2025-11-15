import React from 'react';
import { Box, VStack, Heading, Text } from '@gluestack-ui/themed';

export default function DeruTab() {
  return (
    <Box flex={1} bg="$white" p="$5" pb="$24">
      <VStack space="lg">
        <Heading size="2xl" color="$blue500">Najma Punya</Heading>
        <Text>ini najma</Text>
      </VStack>
    </Box>
  );
}
