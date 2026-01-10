import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'react-native';
import { 
  Box, 
  VStack,
  HStack,
  Text, 
  Heading,
  Button,
  ButtonText,
  Pressable
} from '@gluestack-ui/themed';
import { Container, warnaGlobal, spacing } from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Logo app
const APP_LOGO = 'https://media.discordapp.net/attachments/1353606414383448065/1459527535414218753/Screenshot_2026-01-10_020147-removebg-preview.png?ex=69639a71&is=696248f1&hm=e411cbfbd3b2c81dd88a894c677cea60cdcb90f3ebcbb129657cdeed1926fcba&=&format=webp&quality=lossless';

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: 'Ribuan Resep Makanan',
      description: 'Temukan resep dari berbagai negara di seluruh dunia',
      icon: '🍲'
    },
    {
      id: 2,
      title: 'Kategori Lengkap',
      description: 'Jepang, Korea, China, Indonesia, Western, dan lainnya',
      icon: '🌏'
    },
    {
      id: 3,
      title: 'Mudah Dicari',
      description: 'Cari resep berdasarkan nama atau bahan yang kamu punya',
      icon: '🔍'
    }
  ];

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Slide terakhir, save status dan navigate ke login
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/auth/login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/auth/login');
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Container bg="$white">
      <VStack flex={1} justifyContent="space-between" p="$6" py="$8">
        {/* Skip Button */}
        <HStack justifyContent="flex-end" mb="$4">
          <Pressable onPress={handleSkip} p="$2">
            <Text 
              size="md" 
              color={warnaGlobal.primary}
              fontWeight="$semibold"
            >
              Lewati →
            </Text>
          </Pressable>
        </HStack>

        {/* Slide Content */}
        <VStack flex={1} justifyContent="center" alignItems="center" space="xl" px="$4">
          {/* Icon */}
          <Box mb="$4">
            <Text fontSize={100}>{currentSlideData.icon}</Text>
          </Box>

          {/* Title */}
          <Heading 
            size="2xl" 
            color={warnaGlobal.primary}
            textAlign="center"
            mb="$3"
          >
            {currentSlideData.title}
          </Heading>

          {/* Description */}
          <Text 
            size="md" 
            color="$coolGray600"
            textAlign="center"
            px="$6"
            lineHeight="$xl"
          >
            {currentSlideData.description}
          </Text>
        </VStack>

        {/* Indicators & Button */}
        <VStack space="xl" mb="$4">
          {/* Dot Indicators */}
          <HStack justifyContent="center" space="sm">
            {slides.map((_, index) => (
              <Box
                key={index}
                w={currentSlide === index ? 28 : 8}
                h={8}
                borderRadius="$full"
                bg={currentSlide === index ? warnaGlobal.primary : warnaGlobal.gray300}
              />
            ))}
          </HStack>

          {/* Next/Finish Button */}
          <Button
            size="lg"
            bg={warnaGlobal.primary}
            onPress={handleNext}
            h="$12"
            borderRadius="$lg"
          >
            <ButtonText fontWeight="$semibold" fontSize="$md">
              {currentSlide === slides.length - 1 ? 'Mulai Sekarang' : 'Berikutnya'}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
