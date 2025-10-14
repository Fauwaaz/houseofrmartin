import { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/CartButton.module.css";
import { ShoppingBag } from "lucide-react";

const CartButton = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <button className={styles.container} onClick={() => setShowCart(!showCart)}>
      <div className={styles.inner}>
        <ShoppingBag />
        {totalQuantities > 0 && !isSSR && <span>{totalQuantities}</span>}
      </div>
    </button>
  );
};

export default CartButton;
