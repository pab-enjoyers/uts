import React from 'react';
import { VStack, Box, Text, Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { warnaGlobal } from '../theme';

export function SettingsDropdown({ isVisible, onClose, onSelect }) {
  if (!isVisible) return null;

  const menuItems = [
    { id: 'faq', label: 'FAQ', icon: 'help-circle-outline' },
    { id: 'akun', label: 'Akun', icon: 'person-outline' },
    { id: 'help', label: 'Help', icon: 'information-circle-outline' },
    { id: 'riwayat', label: 'Riwayat', icon: 'history-outline' },
  ];

  return (
    <>
      {/* Overlay untuk close dropdown ketika klik luar */}
      <Pressable
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={90}
        onPress={onClose}
      />

      {/* Dropdown Menu */}
      <Box
        position="absolute"
        top="$16"
        right="$5"
        zIndex={100}
        bg={warnaGlobal.white}
        borderRadius="$lg"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        shadowRadius={8}
        elevation={5}
        minWidth={160}
        overflow="hidden"
      >
        <VStack>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              {({ pressed }) => (
                <Box
                  bg={pressed ? warnaGlobal.gray50 : warnaGlobal.white}
                  px="$4"
                  py="$3"
                  borderBottomWidth={index < menuItems.length - 1 ? 1 : 0}
                  borderBottomColor={warnaGlobal.gray200}
                >
                  <Box flexDirection="row" alignItems="center" gap="$3">
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={warnaGlobal.gray700Hex}
                    />
                    <Text
                      fontSize="$sm"
                      color={warnaGlobal.gray700}
                      fontWeight="$medium"
                    >
                      {item.label}
                    </Text>
                  </Box>
                </Box>
              )}
            </Pressable>
          ))}
        </VStack>
      </Box>
    </>
  );
}
