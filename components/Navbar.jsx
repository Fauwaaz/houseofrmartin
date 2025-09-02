import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";
import Image from "next/image";
import { FiHeart, FiSearch, FiUser } from "react-icons/fi";


const link = [
  { name: "Home", url: "/" },
  { name: "Shop", url: "/shop" },
  { name: "Bestseller", url: "/bestseller" },
  { name: "About", url: "/about" },
]

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={90}
            height={60}
            unoptimized
          />
        </Link>
        <ul className="font-geograph-md">
          {link.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <Link href={item.url}>{item.name}</Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center">
          <FiUser size={24}/>
          <FiHeart size={24} style={{ marginLeft: "1rem", marginRight: "1rem" }}/>
          <FiSearch size={24} style={{ marginRight: "1rem" }}/>
          <CartButton />
        </div>
      </nav>
    </header>
  );
}
