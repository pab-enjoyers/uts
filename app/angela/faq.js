import React from 'react';
import { Container, warnaGlobal, AccordionItem } from '../../styles';
import { Ionicons } from '@expo/vector-icons';
import { faqData } from '../../data/faq';
import { router } from 'expo-router';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Pressable,
} from '@gluestack-ui/themed';

export default function FAQPage() {
  return (
    <Container scrollable bg="$white" padding="$0">
      <VStack space="md" mt="$12" pb="$6">
        {/* Header dengan Back Button */}
        <Box px="$5" pt="$5" pb="$3">
          <HStack alignItems="center" space="md" mb="$4">
            <Pressable onPress={() => router.back()}>
              <Box
                w={40}
                h={40}
                borderRadius="$full"
                bg={warnaGlobal.gray100}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={warnaGlobal.gray700Hex}
                />
              </Box>
            </Pressable>
            <Heading size="xl" fontWeight="$bold" flex={1}>
              FAQ
            </Heading>
          </HStack>

          <Text fontSize="$sm" color={warnaGlobal.gray500}>
            Pertanyaan yang sering diajukan:
          </Text>
        </Box>

        {/* FAQ List - Accordion */}
        <VStack space="sm" px="$5">
          {faqData.map((faq) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </VStack>

        {/* Help Section */}
        <Box px="$5" mt="$4">
          <Box
            bg={warnaGlobal.light}
            borderRadius="$lg"
            p="$4"
            borderWidth={1}
            borderColor={warnaGlobal.secondary}
          >
            <HStack space="md" alignItems="center">
              <Box
                bg={warnaGlobal.primary}
                w={48}
                h={48}
                borderRadius="$full"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="white"
                />
              </Box>
              <VStack flex={1}>
                <Text fontSize="$sm" fontWeight="$bold" color={warnaGlobal.gray900}>
                  Masih butuh bantuan?
                </Text>
                <Text fontSize="$xs" color={warnaGlobal.gray600}>
                  Hubungi tim support kami
                </Text>
              </VStack>
              <Pressable>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={warnaGlobal.gray600Hex}
                />
              </Pressable>
            </HStack>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
