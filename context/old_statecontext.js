import { createContext, useContext, useEffect, useState } from "react";
import { getLocalCart, getLocalValues } from "../utils/utils";
import { pushEvent } from "../utils/dataLayer";
import { createEventPayloads } from "../utils/dataLayerPayloads";
import { EVENT_TYPES } from "../utils/dataLayerEvents";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(getLocalCart("cartItems", []));
  const [totalPrice, setTotalPrice] = useState(getLocalValues("total", 0));
  const [totalQuantities, setTotalQuantities] = useState(getLocalValues("quantities", 0));
  const [qty, setQty] = useState(getLocalValues("quantity", 1));
  const [wishlist, setWishlist] = useState([]);

  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const applyCoupon = (couponData) => {
    if (!couponData) {
      setCoupon(null);
      setDiscountAmount(0);
      return;
    }

    let discount = 0;
    if (couponData.discount_type === "percent") {
      discount = (totalPrice * parseFloat(couponData.amount)) / 100;
    } else if (couponData.discount_type === "fixed_cart") {
      discount = parseFloat(couponData.amount);
    }

    setCoupon(couponData);
    setDiscountAmount(discount);
  };

  // 🗑 Remove coupon
  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
  };

  // 🔄 Auto recalc discount on cart change
  useEffect(() => {
    if (!coupon || cartItems.length === 0) {
      setDiscountAmount(0);
      return;
    }

    let discount = 0;
    if (coupon.discount_type === "percent") {
      discount = (totalPrice * parseFloat(coupon.amount)) / 100;
    } else if (coupon.discount_type === "fixed_cart") {
      discount = parseFloat(coupon.amount);
    }

    setDiscountAmount(discount);
  }, [cartItems, totalPrice, coupon]);

  // Wishlist
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const exists = wishlist.find((p) => p.id === product.id);
    if (exists) setWishlist(wishlist.filter((p) => p.id !== product.id));
    else setWishlist([...wishlist, product]);
  };

  const isInWishlist = (productId) => wishlist.some((p) => p.id === productId);

  // CART HANDLERS
  const onAdd = (product, quantity) => {
    const productInCart = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color &&
        item.slug === product.slug
    );

    pushEvent(EVENT_TYPES.ADD_TO_CART, createEventPayloads.addToCart(product));

    setTotalPrice((prev) => prev + product.price * quantity);
    setTotalQuantities((prev) => prev + quantity);

    if (productInCart) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id &&
            item.size === product.size &&
            item.color === product.color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const onRemove = (product) => {
    const found = cartItems.find((item) => item.id === product.id);
    const newCart = cartItems.filter((item) => item.id !== product.id);

    setTotalPrice((prev) => prev - found.price * found.quantity);
    setTotalQuantities((prev) => prev - found.quantity);
    setCartItems(newCart);
  };

  const toggleCartItemQuantity = (id, action) => {
    const found = cartItems.find((item) => item.id === id);
    if (!found) return;

    const updated = cartItems.map((item) =>
      item.id === id
        ? {
          ...item,
          quantity:
            action === "inc"
              ? item.quantity + 1
              : item.quantity > 1
                ? item.quantity - 1
                : 1,
        }
        : item
    );

    setCartItems(updated);
    setTotalPrice((prev) =>
      action === "inc" ? prev + found.price : prev - found.price
    );
    setTotalQuantities((prev) => (action === "inc" ? prev + 1 : prev - 1));
  };

  const incQty = () => setQty((prev) => prev + 1);
  const decQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem("total", totalPrice);
    localStorage.setItem("quantities", totalQuantities);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems, totalPrice, totalQuantities]);

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,        // ✅ add setter
        totalPrice,
        setTotalPrice,       // ✅ add setter
        totalQuantities,
        setTotalQuantities,  // ✅ add setter
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);