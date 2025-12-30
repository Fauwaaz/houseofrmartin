"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DEFAULT_CATEGORIES = [
  "Shirts",
  "T-shirts",
  "Jeans",
  "Trousers",
  "Co-ord Set",
];

const highlightMatch = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
};


export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const router = useRouter();

  // 🔹 Debounced server-side search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search-products?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data || []);
      } catch {
        setResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToSearchPage = (value) => {
    if (!value) return;
    router.push(`/products?search=${encodeURIComponent(value)}`);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full lg:w-[220px]">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => e.key === "Enter" && goToSearchPage(query)}
          placeholder="Search products..."
          className="text-sm py-2 border border-black w-full px-4 rounded-lg focus:outline-none"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X size={16} />
          </button>
        )}

        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>

      {isFocused && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 w-full lg:w-[340px] rounded-lg max-h-[300px] overflow-y-auto z-50">
          {query.length < 2 ? (
            DEFAULT_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => goToSearchPage(cat)}
              >
                {cat} <ChevronRight size={16} />
              </div>
            ))
          ) : results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/products/${item.slug}`)}
                >
                  {/* IMAGE */}
                  <Image
                    src={item.images?.[0]?.src || "/placeholder.jpg"}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-md"
                  />

                  {/* NAME + CATEGORY */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {highlightMatch(item.name, query)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.categories?.[0]?.name || ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No products found.
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}
