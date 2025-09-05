// components/ProductInfo.jsx
import React, { useState } from "react";
import { useStateContext } from "../context/StateContext";
import styles from "../styles/ProductInfo.module.css";
import { FiShoppingBag, FiStar } from "react-icons/fi";


const ProductInfo = ({ product, isMounted }) => {
  const { onAdd, qty, setShowCart } = useStateContext();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const colorMap = {
    blue: "#82AFD9",
    pink: "#F3B3A7",
    yellow: "#ffd323",
    black: "#000000",
    white: "#FFFFFF",
  };

  const colors =
    product.attributes?.nodes
      ?.filter((attr) => attr.name === "pa_color")
      ?.flatMap((attr) => attr.options) || [];

  const sizes =
    product.attributes?.nodes
      ?.filter((attr) => attr.name === "pa_size")
      ?.flatMap((attr) => attr.options) || [];

  return (
    <div>
      <h1 className="text-3xl mb-2 font-geograph">
        {product?.name || (
          <span className="inline-block animate-pulse bg-gray-200 h-8 w-2/3 rounded" />
        )} 
        {/* <span className="text-sm flex items-center gap-1 px-2 py-1 border border-solid border-black w-[100px] rounded">Follow us <FiStar /> </span>  */}
      </h1>
       
      {"price" in product ? (
        <span className={styles.price}>
          <p className="price-font">D</p> {product.price}
        </span>
      ) : (
        <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
      )}

      <hr className="border-black/10 border-solid my-3"/>

      <p className="mt-2">Select size</p>
      {sizes.length > 0 ? (
        <div className="flex mt-2 gap-1 flex-wrap">
          {sizes.map((size, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded uppercase cursor-pointer border-black border-1 border-solid  ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "border-gray-400 border bg-white border-solid"
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex mt-4 gap-2 animate-pulse">
          <div className="h-9 w-14 rounded border bg-gray-100 border-gray-200" />
          <div className="h-9 w-14 rounded border bg-gray-100 border-gray-200" />
          <div className="h-9 w-14 rounded border bg-gray-100 border-gray-200" />
        </div>
      )}

      <div className="mt-6">
        <button
          className={`${styles.button} ${styles.dark_button} uppercase flex items-center gap-2 justify-center ${
            !selectedColor || !selectedSize
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!selectedColor || !selectedSize}
          onClick={() => onAdd({ ...product, selectedColor, selectedSize }, qty)}
        >
          Add to Bag <FiShoppingBag />
        </button>
      </div>

      <p className="mt-3">Also available in:</p>
      {colors.length > 0 ? (
        <div className="flex mt-2 gap-1">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-1 border-solid ${
                selectedColor === color ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: colorMap[color] || "#ccc" }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      ) : (
        <div className="flex mt-4 gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      )}

      <p className="mt-5 font-geograph-md uppercase">Description</p>
      {isMounted ? (
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <div className="mt-4 space-y-2 animate-pulse">
          <div className="bg-gray-200 h-4 rounded w-full" />
          <div className="bg-gray-200 h-4 rounded w-11/12" />
          <div className="bg-gray-200 h-4 rounded w-10/12" />
        </div>
      )}
    </div>
  );
};

export default ProductInfo;