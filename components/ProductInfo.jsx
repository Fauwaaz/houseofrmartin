import React from "react";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/ProductInfo.module.css";

const ProductInfo = ({ product, isMounted }) => {
  const { onAdd, qty, setShowCart } = useStateContext();

  const handleBuyNow = (e) => {
    onAdd(product, qty);
    setShowCart(true);
  };

  const colorMap = {
    blue: "#82AFD9",
    pink: "#F3B3A7",
    yellow: "#ffd323",
    black: "#000000",
    white: "#FFFFFF",
  };

  return (
    <div className="">
      <h1 className="text-3xl mb-2 font-geograph">{product.name}</h1>
      <span className={styles.price}><p className="price-font">D</p> {product.price}</span>
      <div className={styles.quantity}>
        <button
          className={`${styles.button} ${styles.dark_button}`}
          onClick={() => onAdd(product, qty)}
        >
          Add to cart
        </button>
        {/* <button
          className={`${styles.button} ${styles.dark_button}`}
          onClick={handleBuyNow}
        >
          Buy now
        </button> */}
      </div>
      <div className="flex mt-3 px-3 w-full gap-2">
        {product.attributes?.nodes
          ?.filter((attr) => attr.name === "pa_color")
          ?.flatMap((attr) => attr.options)
          ?.map((color, index) => (
            <span
              key={index}
              className="inline-block w-5 h-5 rounded-full border hover:border-black border-gray-300"
              style={{ backgroundColor: colorMap[color] || "#ccc" }}
              title={color}
            />
          ))}
      </div>
      {isMounted ? (
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default ProductInfo;
