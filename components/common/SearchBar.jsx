"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const DEFAULT_CATEGORIES = ["T-shirts", "Jeans", "Trousers", "Shirts", "Co-ord Set"];

const SearchBar = ({ products = [] }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const router = useRouter();

  // Filter products as user types
  useEffect(() => {
    if (!Array.isArray(products)) return;

    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const filtered = products.filter((p) =>
      p?.name?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 10));
  }, [query, products]);

  // Close search when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to /products with query
  const handleSearchSubmit = (searchQuery) => {
    if (!searchQuery) return;
    router.push(`/products?category=${encodeURIComponent(searchQuery)}`);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full lg:w-[200px]">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit(query);
          }}
          placeholder="Search products..."
          className="text-sm py-2 border border-black w-full px-4 rounded-lg focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
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
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto z-50">
          {query.trim().length === 0 ? (
            DEFAULT_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleSearchSubmit(cat)}
              >
                {cat} <ChevronRight className="inline-block ml-1" size={16} />
              </div>
            ))
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSearchSubmit(item.name)}
              >
                <img
                  src={item.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">
                    {item.productCategories?.nodes?.[0]?.name || ""}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
