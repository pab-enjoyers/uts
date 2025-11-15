// app/(tabs)/bookmark-tab.js
import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import FavoriteItem from "../najma/favorite";

export default function BookmarkTab() {
  const [favorites, setFavorites] = useState([
    { id: "1", title: "Resep Nasi Goreng", category: "Indonesia" },
    { id: "2", title: "Sushi Roll", category: "Jepang" },
    { id: "3", title: "Tteokbokki", category: "Korea" },
    { id: "4", title: "Pasta Carbonara", category: "Italia" },
    { id: "5", title: "Pad Thai", category: "Thailand" },
  ]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Favorite / Disimpan
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteItem title={item.title} category={item.category} />
        )}
      />
    </View>
  );
}
