import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getLocalCart, getLocalValues } from "../utils/utils";
import { pushEvent } from "../utils/dataLayer";
import { createEventPayloads } from "../utils/dataLayerPayloads";
import { EVENT_TYPES } from "../utils/dataLayerEvents";

const Context = createContext();

/* =========================
   CART KEY (CRITICAL)
========================= */
const cartKey = (item) =>
  `${item.id}_${item.size || ""}_${item.color || ""}_${item.slug || ""}`;

export const StateContext = ({ children }) => {
  /* ================= CORE ================= */
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(getLocalCart("cartItems", []));
  const [totalPrice, setTotalPrice] = useState(getLocalValues("total", 0));
  const [totalQuantities, setTotalQuantities] = useState(
    getLocalValues("quantities", 0)
  );
  const [qty, setQty] = useState(getLocalValues("quantity", 1));

  /* ================= USER ================= */
  const [user, setUser] = useState(null);
  const hydrated = useRef(false);

  /* ================= WISHLIST ================= */
  const [wishlist, setWishlist] = useState([]);

  /* ================= COUPON ================= */
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const serializeCart = (items) =>
    items.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: Number(item.quantity), // ✅ ALWAYS quantity
      price: Number(item.price),
      size: item.size,
      color: item.color,
      sku: item.sku,
      image: item.image,
      slug: item.slug,
    }));


  /* ======================================================
     USER FETCH (NO RELOAD REQUIRED)
  ====================================================== */
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.user?.id) return;

        const u = {
          id: d.user.id,
          email: d.user.email,
          phone: d.user.meta?.billing_phone || null,
        };

        localStorage.setItem("user", JSON.stringify(u));
        setUser(u);
      });
  }, []);

  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      setUser(JSON.parse(raw));
    };

    window.addEventListener("user-ready", handler);
    handler(); // initial

    return () => window.removeEventListener("user-ready", handler);
  }, []);


  /* ======================================================
     CART HYDRATION (RUNS ONCE AFTER USER)
  ====================================================== */
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!user?.id) return;
    if (hydratedRef.current) return;

    hydratedRef.current = true;

    fetch(`/api/cart/get?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data?.cart?.length) return;

        const normalized = data.cart.map(item => ({
          id: item.product_id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity || item.qty || 1),
          size: item.size,
          color: item.color,
          sku: item.sku,
          image: item.image,
          slug: item.slug,
        }));

        setCartItems(normalized);
      });
  }, [user]);

  const saveTimeout = useRef(null);

  useEffect(() => {
    if (!user?.id || !user?.phone) return;

    // Clear previous save
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      fetch("/api/cart/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          phone: user.phone,
          cartItems: serializeCart(cartItems),
          status: cartItems.length ? "active" : "empty",
        }),
      }).catch(err =>
        console.error("❌ Cart DB sync failed", err)
      );
    }, 800);

    return () => clearTimeout(saveTimeout.current);
  }, [cartItems, user]);



  /* ======================================================
     ADD TO CART (SAFE + UNIQUE)
  ====================================================== */
  const onAdd = (product, quantity) => {
    const q = Number(quantity);
    if (!q || q <= 0) return;

    pushEvent(EVENT_TYPES.ADD_TO_CART, createEventPayloads.addToCart(product));

    setCartItems((prev) => {
      const key = cartKey(product);
      const existing = prev.find((i) => cartKey(i) === key);

      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key
            ? { ...i, quantity: i.quantity + q }
            : i
        );
      }

      return [...prev, { ...product, quantity: q }];
    });
  };

  /* ======================================================
     REMOVE SINGLE ITEM
  ====================================================== */
  const onRemove = (item) => {
    const key = cartKey(item);
    if (!key) return;

    setCartItems(prev => prev.filter(i => cartKey(i) !== key));
  };


  /* ======================================================
     INC / DEC SINGLE ITEM
  ====================================================== */
  const toggleCartItemQuantity = (item, action) => {
    const key = cartKey(item);
    if (!key) return;

    setCartItems(prev =>
      prev.map(i => {
        if (cartKey(i) !== key) return i;

        return {
          ...i,
          quantity:
            action === "inc"
              ? i.quantity + 1
              : Math.max(i.quantity - 1, 1),
        };
      })
    );
  };

  /* ======================================================
     DERIVED TOTALS (SINGLE SOURCE OF TRUTH)
  ====================================================== */
  useEffect(() => {
    let total = 0;
    let qtySum = 0;

    cartItems.forEach((i) => {
      total += Number(i.price) * Number(i.quantity);
      qtySum += Number(i.quantity);
    });

    setTotalPrice(total);
    setTotalQuantities(qtySum);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("total", total);
    localStorage.setItem("quantities", qtySum);
  }, [cartItems]);

  /* ======================================================
     COUPON LOGIC (UNCHANGED, BUT SAFE)
  ====================================================== */
  const applyCoupon = (couponData) => {
    if (!couponData) {
      setCoupon(null);
      setDiscountAmount(0);
      return;
    }

    let discount = 0;
    const code = couponData.code.toLowerCase();

    if (code === "b1g1") {
      const prices = [];
      cartItems.forEach((i) => {
        for (let x = 0; x < i.quantity; x++) prices.push(i.price);
      });
      prices.sort((a, b) => a - b);
      discount = prices.slice(0, Math.floor(prices.length / 2)).reduce((a, b) => a + b, 0);
    } else if (couponData.discount_type === "percent") {
      discount = (totalPrice * Number(couponData.amount)) / 100;
    } else {
      discount = Number(couponData.amount);
    }

    setCoupon(couponData);
    setDiscountAmount(discount);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
  };

  /* ======================================================
     WISHLIST (UNCHANGED)
  ====================================================== */
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isInWishlist = (id) => wishlist.some((p) => p.id === id);

  /* ======================================================
     PROVIDER
  ====================================================== */
  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        setCartItems,          
        totalPrice,
        setTotalPrice,         
        totalQuantities,
        setTotalQuantities,    
        qty,
        incQty: () => setQty((q) => q + 1),
        decQty: () => setQty((q) => Math.max(q - 1, 1)),
        onAdd,
        onRemove,
        toggleCartItemQuantity,
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