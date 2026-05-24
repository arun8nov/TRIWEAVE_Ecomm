import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('triweave_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('triweave_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity, selectedColor, selectedSize, customDesign = null) => {
    setCart((prevCart) => {
      // Find if item already exists in cart with identical options
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.value === selectedColor.value &&
          item.selectedSize === selectedSize &&
          (!customDesign || item.customDesignName === customDesign.name)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedColor,
            selectedSize,
            customDesignName: customDesign ? customDesign.name : null,
            customDesignUrl: customDesign ? customDesign.url : null,
          },
        ];
      }
    });
    setIsCartOpen(true); // Automatically open cart sidebar when item is added
  };

  const updateQuantity = (productId, colorValue, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorValue, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId &&
        item.selectedColor.value === colorValue &&
        item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, colorValue, size) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor.value === colorValue &&
            item.selectedSize === size
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
