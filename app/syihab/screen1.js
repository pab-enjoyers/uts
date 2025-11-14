import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  VStack,
  Text,
  Heading,
  ScrollView,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { colors, spacing, buttonStyles } from "../../styles/theme";

export default function SyihabScreen1() {
  // Props & State (sesuai requirement soal 1C)
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState("ready");
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView bg="$white">
        <VStack space="md" p={spacing.md} pb="$6">
          {/* Header */}
          <Box bg={colors.syihab} p={spacing.lg} borderRadius="$md">
            <Heading size="lg" color="$white" mb="$1">
              Syihab - Screen 1
            </Heading>
            <Text size="sm" color="$white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </Box>

          {/* Content Area - Counter */}
          <Box bg="$coolGray50" p={spacing.md} borderRadius="$md">
            <Text size="md" color="$coolGray600" mb="$2">
              Status: {status}
            </Text>
            <Text size="2xl" fontWeight="$bold" color="$coolGray800" mb="$3">
              Counter: {counter}
            </Text>

            <Button
              onPress={() => {
                setCounter(counter + 1);
                setStatus("active");
              }}
              bg={colors.syihab}
              {...buttonStyles.primary}
            >
              <ButtonText>Increment Counter</ButtonText>
            </Button>
          </Box>

          {/* Navigation */}
          <VStack space="sm">
            <Button
              onPress={() => router.push("/syihab/screen2")}
              bg="$red600"
              {...buttonStyles.primary}
            >
              <ButtonText>Pergi ke Screen 2 →</ButtonText>
            </Button>

            <Button 
              onPress={() => router.back()} 
              bg="$coolGray500" 
              {...buttonStyles.primary}
            >
              <ButtonText>← Kembali ke Home</ButtonText>
            </Button>
          </VStack>

          {/* Instructions */}
          <Box
            bg="$amber50"
            p="$3"
            borderRadius="$sm"
            borderLeftWidth={3}
            borderLeftColor="$amber500"
          >
            <Text size="xs" color="$amber800" fontWeight="$semibold" mb="$1">
              📝 INFO:
            </Text>
            <Text size="xs" color="$amber700">
              Ini masi dummy ya gesyak, belom UI fix (under development)
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
