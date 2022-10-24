import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { BackgroundAnimation, CartAnimation } from "../animations";
import { useStateContext } from "../context/StateContext";
import getStripe from "../libs/getStripe";
import styles from "../styles/Cart.module.css";
import CartItem from "./CartItem";

const Cart = () => {
  const {
    showCart,
    setShowCart,
    totalQuantities,
    totalPrice,
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

  console.log(cartItems);

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
          />
          <motion.div
            className={styles.cart}
            variants={CartAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <button
              className={styles.heading}
              onClick={() => setShowCart(!showCart)}
            >
              <HiOutlineChevronLeft />
              <h3>Your Cart</h3>
              <span>( {totalQuantities} items )</span>
            </button>

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
                        image={item.featuredImage.node.sourceUrl}
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
                    {/* <span>${totalPrice}</span> */}
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className={styles.checkout}>
                    <button onClick={handleCheckout}>Pay with Stripe</button>
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
