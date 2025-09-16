import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Heart, ShoppingCart } from 'lucide-react';
import { Recipe } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index = 0 }) => {
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  
  const isInCart = items.some(item => item.recipe.id === recipe.id);
  const isPurchased = user?.purchasedRecipes.includes(recipe.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart && !isPurchased) {
      addToCart(recipe);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card hover className="group overflow-hidden h-full">
        <Link to={`/recipe/${recipe.id}`}>
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={recipe.images[0]}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {recipe.bestseller && (
                <Badge variant="gold" size="sm">Bestseller</Badge>
              )}
              {recipe.featured && (
                <Badge variant="primary" size="sm">Featured</Badge>
              )}
            </div>

            {/* Favorite button */}
            <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-dark-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-dark-800 transition-colors">
              <Heart className="w-4 h-4 text-dark-600 dark:text-dark-300" />
            </button>

            {/* Difficulty badge */}
            <div className="absolute bottom-4 left-4">
              <Badge 
                variant={recipe.difficulty === 'Beginner' ? 'success' : recipe.difficulty === 'Intermediate' ? 'warning' : 'error'}
                size="sm"
              >
                {recipe.difficulty}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Chef info */}
            <div className="flex items-center space-x-2 mb-3">
              <img
                src={recipe.chef.avatar}
                alt={recipe.chef.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-dark-600 dark:text-dark-400">{recipe.chef.name}</span>
              {recipe.chef.verified && (
                <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {recipe.title}
            </h3>

            {/* Description */}
            <p className="text-dark-600 dark:text-dark-400 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-sm text-dark-500 dark:text-dark-400 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime}min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{recipe.rating}</span>
                <span>({recipe.reviewCount})</span>
              </div>
            </div>

            {/* Price and action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-dark-900 dark:text-white">
                  ${recipe.price}
                </span>
                {recipe.originalPrice && (
                  <span className="text-sm text-dark-500 dark:text-dark-400 line-through">
                    ${recipe.originalPrice}
                  </span>
                )}
              </div>
              
              {isPurchased ? (
                <Badge variant="success">Owned</Badge>
              ) : (
                <Button
                  size="sm"
                  variant={isInCart ? "secondary" : "primary"}
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      In Cart
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
              )}
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;