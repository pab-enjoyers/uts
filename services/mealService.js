// ========================================
// 🍽️ MEAL SERVICE - TheMealDB API
// Service untuk fetch data dari TheMealDB API (FREE endpoints)
// ========================================

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Generic fetch function dengan error handling
 */
const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: 'Gagal mengambil data. Periksa koneksi internet Anda.',
      details: error.message
    };
  }
};

/**
 * Search meal by name
 * @param {string} query - Nama meal yang dicari
 * @returns {Object} { success, meals: [] }
 */
export const searchMealByName = async (query) => {
  if (!query || query.trim() === '') {
    return { success: true, meals: [] };
  }
  
  const result = await fetchFromAPI(`/search.php?s=${encodeURIComponent(query)}`);
  
  if (result.success) {
    return {
      success: true,
      meals: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * Search meal by first letter
 * @param {string} letter - Huruf pertama (a-z)
 * @returns {Object} { success, meals: [] }
 */
export const searchMealByFirstLetter = async (letter) => {
  const result = await fetchFromAPI(`/search.php?f=${letter}`);
  
  if (result.success) {
    return {
      success: true,
      meals: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * Get meal details by ID
 * @param {string} id - Meal ID
 * @returns {Object} { success, meal: {} }
 */
export const getMealById = async (id) => {
  const result = await fetchFromAPI(`/lookup.php?i=${id}`);
  
  if (result.success) {
    const meals = result.data.meals;
    return {
      success: true,
      meal: meals && meals.length > 0 ? meals[0] : null
    };
  }
  
  return result;
};

/**
 * Get a random meal
 * @returns {Object} { success, meal: {} }
 */
export const getRandomMeal = async () => {
  const result = await fetchFromAPI('/random.php');
  
  if (result.success) {
    const meals = result.data.meals;
    return {
      success: true,
      meal: meals && meals.length > 0 ? meals[0] : null
    };
  }
  
  return result;
};

/**
 * Get multiple random meals
 * Note: FREE API hanya support 1 random meal per call
 * Jadi kita call multiple times
 * @param {number} count - Jumlah random meals (default: 10)
 * @returns {Object} { success, meals: [] }
 */
export const getRandomMeals = async (count = 10) => {
  try {
    const promises = Array.from({ length: count }, () => getRandomMeal());
    const results = await Promise.all(promises);
    
    const meals = results
      .filter(result => result.success && result.meal)
      .map(result => result.meal)
      // Remove duplicates by idMeal
      .filter((meal, index, self) => 
        index === self.findIndex(m => m.idMeal === meal.idMeal)
      );
    
    return {
      success: true,
      meals
    };
  } catch (error) {
    console.error('Error getting random meals:', error);
    return {
      success: false,
      error: 'Gagal mengambil resep acak',
      meals: []
    };
  }
};

/**
 * Get all meal categories
 * @returns {Object} { success, categories: [] }
 */
export const getMealCategories = async () => {
  const result = await fetchFromAPI('/categories.php');
  
  if (result.success) {
    return {
      success: true,
      categories: result.data.categories || []
    };
  }
  
  return result;
};

/**
 * List all categories (names only)
 * @returns {Object} { success, categories: [] }
 */
export const listAllCategories = async () => {
  const result = await fetchFromAPI('/list.php?c=list');
  
  if (result.success) {
    return {
      success: true,
      categories: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * List all areas/countries
 * @returns {Object} { success, areas: [] }
 */
export const listAllAreas = async () => {
  const result = await fetchFromAPI('/list.php?a=list');
  
  if (result.success) {
    return {
      success: true,
      areas: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * List all ingredients
 * @returns {Object} { success, ingredients: [] }
 */
export const listAllIngredients = async () => {
  const result = await fetchFromAPI('/list.php?i=list');
  
  if (result.success) {
    return {
      success: true,
      ingredients: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * Filter meals by category
 * @param {string} category - Category name (e.g., "Seafood", "Vegetarian")
 * @returns {Object} { success, meals: [] }
 */
export const filterByCategory = async (category) => {
  const result = await fetchFromAPI(`/filter.php?c=${encodeURIComponent(category)}`);
  
  if (result.success) {
    return {
      success: true,
      meals: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * Filter meals by area/country
 * @param {string} area - Area name (e.g., "Italian", "Chinese", "Indian")
 * @returns {Object} { success, meals: [] }
 */
export const filterByArea = async (area) => {
  const result = await fetchFromAPI(`/filter.php?a=${encodeURIComponent(area)}`);
  
  if (result.success) {
    return {
      success: true,
      meals: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * Filter meals by main ingredient
 * @param {string} ingredient - Ingredient name (e.g., "chicken", "beef")
 * @returns {Object} { success, meals: [] }
 */
export const filterByIngredient = async (ingredient) => {
  const result = await fetchFromAPI(`/filter.php?i=${encodeURIComponent(ingredient)}`);
  
  if (result.success) {
    return {
      success: true,
      meals: result.data.meals || []
    };
  }
  
  return result;
};

/**
 * Parse ingredients dari meal object
 * TheMealDB API returns ingredients as strIngredient1, strIngredient2, ... strIngredient20
 * @param {Object} meal - Meal object dari API
 * @returns {Array} Array of { ingredient, measure }
 */
export const parseIngredients = (meal) => {
  if (!meal) return [];
  
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      });
    }
  }
  
  return ingredients;
};

/**
 * Parse instructions menjadi array of steps
 * @param {string} instructions - Raw instructions dari API
 * @returns {Array} Array of instruction steps
 */
export const parseInstructions = (instructions) => {
  if (!instructions) return [];
  
  // Split by period, newline, or numbered steps
  const steps = instructions
    .split(/\r\n|\n|\.\s+/)
    .map(step => step.trim())
    .filter(step => step.length > 10); // Filter out very short strings
  
  return steps;
};

/**
 * Get ingredient thumbnail URL
 * @param {string} ingredientName - Name of ingredient
 * @returns {string} URL to ingredient thumbnail
 */
export const getIngredientThumb = (ingredientName) => {
  return `https://www.themealdb.com/images/ingredients/${ingredientName}.png`;
};

/**
 * Helper: Check if meal has video
 * @param {Object} meal - Meal object
 * @returns {boolean}
 */
export const hasVideo = (meal) => {
  return meal && meal.strYoutube && meal.strYoutube.trim() !== '';
};

/**
 * Helper: Get YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
};

/**
 * Helper: Convert meal data untuk local usage
 * Simplify API response ke format yang lebih mudah digunakan
 * @param {Object} apiMeal - Meal object dari API
 * @returns {Object} Simplified meal object
 */
export const convertMealForLocal = (apiMeal) => {
  if (!apiMeal) return null;
  
  return {
    id: apiMeal.idMeal,
    name: apiMeal.strMeal,
    category: apiMeal.strCategory,
    area: apiMeal.strArea,
    instructions: apiMeal.strInstructions,
    thumbnail: apiMeal.strMealThumb,
    tags: apiMeal.strTags ? apiMeal.strTags.split(',').map(t => t.trim()) : [],
    youtube: apiMeal.strYoutube,
    ingredients: parseIngredients(apiMeal),
    source: apiMeal.strSource,
  };
};
