import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/ProductCard.module.css";

const ProductCard = ({ name, description, slug, price, image }) => {
  const [isMounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  return (
    <li className={styles.card}>
      <div className={styles.top}>
        <Link href={`/product/${slug}`}>
          <a>
            <div>
              <Image src={image} priority layout="fill" objectFit="contain" />
            </div>
          </a>
        </Link>
      </div>
      <div className={styles.bottom}>
        <div id="info-row">
          <Link href={`/product/${slug}`} className="linkDashed">
            <h2 className={styles.name}>{name}</h2>
          </Link>
          {isMounted ? (
            <p
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}
        </div>
        <div className={styles.price}>
          <Link href={`/product/${slug}`} id="price">
            <div>
              <span>from </span>
              <font>${price}</font>
            </div>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default ProductCard;
