import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RecipeCard from '../components/recipe/RecipeCard';
import { mockRecipes } from '../data/mockData';

const HomePage: React.FC = () => {
  const featuredRecipes = mockRecipes.filter(recipe => recipe.featured).slice(0, 6);
  const bestsellerRecipes = mockRecipes.filter(recipe => recipe.bestseller).slice(0, 4);

  const stats = [
    { label: 'Premium Recipes', value: '10,000+', icon: '🍳' },
    { label: 'Expert Chefs', value: '500+', icon: '👨‍🍳' },
    { label: 'Happy Customers', value: '50,000+', icon: '⭐' },
    { label: 'Success Rate', value: '98%', icon: '🏆' }
  ];

  const categories = [
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', count: 1200 },
    { name: 'Asian', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop', count: 980 },
    { name: 'French', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop', count: 750 },
    { name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop', count: 650 },
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop', count: 890 },
    { name: 'Mediterranean', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', count: 420 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-gold-50 dark:from-dark-900 dark:via-dark-800 dark:to-primary-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <span>📈</span>
                  <span>Over 50,000 chefs trust us</span>
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold">
                  <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-gold-600 bg-clip-text text-transparent">
                    Master Culinary
                  </span>
                  <br />
                  <span className="text-dark-900 dark:text-white">
                    Excellence
                  </span>
                </h1>
                
                <p className="text-xl text-dark-600 dark:text-dark-300 leading-relaxed max-w-lg">
                  Discover premium recipes from world-class chefs. Transform your cooking with 
                  step-by-step guidance and professional techniques.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  <Link to="/recipes" className="flex items-center">
                    Explore Recipes
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stat.value}
                    </div>
                    <div className="text-dark-600 dark:text-dark-400 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"
                  alt="Premium cooking"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-xl border border-dark-200 dark:border-dark-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">⭐</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-dark-900 dark:text-white">4.9</div>
                      <div className="text-sm text-dark-600 dark:text-dark-400">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
              Explore by Cuisine
            </h2>
            <p className="text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              Discover authentic recipes from around the world, crafted by expert chefs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/recipes?category=${category.name.toLowerCase()}`}
                  className="group block"
                >
                  <Card hover className="text-center p-4">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-dark-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      {category.count} recipes
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20 bg-dark-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
              Featured Recipes
            </h2>
            <p className="text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              Hand-picked premium recipes from our top-rated chefs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              <Link to="/recipes">View All Recipes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
                Bestselling Recipes
              </h2>
              <p className="text-xl text-dark-600 dark:text-dark-300">
                Most popular recipes loved by our community
              </p>
            </div>
            <Link to="/recipes?sort=bestseller">
              <Button variant="ghost">
                View All
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellerRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Ready to Start Cooking?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of home chefs who have transformed their cooking with our premium recipes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg">
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Link to="/register">Sign Up Free</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;