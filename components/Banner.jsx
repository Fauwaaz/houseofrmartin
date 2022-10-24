import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import styles from "../styles/Banner.module.css";

const Banner = ({ title, description, uri, image }) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href={`/product/${uri}`}>
          <a>
            Learn more <RiArrowRightSLine />
          </a>
        </Link>
      </div>
      <div className={styles.image}>
        <Image
          src={image}
          width="746px"
          height="388px"
          objectFit="contain"
          style={{ marginBottom: "-15px" }}
        />
      </div>
    </div>
  );
};

export default Banner;
