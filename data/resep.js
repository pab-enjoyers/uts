// ========================================
// 📦 RECIPES DATA
// GAWE DATA DUMMY RESEP
// ========================================

export const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Indian" },
  { id: 3, name: "Italian" },
  { id: 4, name: "Asian" },
  { id: 5, name: "Chinese" },
];

export const featuredRecipes = [
  {
    id: 1,
    name: "Classic Greek Salad",
    image: "🥗",
    rating: 4.5,
    time: "15 Mins",
    bgColor: "$coolGray100",
    category: "Italian",
  },
  {
    id: 2,
    name: "Crunchy Nut Coleslaw",
    image: "🥙",
    rating: 3.5,
    time: "10 Mins",
    bgColor: "$warmGray100",
    category: "Asian",
  },
  {
    id: 3,
    name: "Sushi Roll Special",
    image: "🍣",
    rating: 4.8,
    time: "25 Mins",
    bgColor: "$red50",
    category: "Asian",
  },
  {
    id: 4,
    name: "Spicy Ramen Bowl",
    image: "🍜",
    rating: 4.2,
    time: "20 Mins",
    bgColor: "$orange50",
    category: "Asian",
  },
  {
    id: 5,
    name: "Butter Chicken Curry",
    image: "🍛",
    rating: 4.7,
    time: "30 Mins",
    bgColor: "$yellow50",
    category: "Indian",
  },
  {
    id: 6,
    name: "Kung Pao Chicken",
    image: "🥘",
    rating: 4.3,
    time: "25 Mins",
    bgColor: "$orange100",
    category: "Chinese",
  },
];

export const popularRecipes = [
  {
    id: 1,
    name: "Steak with tomato sauce",
    author: "By James Milner",
    rating: 5,
    time: "20 mins",
    image: "🥩",
    category: "Italian",
  },
  {
    id: 2,
    name: "Pilaf sweet with chicken",
    author: "By Fuad Gedhangan",
    rating: 4,
    time: "30 mins",
    image: "🍚",
    category: "Asian",
  },
  {
    id: 3,
    name: "Grilled Salmon Teriyaki",
    author: "By Mike Chen",
    rating: 5,
    time: "25 mins",
    image: "🐟",
    category: "Asian",
  },
  {
    id: 4,
    name: "Pasta Carbonara Classic",
    author: "By Sofia Romano",
    rating: 4,
    time: "15 mins",
    image: "🍝",
    category: "Italian",
  },
  {
    id: 5,
    name: "Korean BBQ Tacos",
    author: "By David Kim",
    rating: 5,
    time: "35 mins",
    image: "🌮",
    category: "Asian",
  },
  {
    id: 6,
    name: "Tandoori Chicken",
    author: "By Raj Patel",
    rating: 5,
    time: "40 mins",
    image: "🍗",
    category: "Indian",
  },
  {
    id: 7,
    name: "Sweet and Sour Pork",
    author: "By Li Wei",
    rating: 4,
    time: "30 mins",
    image: "🍖",
    category: "Chinese",
  },
];

export const recipeDetails = {
  "Spicy chicken burger with French fries": {
    description:
      "Burger ayam pedas yang juicy dengan kentang goreng renyah. Cocok untuk makan siang atau makan malam yang mengenyangkan.",
    bahans: [
      { icon: "🍅", name: "Tomatos", amount: "500g" },
      { icon: "🥬", name: "Cabbage", amount: "300g" },
      { icon: "🌮", name: "Taco", amount: "300g" },
      { icon: "🍞", name: "Slice Bread", amount: "300g" },
    ],
    steps: [
      "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
      "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
      "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
    ],
  },
  "Classic Greek Salad": {
    description:
      "Salad khas Yunani yang segar dengan tomat, timun, paprika, zaitun, dan keju feta.",
    bahans: [
      { icon: "🍅", name: "Tomatos", amount: "500g" },
      { icon: "🥒", name: "Cucumber", amount: "300g" },
      { icon: "🧀", name: "Feta Cheese", amount: "100g" },
      { icon: "🫒", name: "Olives", amount: "150g" },
    ],
    steps: [
      "Siapkan semua sayuran: potong tomat, timun, paprika, dan iris tipis bawang merah.",
      "Masukkan semua sayuran ke dalam mangkuk besar, tambahkan zaitun hitam.",
      "Tambahkan potongan keju feta di atas sayuran.",
      "Dalam mangkuk kecil, campurkan minyak zaitun, air lemon, oregano, garam, dan lada. Aduk rata hingga menjadi dressing.",
      "Tuang dressing ke atas salad, lalu aduk perlahan agar sayuran tidak hancur.",
      "Sajikan segera sebagai hidangan pembuka atau pendamping.",
    ],
  },
  "Crunchy Nut Coleslaw": {
    description:
      "Coleslaw renyah dengan kacang dan saus creamy yang segar.",
    bahans: [
      { icon: "🥬", name: "Cabbage", amount: "400g" },
      { icon: "🥕", name: "Carrot", amount: "200g" },
      { icon: "🥜", name: "Peanuts", amount: "100g" },
      { icon: "🍋", name: "Lemon", amount: "2 pcs" },
    ],
    steps: [
      "Iris halus kubis dan parut wortel.",
      "Sangrai kacang hingga harum dan cincang kasar.",
      "Campurkan mayones, yogurt, lemon, garam, dan merica untuk dressing.",
      "Aduk semua bahan dengan dressing hingga rata.",
      "Dinginkan di kulkas 30 menit sebelum disajikan.",
    ],
  },
  "Sushi Roll Special": {
    description:
      "Sushi roll premium dengan salmon segar dan alpukat.",
    bahans: [
      { icon: "🍚", name: "Sushi Rice", amount: "300g" },
      { icon: "🐟", name: "Salmon", amount: "200g" },
      { icon: "🥑", name: "Avocado", amount: "2 pcs" },
      { icon: "🥒", name: "Cucumber", amount: "1 pc" },
    ],
    steps: [
      "Masak nasi sushi dan tambahkan cuka sushi, dinginkan.",
      "Potong salmon, alpukat, dan timun memanjang.",
      "Letakkan nori di atas tikar bambu, ratakan nasi tipis.",
      "Tambahkan isian di tengah, gulung dengan rapat.",
      "Potong roll menjadi 8 bagian dengan pisau tajam.",
      "Sajikan dengan wasabi, kecap asin, dan jahe.",
    ],
  },
};
