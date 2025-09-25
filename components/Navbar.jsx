import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import CartButton from "./CartButton";
import {
  Heart,
  Menu,
  Search,
  X,
  LogOut,
  Settings,
  Info,
  UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter()

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

  async function handleLogout() {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch("/api/logout", {
        method: "POST"
      });

      if (response.ok) {
        setUser(null); 
        toast.success("Successfully logged out!");
        router.push('/');
      } else {
        console.error("❌ Logout failed with status:", response.status);
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("❌ A network error occurred during logout:", error);
      toast.error("An error occurred. Please check your connection.");
    }
  }


  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo */}
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

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 font-geograph-md uppercase text-sm">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Shop</Link></li>
          <li><Link href="/products">Bestseller</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center justify-center relative">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserDropdown((prev) => !prev)}
                className="flex items-center focus:outline-none cursor-pointer"
              >
                <UserCircle size={24} />
              </button>
              {userDropdown && (
                <div className="absolute -right-20 lg:right-0 mt-9 w-60 bg-white shadow-lg rounded-lg overflow-hidden py-2 px-2 z-50">
                  <div className="border-b px-4 py-2">
                    <h3 className="capitalize">{user.name}</h3>
                    <p className="text-[12px] text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-sm space-y-2">
                    <Link href="/my-account" className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md mt-2">
                      <UserCircle size={18} className="mr-2" /> Edit profile
                    </Link>
                    <Link href="/support" className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                      <Info size={18} className="mr-2" /> Support
                    </Link>
                    <hr />
                    <Link href='Javascript:void(0)'
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 text-left rounded-md cursor-pointer"
                    >
                      <LogOut size={18} className="mr-2" /> Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="cursor-pointer">
              <UserCircle size={24} />
            </Link>
          )}

          <Link href={'/wishlist'}><Heart size={24} className="mx-3" /></Link>
          <Search size={24} className="mr-3" />
          <CartButton />
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}