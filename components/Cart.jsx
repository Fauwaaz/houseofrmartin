import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { BackgroundAnimation, CartAnimation } from "../animations";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/Cart.module.css";
import CartItem from "./CartItem";
import { X } from "lucide-react";
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
    onAdd,
    setCartItems,
  } = useStateContext();

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const [user, setUser] = useState(null)

  // const user = {
  //   name: "Fauwaaz Shaikh",
  //   email: "fauwaaz@example.com",
  //   phone: "971500000000",
  //   address: "Flat 401, Dubai Marina",
  //   city: "Dubai",
  //   state: "Dubai",
  //   zip: "00000",
  //   country: "AE",
  // };

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");

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
      } else {
        console.warn("User info missing, using guest fallback:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  fetchProfile();
}, []);



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
                <span>( {totalQuantities} items )</span>
              </div>

              <button className="cursor-pointer" onClick={() => setShowCart(false)}><X /></button>
            </div>

            {cartItems.length < 1 && (
              <div className={styles.empty}>
                <FiShoppingBag />
                <h3>Your shopping bag is empty</h3>
                <Link href="/">Continue Shopping</Link>
              </div>
            )}
            {cartItems.length >= 1 && (
              <div className={styles.content}>
                <ol className={styles.items}>
                  {cartItems.map((item, i) => (
                    <>
                      <CartItem
                        key={i}
                        name={item.name}
                        quantity={item.quantity}
                        price={item.price}
                        size={item.size}
                        color={item.color}
                        image={item.image}
                        decrease={() => toggleCartItemQuantity(item.id, "dec")}
                        increase={() => toggleCartItemQuantity(item.id, "inc")}
                        remove={() => onRemove(item)}
                      />
                    </>
                  ))}
                </ol>
                <div className={styles.totals}>
                  <div>
                    <h4>Subtotal:</h4>
                    <span><span className="price-font">D</span>   {Number(totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className={styles.checkout}>
                    <PayButton cartItems={cartItems} totalPrice={totalPrice} user={user} />
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