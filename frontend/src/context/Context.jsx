import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStorage('nail-shop-cart', []));
  const [wishlist, setWishlist] = useState(() => readStorage('nail-shop-wishlist', []));

  useEffect(() => {
    window.localStorage.setItem('nail-shop-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem('nail-shop-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    const safeQuantity = Number(quantity) > 0 ? Number(quantity) : 1;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => Number(item.id) === Number(product.id));

      if (existingItem) {
        return currentItems.map((item) =>
          Number(item.id) === Number(product.id)
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item,
        );
      }

      return [...currentItems, { ...product, id: Number(product.id), quantity: safeQuantity }];
    });
  };

  const updateQuantity = (productId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          Number(item.id) === Number(productId)
            ? { ...item, quantity: Math.max(0, Number(nextQuantity)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => Number(item.id) !== Number(productId)));
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (product) => {
    const productId = Number(product.id);

    setWishlist((currentWishlist) =>
      currentWishlist.includes(productId)
        ? currentWishlist.filter((id) => id !== productId)
        : [...currentWishlist, productId],
    );
  };

  const isWishlisted = (productId) => wishlist.includes(Number(productId));

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity), 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cartItems],
  );

  const shipping = subtotal > 999 || cartItems.length === 0 ? 0 : 149;
  const total = subtotal + shipping;

  const value = {
    cartItems,
    wishlist,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    itemCount,
    subtotal,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider.');
  }

  return context;
}

export default CartContext;