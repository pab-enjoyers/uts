import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, ScrollView } from '@gluestack-ui/themed';
import { colors, spacing } from '../theme';

/**
 * CONTAINER COMPONENT
 * Wrapper utama untuk semua screen
 * Features: SafeAreaView, padding konsisten, background color
 * 
 * Props:
 * - children: konten di dalam container
 * - bg: background color (default: white)
 * - padding: custom padding (default: md)
 * - scrollable: enable scroll (default: false)
 */
export const Container = ({ 
  children, 
  bg = colors.background,
  padding = spacing.md,
  scrollable = false 
}) => {
  const content = (
    <Box flex={1} bg={bg} p={padding}>
      {children}
    </Box>
  );

  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          flex={1}
          bg={bg}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {content}
    </SafeAreaView>
  );
};
