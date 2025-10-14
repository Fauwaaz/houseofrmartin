"use client";
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Fetch Wishlist on Load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wishlist/v1/get`);
        const data = await res.json();
        setWishlist(data?.products || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId, variationId = null, quantity = 1) => {
    await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wishlist/v1/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, variation_id: variationId, quantity }),
    });
    setWishlist((prev) => [...prev, { product_id: productId, variation_id: variationId }]);
  };

  const removeFromWishlist = async (productId) => {
    await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wishlist/v1/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);