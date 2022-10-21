import React, { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/CartButton.module.css";

const CartButton = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <button className={styles.container} onClick={() => setShowCart(!showCart)}>
      <div className={styles.inner}>
        <FiShoppingBag />
        {totalQuantities > 0 && !isSSR && <span>{totalQuantities}</span>}
      </div>
    </button>
  );
};

export default CartButton;
