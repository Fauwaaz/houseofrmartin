"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";
import Image from "next/image";
import { useState } from "react";
import { Heart, Menu, Search, User, X } from "lucide-react";


const link = [
  { name: "Home", url: "/" },
  { name: "Shop", url: "/products" },
  { name: "Bestseller", url: "/products" },
  { name: "About", url: "/about" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            className="w-[60px] lg:w-[110px] h-auto"
          />
        </Link>
        <ul className="hidden md:flex space-x-8 font-geograph-md">
          {link.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <Link href={item.url}>{item.name}</Link>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center justify-center">
          <Link href={'/auth'}><User size={24}/></Link>
          <Heart size={24} style={{ marginLeft: "1rem", marginRight: "1rem" }}/>
          <Search size={24} style={{ marginRight: "1rem" }}/>
          <CartButton />
        </div>
         <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4">
          <ul className="flex flex-col space-y-4 font-geograph-md">
            {link.map((item, index) => (
              <li key={index} onClick={() => setMenuOpen(false)}>
                <Link href={item.url}>{item.name}</Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-start mt-4 space-x-4">
            <Link href={'/auth'}><User size={24}/></Link>
            <Heart size={22} />
            <Search size={22} />
            <CartButton />
          </div>
        </div>
      )}
    </header>
  );
}