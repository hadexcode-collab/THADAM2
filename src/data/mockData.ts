import { Recipe, Chef, Category } from '../types';

export const mockChefs: Chef[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Michelin-starred chef specializing in authentic Italian cuisine with 20+ years of experience.',
    specialties: ['Italian', 'Mediterranean', 'Pasta'],
    rating: 4.9,
    totalRecipes: 45,
    totalStudents: 12500,
    verified: true
  },
  {
    id: '2',
    name: 'Sakura Tanaka',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Traditional Japanese chef and sushi master, trained in Tokyo for over 15 years.',
    specialties: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.8,
    totalRecipes: 38,
    totalStudents: 9800,
    verified: true
  },
  {
    id: '3',
    name: 'Pierre Dubois',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'French pastry chef and culinary instructor from Le Cordon Bleu.',
    specialties: ['French', 'Pastry', 'Desserts'],
    rating: 4.9,
    totalRecipes: 52,
    totalStudents: 15200,
    verified: true
  }
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Authentic Carbonara with Guanciale',
    description: 'Learn the traditional Roman carbonara recipe with perfectly creamy eggs, crispy guanciale, and aged Pecorino Romano cheese.',
    price: 24.99,
    originalPrice: 34.99,
    chef: mockChefs[0],
    images: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600&h=400&fit=crop'
    ],
    video: 'https://example.com/video1.mp4',
    rating: 4.9,
    reviewCount: 1247,
    difficulty: 'Intermediate',
    cookingTime: 25,
    servings: 4,
    cuisine: 'Italian',
    dietaryTags: ['Gluten-Free Option'],
    ingredients: [
      { id: '1', name: 'Spaghetti', quantity: '400g', notes: 'High-quality bronze-cut pasta' },
      { id: '2', name: 'Guanciale', quantity: '150g', notes: 'Diced into small cubes' },
      { id: '3', name: 'Pecorino Romano', quantity: '100g', notes: 'Freshly grated' },
      { id: '4', name: 'Eggs', quantity: '3 large', notes: 'Room temperature' },
      { id: '5', name: 'Black pepper', quantity: '1 tsp', notes: 'Freshly ground' }
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        title: 'Prepare the guanciale',
        description: 'Cut guanciale into small cubes and render slowly in a large pan until crispy.',
        duration: 8
      },
      {
        id: '2',
        step: 2,
        title: 'Cook the pasta',
        description: 'Boil spaghetti in salted water until al dente, reserve pasta water.',
        duration: 10
      },
      {
        id: '3',
        step: 3,
        title: 'Make the sauce',
        description: 'Whisk eggs with grated Pecorino and black pepper in a large bowl.',
        duration: 3
      },
      {
        id: '4',
        step: 4,
        title: 'Combine everything',
        description: 'Toss hot pasta with guanciale, then quickly mix with egg mixture off heat.',
        duration: 4
      }
    ],
    nutritionInfo: {
      calories: 520,
      protein: 22,
      carbs: 58,
      fat: 24,
      fiber: 3,
      sugar: 2
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    bestseller: true,
    featured: true,
    totalSales: 3247
  },
  {
    id: '2',
    title: 'Perfect Sushi Rice & California Roll',
    description: 'Master the art of sushi rice preparation and learn to make perfect California rolls with fresh ingredients.',
    price: 29.99,
    chef: mockChefs[1],
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 892,
    difficulty: 'Beginner',
    cookingTime: 45,
    servings: 6,
    cuisine: 'Japanese',
    dietaryTags: ['Gluten-Free', 'Pescatarian'],
    ingredients: [
      { id: '1', name: 'Sushi rice', quantity: '2 cups', notes: 'Short-grain Japanese rice' },
      { id: '2', name: 'Rice vinegar', quantity: '1/4 cup' },
      { id: '3', name: 'Nori sheets', quantity: '6 sheets' },
      { id: '4', name: 'Imitation crab', quantity: '200g' },
      { id: '5', name: 'Avocado', quantity: '2 ripe' },
      { id: '6', name: 'Cucumber', quantity: '1 large' }
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        title: 'Prepare sushi rice',
        description: 'Wash and cook rice, then season with vinegar mixture while warm.',
        duration: 25
      },
      {
        id: '2',
        step: 2,
        title: 'Prepare fillings',
        description: 'Slice avocado and cucumber, prepare crab sticks.',
        duration: 10
      },
      {
        id: '3',
        step: 3,
        title: 'Roll the sushi',
        description: 'Place nori on bamboo mat, add rice and fillings, roll tightly.',
        duration: 10
      }
    ],
    nutritionInfo: {
      calories: 280,
      protein: 12,
      carbs: 45,
      fat: 8,
      fiber: 4,
      sugar: 6
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    featured: true,
    totalSales: 1892
  },
  {
    id: '3',
    title: 'Classic French Croissants',
    description: 'Learn the traditional lamination technique to create buttery, flaky croissants with perfect layers.',
    price: 39.99,
    originalPrice: 49.99,
    chef: mockChefs[2],
    images: [
      'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 654,
    difficulty: 'Advanced',
    cookingTime: 180,
    servings: 12,
    cuisine: 'French',
    dietaryTags: ['Vegetarian'],
    ingredients: [
      { id: '1', name: 'Bread flour', quantity: '500g', notes: 'High-protein flour' },
      { id: '2', name: 'Butter', quantity: '300g', notes: 'European-style, cold' },
      { id: '3', name: 'Milk', quantity: '250ml', notes: 'Whole milk, warm' },
      { id: '4', name: 'Sugar', quantity: '50g' },
      { id: '5', name: 'Salt', quantity: '10g' },
      { id: '6', name: 'Yeast', quantity: '7g', notes: 'Active dry yeast' }
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        title: 'Make the dough',
        description: 'Mix flour, milk, sugar, salt, and yeast into a smooth dough.',
        duration: 15
      },
      {
        id: '2',
        step: 2,
        title: 'Prepare butter block',
        description: 'Pound butter into a flat rectangle and chill.',
        duration: 20
      },
      {
        id: '3',
        step: 3,
        title: 'Lamination process',
        description: 'Encase butter in dough and perform series of folds with chilling.',
        duration: 120
      },
      {
        id: '4',
        step: 4,
        title: 'Shape and bake',
        description: 'Cut triangles, shape croissants, proof, and bake until golden.',
        duration: 25
      }
    ],
    nutritionInfo: {
      calories: 320,
      protein: 8,
      carbs: 35,
      fat: 18,
      fiber: 2,
      sugar: 4
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    bestseller: true,
    totalSales: 987
  },
  {
    id: '4',
    title: 'Spicy Thai Pad Thai',
    description: 'Authentic street-style Pad Thai with the perfect balance of sweet, sour, and spicy flavors.',
    price: 19.99,
    chef: mockChefs[1],
    images: [
      'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=600&h=400&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 1156,
    difficulty: 'Intermediate',
    cookingTime: 30,
    servings: 4,
    cuisine: 'Thai',
    dietaryTags: ['Gluten-Free', 'Vegan Option'],
    ingredients: [
      { id: '1', name: 'Rice noodles', quantity: '300g', notes: 'Flat rice noodles' },
      { id: '2', name: 'Shrimp', quantity: '200g', notes: 'Large, peeled' },
      { id: '3', name: 'Bean sprouts', quantity: '150g' },
      { id: '4', name: 'Tamarind paste', quantity: '3 tbsp' },
      { id: '5', name: 'Fish sauce', quantity: '2 tbsp' },
      { id: '6', name: 'Palm sugar', quantity: '2 tbsp' }
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        title: 'Soak noodles',
        description: 'Soak rice noodles in warm water until soft but still firm.',
        duration: 15
      },
      {
        id: '2',
        step: 2,
        title: 'Make sauce',
        description: 'Mix tamarind paste, fish sauce, and palm sugar.',
        duration: 5
      },
      {
        id: '3',
        step: 3,
        title: 'Stir-fry',
        description: 'Cook shrimp, add noodles and sauce, toss with bean sprouts.',
        duration: 10
      }
    ],
    nutritionInfo: {
      calories: 420,
      protein: 18,
      carbs: 65,
      fat: 12,
      fiber: 3,
      sugar: 8
    },
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    bestseller: true,
    featured: true,
    totalSales: 2156
  },
  {
    id: '5',
    title: 'Homemade Pizza Margherita',
    description: 'Create authentic Neapolitan-style pizza with homemade dough, San Marzano tomatoes, and fresh mozzarella.',
    price: 22.99,
    chef: mockChefs[0],
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 2341,
    difficulty: 'Intermediate',
    cookingTime: 90,
    servings: 4,
    cuisine: 'Italian',
    dietaryTags: ['Vegetarian'],
    ingredients: [
      { id: '1', name: '00 Flour', quantity: '400g', notes: 'Italian tipo 00 flour' },
      { id: '2', name: 'San Marzano tomatoes', quantity: '400g', notes: 'Crushed' },
      { id: '3', name: 'Fresh mozzarella', quantity: '250g', notes: 'Buffalo mozzarella preferred' },
      { id: '4', name: 'Fresh basil', quantity: '20 leaves' },
      { id: '5', name: 'Extra virgin olive oil', quantity: '3 tbsp' }
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        title: 'Make pizza dough',
        description: 'Mix flour, water, salt, and yeast. Knead until smooth and elastic.',
        duration: 20
      },
      {
        id: '2',
        step: 2,
        title: 'First rise',
        description: 'Let dough rise in oiled bowl for 1-2 hours until doubled.',
        duration: 60
      },
      {
        id: '3',
        step: 3,
        title: 'Shape and top',
        description: 'Stretch dough, add tomatoes, mozzarella, and basil.',
        duration: 10
      }
    ],
    nutritionInfo: {
      calories: 380,
      protein: 16,
      carbs: 48,
      fat: 14,
      fiber: 3,
      sugar: 5
    },
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    featured: true,
    totalSales: 3421
  },
  {
    id: '6',
    title: 'Chocolate Soufflé',
    description: 'Master the delicate art of chocolate soufflé with this foolproof technique for perfect rise every time.',
    price: 34.99,
    chef: mockChefs[2],
    images: [
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 423,
    difficulty: 'Advanced',
    cookingTime: 45,
    servings: 6,
    cuisine: 'French',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    ingredients: [
      { id: '1', name: 'Dark chocolate', quantity: '200g', notes: '70% cocoa' },
      { id: '2', name: 'Eggs', quantity: '6 large', notes: 'Separated' },
      { id: '3', name: 'Sugar', quantity: '100g' },
      { id: '4', name: 'Butter', quantity: '30g' },
      { id: '5', name: 'Vanilla extract', quantity: '1 tsp' }
    ],
    instructions: [
      {
        id: '1',
        step: 1,
        title: 'Prepare ramekins',
        description: 'Butter and sugar ramekins, preheat oven to 375°F.',
        duration: 10
      },
      {
        id: '2',
        step: 2,
        title: 'Melt chocolate',
        description: 'Melt chocolate with butter, mix in egg yolks.',
        duration: 10
      },
      {
        id: '3',
        step: 3,
        title: 'Whip whites',
        description: 'Beat egg whites to soft peaks, gradually add sugar.',
        duration: 8
      },
      {
        id: '4',
        step: 4,
        title: 'Fold and bake',
        description: 'Gently fold whites into chocolate base, bake immediately.',
        duration: 17
      }
    ],
    nutritionInfo: {
      calories: 285,
      protein: 8,
      carbs: 28,
      fat: 16,
      fiber: 4,
      sugar: 24
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    totalSales: 756
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Italian',
    slug: 'italian',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    recipeCount: 1200
  },
  {
    id: '2',
    name: 'Asian',
    slug: 'asian',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
    recipeCount: 980
  },
  {
    id: '3',
    name: 'French',
    slug: 'french',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
    recipeCount: 750
  },
  {
    id: '4',
    name: 'Mexican',
    slug: 'mexican',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
    recipeCount: 650
  },
  {
    id: '5',
    name: 'Indian',
    slug: 'indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
    recipeCount: 890
  },
  {
    id: '6',
    name: 'Mediterranean',
    slug: 'mediterranean',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop',
    recipeCount: 420
  }
];