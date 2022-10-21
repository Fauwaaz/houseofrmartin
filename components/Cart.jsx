import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { useStateContext } from "../context/StateContext";
import getStripe from "../libs/getStripe";
import styles from "../styles/Cart.module.css";

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

  if (showCart === true)
    return (
      <div className={styles.cart}>
        <div className={styles.container}>
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
                  <li className={styles.item} key={i}>
                    <div className={styles.image}>
                      <Image
                        src={item.featuredImage.node.sourceUrl}
                        priority
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div className={styles.info}>
                      <div>
                        <h3 className={`${styles.name} ${styles.line_clamp}`}>
                          {item.name}
                        </h3>
                      </div>

                      <div className={styles.quantity}>
                        <span
                          id={styles.minus}
                          onClick={() => toggleCartItemQuantity(item.id, "dec")}
                        >
                          <AiOutlineMinus />
                        </span>
                        <span id={styles.count}>{item.quantity}</span>
                        <span
                          id={styles.plus}
                          onClick={() => toggleCartItemQuantity(item.id, "inc")}
                        >
                          <AiOutlinePlus />
                        </span>
                      </div>
                    </div>
                    <div className={styles.price}>
                      <button id={styles.delete} onClick={() => onRemove(item)}>
                        <AiOutlineCloseCircle />
                      </button>
                      <div>
                        <span id={styles.price}>${item.price}</span>
                      </div>
                    </div>
                  </li>
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
        </div>
      </div>
    );
  return null;
};

export default Cart;
