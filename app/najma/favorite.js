// app/najma/favorite.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function FavoriteItem({ title, category }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
      }}
      onPress={() =>
        router.push({
          pathname: "/najma/favoriteDetail",
          params: { title, category },
        })
      }
    >
      <Text style={{ fontSize: 18 }}>{title}</Text>
      <Text style={{ fontSize: 14, color: "gray" }}>{category}</Text>
    </TouchableOpacity>
  );
}
