import React from "react";
import { Box, Pressable } from "@gluestack-ui/themed";
import { warnaGlobal } from "../theme";

/**
 * ICON BUTTON COMPONENT
 * Circular button dengan icon (untuk back, more, dll)
 *
 * Props:
 * - icon: React element (icon component)
 * - onPress: function ketika button diklik
 * - size: number ukuran button (default: 40)
 * - bg: background color (default: warnaGlobal.white)
 * - position: object { top, left, right, bottom } untuk absolute positioning
 */
export const IconButton = ({
  icon,
  onPress,
  size = 40,
  bg = warnaGlobal.white,
  position = null,
}) => {
  const positionProps = position
    ? {
        position: "absolute",
        ...position,
      }
    : {};

  return (
    <Pressable
      onPress={onPress}
      {...positionProps}
      bg={bg}
      borderRadius="$full"
      p="$2"
      w={size}
      h={size}
      justifyContent="center"
      alignItems="center"
    >
      {icon}
    </Pressable>
  );
};
