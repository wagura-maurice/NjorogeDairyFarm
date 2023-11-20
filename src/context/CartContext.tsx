// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the product item
interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

// Define the shape of the context state
interface CartContextState {
  cart: ProductItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Create the context with a default value
export const CartContext = createContext<CartContextState>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

// Define the props for the provider
interface CartProviderProps {
  children: ReactNode;
}

// Provider component
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<ProductItem[]>([]);

  const addToCart = (product: ProductItem) => {
    setCart((currentCart) => {
      const productIndex = currentCart.findIndex((item) => item.id === product.id);
      if (productIndex !== -1) {
        // Product exists, update the quantity
        const updatedCart = [...currentCart];
        const existingProduct = updatedCart[productIndex];
        updatedCart[productIndex] = {
          ...existingProduct,
          quantity: (existingProduct.quantity || 0) + 1,
        };
        return updatedCart;
      } else {
        // Product does not exist, add to cart with quantity 1
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
