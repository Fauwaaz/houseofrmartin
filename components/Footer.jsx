import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="https://domvournias.com">
        <span>Created by </span>
        <span>Dom Vournias</span>
      </a>
    </footer>
  );
};

export default Footer;
