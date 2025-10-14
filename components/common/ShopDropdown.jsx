import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronDown, X } from "lucide-react";

const ShopDropdown = ({ links, setMenuOpen }) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="relative">
      <button
        className="flex items-center w-full justify-between gap-1 hover:text-gray-700"
        onClick={() => setOpen(!open)}
      >
        Shop
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            key="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 mt-2 w-[250px] h-[400px] bg-white shadow-lg border border-gray-200 rounded-lg overflow-y-scroll z-50"
          >
            <div className="p-2 flex justify-between items-center gap-1 border-b">
              <p className="text-sm">Categories</p>
              <button onClick={() => setOpen(false) } className="text-xs underline">
                close
              </button>
            </div>
            {links.map((link, key) => (
              <li key={key}>
                <Link
                  href={link.href}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 transition-all"
                  onClick={() => {
                    setOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={link.img}
                      width={60}
                      height={60}
                      alt={link.label}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <p className="uppercase text-sm">{link.label}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default ShopDropdown;