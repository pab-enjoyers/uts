import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Box,
  VStack,
  Text,
  Heading,
  ScrollView,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";

export default function SyihabScreen3() {
  const [testResult, setTestResult] = useState('Belum di test');
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView bg="$white">
        <VStack space="md" p="$4" pb="$6">
          {/* Header */}
          <Box bg="$red500" p="$5" borderRadius="$md">
            <Heading size="lg" color="$white" mb="$1">
              Syihab - Screen 3
            </Heading>
            <Text size="sm" color="$white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </Box>

          {/* Testing Area */}
          <Box bg="$coolGray50" p="$4" borderRadius="$md">
            <Text size="md" color="$coolGray800" mb="$2" fontWeight="$semibold">
              Testing Screen
            </Text>
            
            <Box 
              bg="$white" 
              p="$4" 
              borderRadius="$sm"
              borderWidth={1}
              borderColor="$coolGray300"
              mb="$3"
            >
              <Text size="sm" color="$coolGray600" mb="$1">
                Hasil Test:
              </Text>
              <Text size="lg" fontWeight="$bold" color="$coolGray800">
                {testResult}
              </Text>
            </Box>

            <Button
              onPress={() => setTestResult('✅ Test Sukses!')}
              bg="$green600"
              size="md"
              mb="$2"
            >
              <ButtonText>Jalankan Tes</ButtonText>
            </Button>

            <Button
              onPress={() => setTestResult('Belum di test')}
              bg="$coolGray400"
              size="sm"
            >
              <ButtonText>Reset</ButtonText>
            </Button>
          </Box>

          {/* Info */}
          <Box 
            bg="$blue50" 
            p="$3" 
            borderRadius="$sm"
            borderLeftWidth={3}
            borderLeftColor="$blue500"
          >
            <Text size="xs" color="$blue800">
              💡 Iki gawe testing props & state
            </Text>
          </Box>

          {/* Navigation */}
          <VStack space="sm" mt="$2">
            <Button
              onPress={() => router.push("/syihab/screen1")}
              bg="$red600"
              size="md"
            >
              <ButtonText>← Kembali ke Screen 1</ButtonText>
            </Button>

            <Button
              onPress={() => router.push("/")}
              bg="$coolGray500"
              size="md"
            >
              <ButtonText>Home</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
