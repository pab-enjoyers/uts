// ========================================
// 📋 ACCORDION ITEM COMPONENT
// Reusable component untuk FAQ accordion
// ========================================

import React, { useState } from 'react';
import { VStack, Box, Text, Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { warnaGlobal } from '../theme';

export function AccordionItem({ question, answer }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      bg={warnaGlobal.white}
      borderRadius="$lg"
      borderWidth={1}
      borderColor={warnaGlobal.gray200}
      overflow="hidden"
    >
      <Pressable onPress={() => setIsExpanded(!isExpanded)}>
        {({ pressed }) => (
          <Box
            bg={pressed ? warnaGlobal.gray50 : warnaGlobal.white}
            px="$4"
            py="$4"
          >
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text
                fontSize="$sm"
                fontWeight="$semibold"
                color={warnaGlobal.gray900}
                flex={1}
                pr="$3"
              >
                {question}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={warnaGlobal.gray600Hex}
              />
            </Box>
          </Box>
        )}
      </Pressable>

      {isExpanded && (
        <Box
          px="$4"
          pb="$4"
          pt="$1"
          bg={warnaGlobal.gray50}
          borderTopWidth={1}
          borderTopColor={warnaGlobal.gray200}
        >
          <Text
            fontSize="$sm"
            color={warnaGlobal.gray600}
            lineHeight="$lg"
          >
            {answer}
          </Text>
        </Box>
      )}
    </Box>
  );
}
