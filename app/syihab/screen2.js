import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Box, 
  VStack,
  Text, 
  Heading,
  ScrollView,
  Input,
  InputField,
  Button,
  ButtonText
} from '@gluestack-ui/themed';

export default function SyihabScreen2() {
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState([]);
  const router = useRouter();

  const handleAddItem = () => {
    if (inputText.trim()) {
      setItems([...items, { id: Date.now(), text: inputText }]);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView bg="$white">
        <VStack space="md" p="$4" pb="$6">
          {/* Header */}
          <Box bg="$red500" p="$5" borderRadius="$md">
            <Heading size="lg" color="$white" mb="$1">
              Syihab - Screen 2
            </Heading>
            <Text size="sm" color="$white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </Box>

          {/* Form Area */}
          <Box bg="$coolGray50" p="$4" borderRadius="$md">
            <Text size="md" color="$coolGray800" mb="$2" fontWeight="$semibold">
              Add Item
            </Text>
            
            <Input mb="$3" size="md">
              <InputField
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type something..."
              />
            </Input>
            
            <Button
              onPress={handleAddItem}
              bg="$red500"
              size="md"
            >
              <ButtonText>Add Item</ButtonText>
            </Button>
          </Box>

          {/* List Items */}
          {items.length > 0 && (
            <VStack space="xs">
              <Text size="sm" color="$coolGray600" mb="$1">Items ({items.length}):</Text>
              {items.map((item) => (
                <Box
                  key={item.id}
                  bg="$coolGray50"
                  p="$3"
                  borderRadius="$sm"
                  borderLeftWidth={3}
                  borderLeftColor="$red500"
                >
                  <Text size="sm" color="$coolGray800">{item.text}</Text>
                </Box>
              ))}
            </VStack>
          )}

          {/* Navigation */}
          <VStack space="sm" mt="$2">
            <Button
              onPress={() => router.push('/syihab/screen3')}
              bg="$red600"
              size="md"
            >
              <ButtonText>Pergi ke Screen 3 →</ButtonText>
            </Button>
            
            <Button
              onPress={() => router.back()}
              bg="$coolGray500"
              size="md"
            >
              <ButtonText>← Kembali ke Screen 1</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
