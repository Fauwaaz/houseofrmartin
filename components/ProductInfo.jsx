import React from "react";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/ProductInfo.module.css";

const ProductInfo = ({ product, isMounted }) => {
  const { onAdd, qty, setShowCart } = useStateContext();

  const handleBuyNow = (e) => {
    onAdd(product, qty);
    setShowCart(true);
  };

  return (
    <>
      <h2 className={styles.name}>{product.name}</h2>
      {isMounted ? (
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        "Loading..."
      )}

      <span className={styles.price}>${product.price}</span>
      <div className={styles.quantity}>
        <button
          className={`${styles.button} ${styles.white_button}`}
          onClick={() => onAdd(product, qty)}
        >
          Add to cart
        </button>
        <button
          className={`${styles.button} ${styles.dark_button}`}
          onClick={handleBuyNow}
        >
          Buy now
        </button>
      </div>
    </>
  );
};

export default ProductInfo;
