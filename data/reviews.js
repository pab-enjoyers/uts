export const reviewsData = {
  "Classic Greek Salad": [
    {
      id: 1,
      userId: "user1",
      userName: "Laura Wilson",
      userAvatar: require("../assets/profile/puan-maharani_43.jpeg"),
      rating: 5,
      comment:
        "Resep yang luar biasa! Kombinasi sayuran segar dan keju feta sangat pas. Keluarga saya menyukainya!",
      date: "2024-11-10",
      helpful: 24,
      location: "Lagos, Nigeria",
    },
    {
      id: 2,
      userId: "user2",
      userName: "John Bahlal",
      userAvatar: require("../assets/profile/6900cd55dace1.jpg"),
      rating: 4,
      comment:
        "Salad yang enak dan menyegarkan. Saya menambahkan sedikit zaitun ekstra dan hasilnya makin nikmat.",
      date: "2024-11-08",
      helpful: 15,
      location: "New York, Amerika Serikat",
    },
    {
      id: 3,
      userId: "user3",
      userName: "Maria Nugraha",
      userAvatar: require("../assets/profile/fgfas31dsa-sadasfd.jpeg"),
      rating: 5,
      comment:
        "Sederhana tapi sangat lezat! Cocok untuk hari-hari panas. Dressing-nya luar biasa.",
      date: "2024-11-05",
      helpful: 32,
      location: "Barcelona, Spanyol",
    },
    {
      id: 4,
      userId: "user4",
      userName: "Mas Brem",
      userAvatar: require("../assets/profile/c2aeb12dfd0a72a43795aa4abf2cf1ec.jpg"),
      rating: 4,
      comment:
        "Resep yang sangat bagus. Saya sarankan menggunakan minyak zaitun berkualitas tinggi untuk hasil terbaik.",
      date: "2024-11-03",
      helpful: 18,
      location: "Dubai, Uni Emirat Arab",
    },
    {
      id: 5,
      userId: "user5",
      userName: "David Brendi",
      userAvatar: require("../assets/profile/David_Brendi.jpeg"),
      rating: 5,
      comment:
        "Sekarang ini jadi resep salad andalan saya! Sangat mudah dibuat dan selalu berhasil sempurna.",
      date: "2024-11-01",
      helpful: 27,
      location: "Singapura",
    },
  ],

  "Crunchy Nut Coleslaw": [
    {
      id: 6,
      userId: "user6",
      userName: "Elham Frankenstein",
      userAvatar: require("../assets/profile/IMG_2077.jpeg"),
      rating: 4,
      comment: "Sangat renyah dan lezat! Kacangnya memberi tekstur yang bagus.",
      date: "2024-11-09",
      helpful: 12,
      location: "London, Inggris",
    },
    {
      id: 7,
      userId: "user7",
      userName: "Joekal",
      userAvatar: require("../assets/profile/channels4_profile.jpg"),
      rating: 5,
      comment:
        "Coleslaw terbaik yang pernah saya buat! Dressing-nya creamy dan sempurna.",
      date: "2024-11-06",
      helpful: 20,
      location: "Sydney, Australia",
    },
  ],

  "Spicy chicken burger with French fries": [
    {
      id: 8,
      userId: "user8",
      userName: "Fuad Gedhangan",
      userAvatar: require("../assets/profile/fbcac9bf-8ddc-4cbb-9157-df2c113dba2d.png"),
      rating: 5,
      comment: "Sangat lezat! Tingkat kepedasannya pas dan kentangnya renyah.",
      date: "2024-11-12",
      helpful: 45,
      location: "Gedhangan Aloha, Malaysia",
    },
    {
      id: 9,
      userId: "user9",
      userName: "Ewing Hade",
      userAvatar: require("../assets/profile/ewinggggg.jpg"),
      rating: 4,
      comment:
        "Burger yang sangat enak! Saya menambahkan saus ekstra dan hasilnya semakin mantap.",
      date: "2024-11-11",
      helpful: 22,
      location: "Seoul, Korea Selatan",
    },
    {
      id: 10,
      userId: "user10",
      userName: "Raffi Ahmad",
      userAvatar: require("../assets/profile/Raffi-Ahmad-2020_(cropped).jpg"),
      rating: 5,
      comment:
        "Resep ini wajib disimpan! Teman-teman saya terus meminta dibuatkan lagi.",
      date: "2024-11-07",
      helpful: 38,
      location: "Toronto, Kanada",
    },
  ],
};

// Fungsi helper untuk mengambil ulasan berdasarkan nama resep
export const getReviewsByResep = (recipeName) => {
  return reviewsData[recipeName] || [];
};

// Fungsi helper untuk menghitung rata-rata rating
export const getAverageRating = (recipeName) => {
  const reviews = getReviewsByResep(recipeName);
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

// Fungsi helper untuk mengambil jumlah total ulasan
export const getTotalReviews = (recipeName) => {
  return getReviewsByResep(recipeName).length;
};
