"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Grid, Heart, User } from "lucide-react";

export default function FooterBar() {
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={22} /> },
    { href: "/products", label: "Collections", icon: <Grid size={22} /> },
    { href: "/wishlist", label: "Wishlist", icon: <Heart size={22} /> },
    { href: "/my-account", label: "Account", icon: <User size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center ${
                isActive ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {item.icon}
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}