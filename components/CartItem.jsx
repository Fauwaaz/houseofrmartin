import Image from "next/image";
import {
  AiOutlineCloseCircle,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import styles from "../styles/CartItem.module.css";

const CartItem = ({
  pos,
  name,
  quantity,
  price,
  image,
  decrease,
  increase,
  remove,
}) => {
  return (
    <li className={styles.item}>
      <div className={styles.image}>
        <Image src={image} priority layout="fill" objectFit="contain" alt={name} />
      </div>
      <div className={styles.info}>
        <div>
          <h3 className={`${styles.name} ${styles.line_clamp}`}>{name}</h3>
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
        <button id={styles.delete} onClick={remove}>
          <AiOutlineCloseCircle />
        </button>
        <div>
          <span id={styles.price}>${price}</span>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
