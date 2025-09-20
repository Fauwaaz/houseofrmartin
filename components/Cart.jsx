import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { BackgroundAnimation, CartAnimation } from "../animations";
import { useStateContext } from "../context/StateContext";
import getStripe from "../libs/getStripe";
import styles from "../styles/Cart.module.css";
import CartItem from "./CartItem";
import { X } from "lucide-react";

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

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });
    if (response.statusCode === 500) return;

    const data = await response.json();

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );



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
                        image={item.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
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
                    <button onClick={handleCheckout}>Checkout</button>
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
