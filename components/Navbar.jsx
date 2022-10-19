import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <a>NextShop</a>
        </Link>
        <CartButton />
      </nav>
    </header>
  );
}
