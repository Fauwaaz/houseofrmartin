"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";
import Image from "next/image";
import { useState } from "react";
import { FiHeart, FiMenu, FiSearch, FiUser, FiX } from "react-icons/fi";


const link = [
  { name: "Home", url: "/" },
  { name: "Shop", url: "/shop" },
  { name: "Bestseller", url: "/bestseller" },
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
          <Link href={'/auth'}><FiUser size={24}/></Link>
          <FiHeart size={24} style={{ marginLeft: "1rem", marginRight: "1rem" }}/>
          <FiSearch size={24} style={{ marginRight: "1rem" }}/>
          <CartButton />
        </div>
         <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
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
            <Link href={'/auth'}><FiUser size={24}/></Link>
            <FiHeart size={22} />
            <FiSearch size={22} />
            <CartButton />
          </div>
        </div>
      )}
    </header>
  );
}