import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { formatNPR, type Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  buyNow: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "omsun_daraz_shopping_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper function to check if user is logged in
  const checkUserLoggedIn = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const storedUser = localStorage.getItem("omsun_auth_user");
      return !!storedUser && JSON.parse(storedUser) !== null;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // ADD TO CART WITH AUTH GUARD
  const addToCart = (product: Product, quantity = 1, openDrawer = true) => {
    const isLoggedIn = checkUserLoggedIn();

    if (!isLoggedIn) {
      toast.error("Account Login Required", {
        description: "Please sign in or create an account to add items to your cart.",
      });
      setTimeout(() => {
        window.location.href = "/auth?mode=register";
      }, 400);
      return;
    }

    // User is logged in -> Execute Daraz Cart mechanism
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99),
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    toast.success(`${quantity}× ${product.name} added to cart`, {
      description: `Subtotal: ${formatNPR(product.price * quantity)}`,
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  // BUY NOW WITH AUTH GUARD
  const buyNow = (product: Product, quantity = 1) => {
    const isLoggedIn = checkUserLoggedIn();

    if (!isLoggedIn) {
      toast.error("Account Login Required", {
        description: "Please sign in or create an account to proceed to express checkout.",
      });
      setTimeout(() => {
        window.location.href = "/auth?mode=register";
      }, 400);
      return;
    }

    // User is logged in -> Add & redirect to Checkout
    addToCart(product, quantity, false);
    window.location.href = "/protected/checkout";
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
