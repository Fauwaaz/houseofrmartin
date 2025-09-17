"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Heart, Menu, Search, User, X, LogOut, Settings } from "lucide-react";

const link = [
  { name: "Home", url: "/" },
  { name: "Shop", url: "/products" },
  { name: "Bestseller", url: "/products" },
  { name: "About", url: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  // Example: Replace with your actual auth check
  const isLoggedIn = true;

  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="hidden md:flex items-center justify-center relative">
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center focus:outline-none"
              >
                <User size={24} className="cursor-pointer" />
              </button>
              {userDropdown && (
                <div className="absolute right-0 mt-9 w-60 bg-white shadow-lg rounded-lg overflow-hidden py-2 z-50">
                  <div className="border-b px-4 py-2">
                    <h3 className="">
                      Firstname Lastname
                    </h3>
                    <p className="text-sm text-gray-600">user@gmail.com</p>
                  </div>
                  <div className="text-sm">
                    <Link
                    href="/account"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <User size={18} className="mr-2" /> My Account
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <Settings size={18} className="mr-2" /> Settings
                  </Link>
                  <Link href={"/auth"}
                    className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="cursor-pointer">
              <User size={24} />
            </Link>
          )}

          <Heart size={24} className="mx-4" />
          <Search size={24} className="mr-4" />
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
            {isLoggedIn ? (
              <button onClick={() => setUserDropdown(!userDropdown)}>
                <User size={24} />
              </button>
            ) : (
              <Link href="/auth">
                <User size={24} />
              </Link>
            )}
            <Heart size={22} />
            <Search size={22} />
            <CartButton />
          </div>
        </div>
      )}
    </header>
  );
}