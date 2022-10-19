import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <h3>NextShop</h3>
        <CartButton />
      </nav>
    </header>
  );
}
