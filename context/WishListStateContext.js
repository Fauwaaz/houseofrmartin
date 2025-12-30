import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Use lazy initialization to avoid SSR issues
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishlist");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Sync to localStorage whenever wishlist changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = (item) => {
    setWishlist(prev => {
      if (!prev.find(i => i.productId === item.productId && i.variationId === item.variationId)) {
        return [...prev, item];
      }
      return prev;
    });
    toast.success("Add to wishlist",{duration:1000});
  };

  const removeFromWishlist = (productId, variationId) => {
    setWishlist(prev => prev.filter(i => !(i.productId === productId && i.variationId === variationId)));
    toast.success("Remove from wishlist",{duration:1000});
  };

  const isInWishlist = (productId, variationId) => {
    return wishlist.some(i => i.productId === productId && i.variationId === variationId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);