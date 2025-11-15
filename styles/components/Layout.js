import React from 'react';
import { Box, Heading, VStack, HStack, Text, Divider } from '@gluestack-ui/themed';
import { colors, spacing, borderRadius, typography } from '../theme';

/**
 * SECTION COMPONENT
 * Komponen untuk membuat section dengan title
 * Gunakan untuk membagi konten menjadi bagian-bagian
 * 
 * Props:
 * - title: judul section (required)
 * - subtitle: subjudul section (optional)
 * - children: konten section (required)
 * - action: component untuk action di kanan (optional, contoh: Button "Lihat Semua")
 * - spacing: jarak antar items (default: md)
 * 
 * Contoh penggunaan:
 * <Section title="Data Pengguna" subtitle="Informasi pribadi">
 *   <Text>Nama: John Doe</Text>
 *   <Text>Email: john@example.com</Text>
 * </Section>
 */
export const Section = ({ 
  title, 
  subtitle,
  children, 
  action,
  spacing: spaceProp = spacing.md,
}) => {
  return (
    <Box mb={spacing.lg}>
      {/* Header Section */}
      <HStack 
        justifyContent="space-between" 
        alignItems="center"
        mb={spacing.sm}
      >
        <VStack flex={1}>
          <Heading 
            size={typography.h3.size} 
            fontWeight={typography.h3.fontWeight}
            color={colors.text}
          >
            {title}
          </Heading>
          {subtitle && (
            <Text 
              size={typography.caption.size}
              color={colors.textSecondary}
              mt="$1"
            >
              {subtitle}
            </Text>
          )}
        </VStack>
        {action && <Box>{action}</Box>}
      </HStack>

      {/* Divider */}
      <Divider bg={colors.divider} mb={spacing.sm} />

      {/* Content Section */}
      <VStack space={spaceProp}>
        {children}
      </VStack>
    </Box>
  );
};

/**
 * STATS CARD COMPONENT
 * Komponen untuk menampilkan statistik/angka
 * 
 * Props:
 * - label: label statistik (required)
 * - value: nilai statistik (required)
 * - icon: icon di kiri (optional)
 * - colorScheme: warna tema (default: primary)
 * - trend: 'up' | 'down' | 'neutral' (optional, untuk tanda naik/turun)
 * 
 * Contoh penggunaan:
 * <StatsCard 
 *   label="Total Produk" 
 *   value="125"
 *   colorScheme="syihab"
 * />
 */
export const StatsCard = ({ 
  label, 
  value, 
  icon,
  colorScheme = 'primary',
  trend
}) => {
  const getColor = () => {
    const colorMap = {
      primary: colors.primary,
      syihab: colors.syihab,
      angela: colors.angela,
      deru: colors.deru,
      najma: colors.najma,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
    };
    return colorMap[colorScheme] || colors.primary;
  };

  const themeColor = getColor();

  return (
    <Box
      bg={colors.background}
      p={spacing.md}
      borderRadius={borderRadius.lg}
      borderWidth={1}
      borderColor={colors.border}
      flex={1}
    >
      <HStack space={spacing.sm} alignItems="center">
        {icon && (
          <Box 
            bg={themeColor} 
            p={spacing.sm} 
            borderRadius={borderRadius.md}
          >
            {icon}
          </Box>
        )}
        <VStack flex={1}>
          <Text 
            size={typography.caption.size}
            color={colors.textSecondary}
          >
            {label}
          </Text>
          <HStack space="$2" alignItems="baseline">
            <Heading 
              size={typography.h2.size}
              color={colors.text}
            >
              {value}
            </Heading>
            {trend && (
              <Text 
                size={typography.small.size}
                color={trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </Text>
            )}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

/**
 * EMPTY STATE COMPONENT
 * Komponen untuk menampilkan state kosong
 * 
 * Props:
 * - icon: icon untuk empty state (optional)
 * - title: judul empty state (required)
 * - description: deskripsi (optional)
 * - action: button component untuk action (optional)
 * 
 * Contoh penggunaan:
 * <EmptyState 
 *   title="Belum Ada Data"
 *   description="Silakan tambahkan data baru"
 *   action={<CustomButton title="Tambah Data" onPress={handleAdd} />}
 * />
 */
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <VStack 
      space={spacing.md} 
      alignItems="center" 
      justifyContent="center"
      p={spacing.xl}
    >
      {icon && (
        <Box mb={spacing.sm}>
          {icon}
        </Box>
      )}
      <Heading 
        size={typography.h3.size}
        color={colors.textSecondary}
        textAlign="center"
      >
        {title}
      </Heading>
      {description && (
        <Text 
          size={typography.body.size}
          color={colors.textLight}
          textAlign="center"
        >
          {description}
        </Text>
      )}
      {action && (
        <Box mt={spacing.sm}>
          {action}
        </Box>
      )}
    </VStack>
  );
};
