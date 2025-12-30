import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { BackgroundAnimation, CartAnimation } from "../animations";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/Cart.module.css";
import CartItem from "./CartItem";
import { CheckCircle, Tag, X } from "lucide-react";
import PayButton from "./PayButton";
import { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const {
    showCart,
    setShowCart,
    totalQuantities,
    cartItems,
    toggleCartItemQuantity,
    onRemove,
    totalPrice,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useStateContext();

  const [user, setUser] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  const [shippingCharge, setShippingCharge] = useState(15);

  useEffect(() => {
    axios.get("/api/user/profile").then(({ data }) => {
      if (data.success && data.user) {
        const profile = data.user;
        const meta = profile.meta || {};
        setUser({
          name: `${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim(),
          email: profile.user_email ?? "guest@example.com",
          phone: meta.billing_phone ?? "0000000000",
          address: meta.billing_address_1 ?? "N/A",
          city: meta.billing_city ?? "N/A",
          state: meta.billing_state ?? "N/A",
          zip: meta.billing_postcode ?? "0000",
          country: meta.billing_country ?? "AE",
        });
      }
    });
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return setError("Please enter a coupon code.");
    try {
      setIsApplying(true);
      setError("");
      const { data } = await axios.post("/api/woo/validate-coupon",
        { code: couponCode.trim() },
      );
      if (!data.success || !data.coupon) throw new Error();
      applyCoupon(data.coupon);
    } catch {
      setError("Invalid or expired coupon.");
      removeCoupon();
    } finally {
      setIsApplying(false);
    }
  };

  const finalTotal = Math.max(totalPrice - discountAmount, 0);
  useEffect(() => setShippingCharge(finalTotal < 100 ? 15 : 0), [finalTotal]);

  return (
    <AnimatePresence>
      {showCart && (
        <>
          <motion.div
            className={styles.background}
            variants={BackgroundAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setShowCart(false)}
          />
          <motion.div
            className={styles.cart}
            variants={CartAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center justify-between px-2">
              <div className={styles.heading}>
                <h3>Your Cart</h3>
                <span>({totalQuantities} items)</span>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className={styles.empty}>
                <FiShoppingBag />
                <h3>Your shopping bag is empty</h3>
                <Link href="/products">Continue Shopping</Link>
              </div>
            ) : (
              <div className={styles.content}>
                <ol className={styles.items}>
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.id}_${item.size || ""}_${item.color || ""}`}
                      item={item}
                      decrease={() => toggleCartItemQuantity(item, "dec")}
                      increase={() => toggleCartItemQuantity(item, "inc")}
                      remove={() => onRemove(item)}
                    />
                  ))}
                </ol>

                {/* Totals */}
                <div className={`${styles.totals} bg-white space-y-2`}>
                  {/* Coupon */}
                  {/* <div className="mt-4 flex flex-col pt-4">
                    <p className="text-sm text-center mb-2 bg-green-100 rounded text-green-700 border border-dashed border-green-500 p-2">Free shipping order above — <span className="price-font px-1" style={{fontSize:"14px"}}>D</span>100</p>
                    {!coupon ? (
                      <>
                        <p className="text-sm flex gap-1 items-center text-black">
                         🔥 Buy 1 Get 1 Free (Just add 2 items to claim your benefit)— Use <Tag size={16} className="animate-pulse" /> B1G1
                        </p>
                        <div className="flex text-sm gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full"
                          />
                          <button
                            disabled={isApplying}
                            onClick={handleApplyCoupon}
                            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
                          >
                            {isApplying ? "Applying..." : "Apply"}
                          </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                      </>
                    ) : (
                      <div className="text-sm flex items-center justify-between bg-green-100 text-green-700 border border-dashed border-green-500 px-3 py-2 rounded-md">
                        <p className="flex items-center">
                          <CheckCircle size={16} className="inline mr-1" /> 🔥 {coupon.code.toUpperCase()} —{" "} Coupon applied
                          {coupon.discount_type === "percent"
                            ? `${coupon.amount}% off`
                            : `AED ${coupon.amount} off`}
                        </p>
                        <button onClick={removeCoupon} className="text-red-600 hover:underline hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    )}
                  </div> */}


                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <h4 style={{ fontSize: "16px" }}>Discount:</h4>
                      <p className="flex items-center"><span className="price-font" style={{ fontSize: "16px" }}>- D</span>&nbsp;{discountAmount.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <h4 style={{ fontSize: "16px" }}>Subtotal:</h4>
                    <p className="flex items-center"><span className="price-font" style={{ fontSize: "16px" }}>+ D</span>&nbsp;{finalTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <h4 style={{ fontSize: "16px" }}>Shipping:</h4>
                    {shippingCharge === 0 ? (
                      <span className="text-green-600" style={{ fontSize: "14px" }}>Free Shipping</span>
                    ) : (
                      <p className="flex items-center"><span className="price-font" style={{ fontSize: "16px" }}>+ D</span>&nbsp;{shippingCharge.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex justify-between font-semibold border-t mt-2 pt-2">
                    <h4 className="mt-2">Total:</h4>
                    <p className="flex items-center">
                      <span className="price-font px-1" style={{ fontSize: "16px" }}>D</span> {finalTotal + shippingCharge}
                    </p>
                  </div>

                  <div className={styles.checkout}>
                    <PayButton
                      cartItems={cartItems}
                      totalPrice={finalTotal + shippingCharge}
                      user={user}
                      discountAmount={discountAmount}
                      coupon={coupon}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;