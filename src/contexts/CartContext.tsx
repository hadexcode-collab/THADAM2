import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (recipe: Recipe) => void;
  removeFromCart: (recipeId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('recipehub_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recipehub_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (recipe: Recipe) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.recipe.id === recipe.id);
      if (existingItem) {
        return prevItems; // Recipe already in cart
      }
      return [...prevItems, { recipe, quantity: 1 }];
    });
  };

  const removeFromCart = (recipeId: string) => {
    setItems(prevItems => prevItems.filter(item => item.recipe.id !== recipeId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.recipe.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};