// Data dummy untuk artikel, sesuai instruksi soal (data dummy saja)
export const articles = [
  {
    id: 1,
    title: "Tips Memasak Nasi Goreng yang Sempurna",
    description:
      "Pelajari cara membuat nasi goreng yang gurih dan renyah. Panduan langkah demi langkah untuk pemula.",
    content:
      "Nasi goreng adalah hidangan klasik Indonesia. Mulai dengan nasi dingin, tambahkan telur, sayuran, dan bumbu. Aduk cepat di wajan panas. Sajikan hangat!",
    image: "🍳", // Emoji sebagai placeholder gambar
    category: "Tips Memasak",
    author: "Chef Angela",
    date: "2023-10-01",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Resep Salad Sehat untuk Diet",
    description:
      "Salad segar dengan bahan-bahan alami. Cocok untuk pola makan sehat sehari-hari.",
    content:
      "Campurkan sayuran hijau, tomat, dan dressing yogurt. Tambahkan protein seperti ayam atau kacang. Nikmati sebagai makan siang ringan!",
    image: "🥗",
    category: "Resep Sehat",
    author: "Chef Najma",
    date: "2023-10-02",
    readTime: "3 min read",
  },
  {
    id: 3,
    title: "Sejarah Kuliner Asia Tenggara",
    description:
      "Eksplorasi asal-usul hidangan populer dari Asia Tenggara dan pengaruhnya pada dunia.",
    content:
      "Dari pad thai Thailand hingga rendang Indonesia, kuliner Asia Tenggara kaya akan rempah. Pelajari evolusinya dari zaman kuno hingga modern.",
    image: "🌏",
    category: "Edukasi",
    author: "Chef Syihab",
    date: "2023-10-03",
    readTime: "7 min read",
  },
  {
    id: 4,
    title: "Cara Membuat Kue Tradisional",
    description: "Panduan membuat kue bolu yang lembut dan enak tanpa oven.",
    content:
      "Gunakan tepung, telur, dan gula. Aduk rata, kukus selama 30 menit. Hasilnya empuk dan cocok untuk acara keluarga.",
    image: "🍰",
    category: "Resep Tradisional",
    author: "Chef Deru",
    date: "2023-10-04",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Manfaat Makanan Organik",
    description: "Mengapa memilih bahan organik untuk kesehatan Anda?",
    content:
      "Makanan organik bebas pestisida, lebih bergizi, dan ramah lingkungan. Mulai dari sayuran hingga daging, pilihlah yang alami.",
    image: "🌱",
    category: "Kesehatan",
    author: "Chef Angela",
    date: "2023-10-05",
    readTime: "6 min read",
  },
];

// Kategori artikel untuk filter (opsional, untuk state filter)
export const articleCategories = [
  { id: 1, name: "All" },
  { id: 2, name: "Tips Memasak" },
  { id: 3, name: "Resep Sehat" },
  { id: 4, name: "Edukasi" },
  { id: 5, name: "Resep Tradisional" },
  { id: 6, name: "Kesehatan" },
];
