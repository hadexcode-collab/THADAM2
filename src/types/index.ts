export interface Recipe {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  chef: Chef;
  images: string[];
  video?: string;
  rating: number;
  reviewCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  cookingTime: number;
  servings: number;
  cuisine: string;
  dietaryTags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutritionInfo: NutritionInfo;
  createdAt: string;
  updatedAt: string;
  bestseller?: boolean;
  featured?: boolean;
  totalSales: number;
}

export interface Chef {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  rating: number;
  totalRecipes: number;
  totalStudents: number;
  verified: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  notes?: string;
}

export interface Instruction {
  id: string;
  step: number;
  title: string;
  description: string;
  image?: string;
  duration?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'chef' | 'admin';
  purchasedRecipes: string[];
  favoriteRecipes: string[];
  createdAt: string;
}

export interface CartItem {
  recipe: Recipe;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  recipeCount: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  cuisine?: string;
  difficulty?: string;
  maxPrice?: number;
  minRating?: number;
  cookingTime?: number;
  dietary?: string[];
}