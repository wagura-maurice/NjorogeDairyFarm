// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartContextState {
  cart: ProductItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextState>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
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

  const updateQuantity = (productId, newQuantity) => {
    // If the new quantity is less than 0, we don't do anything
    if (newQuantity < 0) return;
  
    // If the new quantity is 0, we remove the item from the cart
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
  
    // Otherwise, we update the quantity in the cart
    setCart((currentCart) => {
      return currentCart.map((item) => {
        if (item.id === productId) {
          // Ensure the quantity is not less than 0
          const updatedQuantity = Math.max(newQuantity, 0);
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
    });
  };  

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: (item.quantity || 0) + 1 } : item,
      ),
    );
  };
  
  const decreaseQuantity = (productId) => {
    setCart((currentCart) => {
      const newCart = currentCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = (item.quantity || 0) - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean); // This will remove any `null` items
  
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]); // Clears the cart by setting it to an empty array
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, increaseQuantity, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;