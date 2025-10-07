"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import CartButton from "./CartButton";
import {
  Heart,
  Menu,
  Search,
  X,
  LogOut,
  Info,
  UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { FiFacebook, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("❌ fetchUser error:", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/products", label: "Shop", img: "/placeholder.jpg" },
    { href: "/products", label: "New arrivals", img: "/placeholder.jpg" },
    { href: "/products", label: "Bestseller", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/Two-Piece-Outfit-img-blue-1.png" },
    { href: "/products", label: "Shirts", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/Mens-Slim-Fit-Cotton-Shirt-–-Breathable-Tailored-img-2.png" },
    { href: "/products", label: "T-shirts", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/polo-blue-4.png" },
    { href: "/products", label: "Jeans", img: "https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/Essential-Mens-Jeans-–-Classic-Denim-Slim-Fit-img-4.png" },
    { href: "/products", label: "Pants", img: "/placeholder.jpg" },
    { href: "/products", label: "Belts", img: "/placeholder.jpg" },
  ]

  async function handleLogout() {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (!isConfirmed) return;

    try {
      const response = await fetch("/api/logout", { method: "POST" });

      if (response.ok) {
        setUser(null);
        toast.success("Successfully logged out!");
        router.push("/");
      } else {
        console.error("❌ Logout failed:", response.status);
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Logout network error:", error);
      toast.error("An error occurred. Please check your connection.");
    }
  }

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50 justify-center flex flex-col lg:flex-row">
      <nav className="w-full flex justify-between items-center px-6 py-3 max-w-1920">
        {/* Hamburger */}
        <button
          className="text-2xl w-[40px] md:w-[200px] lg:w-[270px]"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={60}
            unoptimized
            className="w-[180px] lg:w-[200px] h-auto"
          />
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block relative w-full">
            <input
              type="text"
              placeholder="Search"
              className="text-sm py-2 border border-black w-full px-4 rounded-lg"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {user ? (
            <div ref={dropdownRef} className="relative hidden lg:block">
              <button
                onClick={() => setUserDropdown((prev) => !prev)}
                className="flex items-center"
              >
                <UserCircle size={24} />
              </button>
              {userDropdown && (
                <div className="absolute right-0 mt-8 w-60 bg-white shadow-lg rounded-lg overflow-hidden py-2 px-2 z-50">
                  <div className="border-b px-4 py-2">
                    <h3 className="capitalize">{user.name}</h3>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-sm mt-2 space-y-2">
                    <Link
                      href="/my-account"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <UserCircle size={18} className="mr-2" /> Edit profile
                    </Link>
                    <Link
                      href="/support"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <Info size={18} className="mr-2" /> Support
                    </Link>
                    <Link href="/wishlist" className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                      <Heart size={18} className="mr-2" /> Wishlist
                    </Link>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut size={18} className="mr-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="hidden lg:block">
              <UserCircle size={24} />
            </Link>
          )}
          <CartButton />
        </div>
      </nav>
      <div className="md:hidden relative w-full mb-2 px-3">
        <input
          type="text"
          placeholder="Search"
          className="text-sm py-2 border w-full px-4 pr-10 rounded-lg"
        />
        <Search className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide menu */}
            <motion.div
              className="fixed top-0 left-0 h-[94vh] lg:h-full w-3/4 max-w-xs bg-white shadow-lg z-50 py-6 px-5 flex flex-col overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* User info */}
              {user ? (
                <div className="border-b pb-4 mb-4 flex items-start gap-2">
                  <Image
                    src={"https://secure.gravatar.com/avatar/23874fa782fb0b6e80485b702ff0fb976894c95b3825716aa8b6a90c86cf6547?s=96&d=mm&r=g"}
                    alt="Profile"
                    width={30}
                    height={25}
                    quality={100}
                    unoptimized
                    className="rounded-full border-2 border-gray-200"
                  />
                  <Link href='/my-account'>
                    <h3 className="font-semibold capitalize">{user.name}</h3>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </Link>
                </div>
              ) : (
                <div className="border-b pb-4 mb-4">
                  <Link href="/auth" onClick={() => setMenuOpen(false)}>
                    <button className="text-sm bg-black text-white px-4 py-2 rounded-md">
                      Login / Register
                    </button>
                  </Link>
                </div>
              )}

              <div className="absolute right-4">
                <button className="hover:bg-gray-100 p-1 rounded-md" onClick={() => setMenuOpen(false)}>
                  <X />
                </button>
              </div>


              <ul className="flex flex-col gap-4 text-md">
                <li className="hover:underline">
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li className="hover:underline">
                  <Link href="/about" onClick={() => setMenuOpen(false)}>
                    About Us
                  </Link>
                </li>
                <li className="hover:underline">
                  <Link href="/products" onClick={() => setMenuOpen(false)}>
                    Shop
                  </Link>
                </li>
                <li className="hover:underline">
                  <Link href="/contact" onClick={() => setMenuOpen(false)}>
                    Contact Us
                  </Link>
                </li>
              </ul>
              <hr className="mt-4" />
              <div>
                <h5 className="text-md mt-4">Follow Us</h5>
                <ul className="mt-4 flex gap-4 items-center justify-start">
                  <li><Link href="#"><FiInstagram size={22} /></Link></li>
                  <li><Link href="#"><FiFacebook size={22} /></Link></li>
                  <li><Link href="#"><FiYoutube size={22} /></Link></li>
                  <li><Link href="#"><FiLinkedin size={22} /></Link></li>
                </ul>
              </div>

              {/* Logout inside menu */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-auto flex items-center gap-2 text-red-600 text-sm px-4 py-2 bg-red-50 hover:bg-red-30 rounded-md"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}