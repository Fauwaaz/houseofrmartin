import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/CartButton.module.css";

const CartButton = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  return (
    <button className={styles.container} onClick={() => setShowCart(!showCart)}>
      <div className={styles.inner}>
        <FiShoppingBag />
        <span>{totalQuantities}</span>
      </div>
    </button>
  );
};

export default CartButton;
