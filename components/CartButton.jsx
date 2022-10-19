import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import styles from "../styles/CartButton.module.css";

const CartButton = () => {
  return (
    <button className={styles.container}>
      <div className={styles.inner}>
        <FiShoppingBag />
        <span>3</span>
        {/* <span>{totalQuantities}</span> */}
      </div>
    </button>
  )
}

export default CartButton


