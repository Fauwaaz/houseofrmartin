import Image from "next/image";
import { AiOutlineCloseCircle, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import styles from "../styles/CartItem.module.css";
import toast from "react-hot-toast";
import Link from "next/link";

const CartItem = ({ item, decrease, increase, remove }) => {
  if (!item) return null;

  const {
    name,
    quantity,
    price,
    slug,
    image,
    color,
    size,
    manageStock,
    stockQuantity,
    stockStatus,
  } = item;

  const handleRemove = () => {
    remove();
    toast.error("Uh Oh! Item removed from bag");
  };

  const handleIncrease = () => {
    if (manageStock) {
      if (stockStatus === "OUT_OF_STOCK" || stockQuantity <= 0) {
        toast.error("Out of stock");
        return;
      }
      if (quantity >= stockQuantity) {
        toast.error(`Only ${stockQuantity} item${stockQuantity > 1 ? "s" : ""} in stock`);
        return;
      }
    }
    increase();
  };

  const handleDecrease = () => {
    if (quantity > 1) decrease();
  };

  return (
    <li className={styles.item}>
      <div className={styles.image}>
        <Link href={`/products/${slug}`} className="w-full h-full relative">
          <Image
            src={image}
            alt={`${name} - ${color} - ${size}`}
            fill
            style={{ objectFit: "contain" }}
          />
        </Link>
      </div>

      <div className={styles.info}>
        <div>
          <h3 className={`${styles.name} ${styles.line_clamp}`}>
            <Link href={`/products/${slug}`} className="hover:underline">
              {name}
            </Link>
          </h3>

          <div className="-mt-2 mb-2">
            <p className="text-sm text-gray-600">Color: {color || "-"}</p>
            <p className="text-sm text-gray-600">Size: {size || "-"}</p>
          </div>
        </div>

        <div className={styles.quantity}>
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className={quantity <= 1 ? "opacity-40 cursor-not-allowed" : ""}
          >
            <AiOutlineMinus />
          </button>

          <span>{quantity}</span>

          <button
            onClick={handleIncrease}
            disabled={
              manageStock &&
              (stockStatus === "OUT_OF_STOCK" || quantity >= stockQuantity)
            }
            className={
              manageStock && quantity >= stockQuantity
                ? "opacity-40 cursor-not-allowed"
                : ""
            }
          >
            <AiOutlinePlus />
          </button>
        </div>

        {manageStock && stockQuantity > 0 && (
          <p className="text-xs text-green-600">
            {stockQuantity - quantity} left in stock
          </p>
        )}

        {manageStock && stockQuantity <= 0 && (
          <p className="text-xs text-red-600">Out of stock</p>
        )}
      </div>

      <div className={styles.price}>
        <button onClick={handleRemove}>
          <AiOutlineCloseCircle />
        </button>
        <p>
          <span className="price-font mr-1">D</span> {price}
        </p>
      </div>
    </li>
  );
};

export default CartItem;