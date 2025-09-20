import Image from "next/image";
import {
  AiOutlineCloseCircle,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import styles from "../styles/CartItem.module.css";
import toast from "react-hot-toast";

const CartItem = ({
  pos,
  name,
  quantity,
  price,
  image,
  decrease,
  increase,
  remove,
  color,
  size,
}) => {

  const handleRemove = () => {
    remove(); 
    toast.error('Uh Oh! Item removed');
  };

  return (
    <li className={styles.item}>
      <div className={styles.image}>
        <Image
          src={image}
          alt={`${name} - ${color} - ${size}`}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className={styles.info}>
        <div>
          <h3 className={`${styles.name} ${styles.line_clamp} capitalize`}>
            {name} ({color}, {size})
          </h3>
        </div>

        <div className={styles.quantity}>
          <span id={styles.minus} onClick={decrease}>
            <AiOutlineMinus />
          </span>
          <span id={styles.count}>{quantity}</span>
          <span id={styles.plus} onClick={increase}>
            <AiOutlinePlus />
          </span>
        </div>
      </div>

      <div className={styles.price}>
        <button id={styles.delete} onClick={handleRemove}>
          <AiOutlineCloseCircle />
        </button>
        <div>
          <span id={styles.price}>
            <p className="price-font">D</p> {price}
          </span>
        </div>
      </div>
    </li>
  );
};

export default CartItem;