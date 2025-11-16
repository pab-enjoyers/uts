// app/najma/favoriteDetail.js
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function FavoriteDetail() {
  const params = useLocalSearchParams();
  const { title, category } = params; // ambil dari query params

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Kategori: {category}
      </Text>
      <Text style={{ fontSize: 16 }}>
        Ini adalah detail resep {title}. Di sini kamu bisa menampilkan bahan,
        cara memasak, atau deskripsi lainnya.
      </Text>
    </View>
  );
}
