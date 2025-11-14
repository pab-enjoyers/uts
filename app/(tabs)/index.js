import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Heading,
  ScrollView,
  Pressable
} from '@gluestack-ui/themed';
import { colors, spacing, memberConfigs, cardStyles } from '../../styles';

export default function HomeScreen() {
  // State (sesuai requirement soal 1C)
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();

  const teamMembers = [
    { id: 'syihab', name: memberConfigs.syihab.name, color: memberConfigs.syihab.color },
    { id: 'angela', name: memberConfigs.angela.name, color: memberConfigs.angela.color },
    { id: 'deru', name: memberConfigs.deru.name, color: memberConfigs.deru.color },
    { id: 'najma', name: memberConfigs.najma.name, color: memberConfigs.najma.color }
  ];

  return (
    <ScrollView bg="$coolGray100">
      <VStack space="lg" p={spacing.lg}>
        {/* Header Card */}
        <Box 
          {...cardStyles.default}
        >
          <Heading size="2xl" color="$coolGray800" mb="$2">
           PAB ENJOYERS
          </Heading>
          {/* <Text size="md" color="$coolGray600">
            Kelompok: 4 Anggota × 3 Views
          </Text> */}
        </Box>

        {/* Team Members Navigation */}
        <Box bg="$white" p={spacing.lg} borderRadius="$lg">
          <Heading size="lg" color="$coolGray800" mb={spacing.md}>
            Anggota Kelompok
          </Heading>
          <VStack space="md">
            {teamMembers.map((member) => (
              <Pressable
                key={member.id}
                onPress={() => {
                  setActiveSection(member.name);
                  router.push(`/${member.id}/screen1`);
                }}
                bg={member.color}
                p={spacing.md}
                borderRadius="$md"
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Text size="md" fontWeight="$semibold" color="$white">
                    {member.name}
                  </Text>
                  <Text size="sm" color="$white" opacity={0.8}>
                    3 Screens →
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </Box>

        {/* Instructions Card */}
        <Box 
          bg="$amber50" 
          p={spacing.md} 
          borderRadius="$md"
          borderLeftWidth={4}
          borderLeftColor="$amber500"
        >
          <Text size="md" fontWeight="$semibold" color="$amber800" mb="$2">
            💡 Quotes Random
          </Text>
          <Text size="sm" color="$amber800" lineHeight="$lg">
            Kita tak bisa memahat gunung dan menghanguskan hutan, jadi manfaatkan yang ada. Yang penting bukan kekuatan kita, tapi tekad dan hasrat.” - Suki
          </Text>
        </Box>
      </VStack>
    </ScrollView>
  );
}
