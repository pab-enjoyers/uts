// ========================================
// 🧪 API TEST SCREEN (DEVELOPMENT ONLY)
// Temporary screen untuk testing API integration
// DELETE sebelum production/APK generation
// ========================================

import React, { useState } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { Container, CustomButton, Card, colors } from '../styles';
import { VStack, HStack, Heading, Text, Divider } from '@gluestack-ui/themed';
import { 
  searchMealByName, 
  getRandomMeals, 
  getMealCategories,
  getMealById,
  filterByCategory,
  parseIngredients
} from '../services/mealService';
import { useAuth } from '../context/AuthContext';
import { 
  addBookmark, 
  getBookmarks, 
  removeBookmark,
  getBookmarkCount 
} from '../services/userService';

export default function TestAPIScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (testName, success, data, duration) => {
    setResults(prev => [{
      id: Date.now(),
      name: testName,
      success,
      duration,
      timestamp: new Date().toLocaleTimeString(),
      data: typeof data === 'string' ? data : JSON.stringify(data, null, 2).substring(0, 300)
    }, ...prev]);
  };

  const runTest = async (testName, testFn) => {
    setLoading(true);
    const start = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - start;
      addResult(testName, result.success, result, duration);
    } catch (error) {
      const duration = Date.now() - start;
      addResult(testName, false, error.message, duration);
    }
    
    setLoading(false);
  };

  // Test 1: Search Meals
  const testSearch = () => runTest(
    '🔍 Search "chicken"',
    async () => {
      const result = await searchMealByName('chicken');
      if (result.success) {
        return {
          success: true,
          message: `Found ${result.meals.length} meals`,
          sample: result.meals.slice(0, 2).map(m => m.strMeal)
        };
      }
      return result;
    }
  );

  // Test 2: Random Meals
  const testRandom = () => runTest(
    '🎲 Get 5 Random Meals',
    async () => {
      const result = await getRandomMeals(5);
      if (result.success) {
        return {
          success: true,
          message: `Got ${result.meals.length} random meals`,
          sample: result.meals.map(m => `${m.strMeal} (${m.strCategory})`)
        };
      }
      return result;
    }
  );

  // Test 3: Categories
  const testCategories = () => runTest(
    '📂 Get Categories',
    async () => {
      const result = await getMealCategories();
      if (result.success) {
        return {
          success: true,
          message: `Found ${result.categories.length} categories`,
          sample: result.categories.slice(0, 5).map(c => c.strCategory)
        };
      }
      return result;
    }
  );

  // Test 4: Meal Details
  const testMealDetails = () => runTest(
    '📋 Get Meal Details (ID: 52772)',
    async () => {
      const result = await getMealById('52772');
      if (result.success && result.meal) {
        const ingredients = parseIngredients(result.meal);
        return {
          success: true,
          meal: result.meal.strMeal,
          category: result.meal.strCategory,
          area: result.meal.strArea,
          ingredients: ingredients.length
        };
      }
      return result;
    }
  );

  // Test 5: Filter by Category
  const testFilterCategory = () => runTest(
    '🍰 Filter by "Dessert"',
    async () => {
      const result = await filterByCategory('Dessert');
      if (result.success) {
        return {
          success: true,
          message: `Found ${result.meals.length} desserts`,
          sample: result.meals.slice(0, 3).map(m => m.strMeal)
        };
      }
      return result;
    }
  );

  // Test 6: Add Bookmark (needs auth)
  const testAddBookmark = () => {
    if (!user) {
      addResult('🔖 Add Bookmark', false, 'User not logged in', 0);
      return;
    }

    runTest(
      '🔖 Add Bookmark',
      async () => {
        const testMeal = {
          idMeal: '52772',
          strMeal: 'Teriyaki Chicken Casserole',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
          strCategory: 'Chicken',
          strArea: 'Japanese'
        };
        
        const result = await addBookmark(user.uid, testMeal);
        return result;
      }
    );
  };

  // Test 7: Get Bookmarks (needs auth)
  const testGetBookmarks = () => {
    if (!user) {
      addResult('📚 Get Bookmarks', false, 'User not logged in', 0);
      return;
    }

    runTest(
      '📚 Get Bookmarks',
      async () => {
        const result = await getBookmarks(user.uid);
        if (result.success) {
          return {
            success: true,
            count: result.bookmarks.length,
            bookmarks: result.bookmarks.slice(0, 3).map(b => b.mealName)
          };
        }
        return result;
      }
    );
  };

  // Test 8: Bookmark Count (needs auth)
  const testBookmarkCount = () => {
    if (!user) {
      addResult('🔢 Bookmark Count', false, 'User not logged in', 0);
      return;
    }

    runTest(
      '🔢 Bookmark Count',
      async () => {
        const result = await getBookmarkCount(user.uid);
        return result;
      }
    );
  };

  return (
    <Container>
      <RNScrollView showsVerticalScrollIndicator={false}>
        <VStack space="lg" p="$4" pb="$10">
          {/* Header */}
          <VStack space="sm">
            <Heading size="2xl">🧪 API Testing</Heading>
            <Text color="$coolGray600">
              Test TheMealDB API & Firebase Integration
            </Text>
            {user && (
              <Text fontSize="$sm" color="$green600">
                ✅ Logged in as: {user.email}
              </Text>
            )}
          </VStack>

          <Divider />

          {/* API Tests */}
          <VStack space="md">
            <Heading size="lg">TheMealDB API Tests</Heading>
            
            <HStack space="sm" flexWrap="wrap">
              <CustomButton 
                onPress={testSearch}
                isLoading={loading}
                size="sm"
                sx={{ flex: 1, minWidth: 150 }}
              >
                Search
              </CustomButton>
              
              <CustomButton 
                onPress={testRandom}
                isLoading={loading}
                size="sm"
                sx={{ flex: 1, minWidth: 150 }}
              >
                Random
              </CustomButton>
            </HStack>

            <HStack space="sm" flexWrap="wrap">
              <CustomButton 
                onPress={testCategories}
                isLoading={loading}
                size="sm"
                sx={{ flex: 1, minWidth: 150 }}
              >
                Categories
              </CustomButton>
              
              <CustomButton 
                onPress={testMealDetails}
                isLoading={loading}
                size="sm"
                sx={{ flex: 1, minWidth: 150 }}
              >
                Meal Details
              </CustomButton>
            </HStack>

            <CustomButton 
              onPress={testFilterCategory}
              isLoading={loading}
              size="sm"
              variant="outline"
            >
              Filter Dessert
            </CustomButton>
          </VStack>

          <Divider />

          {/* Firebase Tests */}
          <VStack space="md">
            <Heading size="lg">Firebase Bookmark Tests</Heading>
            
            <HStack space="sm" flexWrap="wrap">
              <CustomButton 
                onPress={testAddBookmark}
                isLoading={loading}
                size="sm"
                colorScheme="amber"
                sx={{ flex: 1, minWidth: 150 }}
                isDisabled={!user}
              >
                Add Bookmark
              </CustomButton>
              
              <CustomButton 
                onPress={testGetBookmarks}
                isLoading={loading}
                size="sm"
                colorScheme="amber"
                sx={{ flex: 1, minWidth: 150 }}
                isDisabled={!user}
              >
                Get Bookmarks
              </CustomButton>
            </HStack>

            <CustomButton 
              onPress={testBookmarkCount}
              isLoading={loading}
              size="sm"
              variant="outline"
              colorScheme="amber"
              isDisabled={!user}
            >
              Bookmark Count
            </CustomButton>

            {!user && (
              <Text fontSize="$sm" color="$orange600" textAlign="center">
                ⚠️ Login required for bookmark tests
              </Text>
            )}
          </VStack>

          <Divider />

          {/* Clear Results */}
          <CustomButton 
            onPress={() => setResults([])}
            variant="outline"
            colorScheme="red"
            size="sm"
          >
            Clear All Results
          </CustomButton>

          {/* Results Display */}
          {results.length > 0 && (
            <VStack space="md" mt="$4">
              <Heading size="md">Test Results ({results.length})</Heading>
              
              {results.map((result) => (
                <Card 
                  key={result.id} 
                  variant="outlined" 
                  p="$3"
                  bg={result.success ? '$green50' : '$red50'}
                >
                  <VStack space="xs">
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontWeight="$bold" fontSize="$sm">
                        {result.name}
                      </Text>
                      <Text fontSize="$xs" color="$coolGray600">
                        {result.timestamp}
                      </Text>
                    </HStack>
                    
                    <HStack space="sm" alignItems="center">
                      <Text 
                        color={result.success ? '$green700' : '$red700'}
                        fontWeight="$semibold"
                        fontSize="$sm"
                      >
                        {result.success ? '✅ Success' : '❌ Failed'}
                      </Text>
                      
                      {result.duration && (
                        <Text fontSize="$xs" color="$coolGray600">
                          • {result.duration}ms
                        </Text>
                      )}
                    </HStack>
                    
                    {result.data && (
                      <Text 
                        fontSize="$xs" 
                        color="$coolGray700"
                        fontFamily="$mono"
                      >
                        {result.data}
                      </Text>
                    )}
                  </VStack>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </RNScrollView>
    </Container>
  );
}
