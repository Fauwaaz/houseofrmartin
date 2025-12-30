"use client";

import { Settings2Icon, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { colorMap } from "../../utils/data";

const Filter = ({
  products,
  setFilteredProducts,
  setLoading,
  onColorSelect,
  onSizeSelect,
  onCategorySelect,
  filteredProducts,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("featured");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  // ✅ Price filter state
  const minPrice = useMemo(
    () => Math.min(...(products?.map((p) => parseFloat(p.price)) || [0])),
    [products]
  );
  const maxPrice = useMemo(
    () => Math.max(...(products?.map((p) => parseFloat(p.price)) || [0])),
    [products]
  );

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([minPrice, value]);
  };

  const applyPriceFilter = () => {
    const filtered = products.filter(
      (p) => parseFloat(p.price) >= priceRange[0] && parseFloat(p.price) <= priceRange[1]
    );
    setFilteredProducts(filtered);
  };

  const toggleSelection = (list, setList, value, callback) => {
    const updated = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    setList(updated);
    callback?.(updated);
  };

  const handleCategoryReset = () => {
    setSelectedCategory([]);
    onCategorySelect([]);
  };

  const handleColorsReset = () => {
    setSelectedColors([]);
    onColorSelect([]);
  };

  const handleSizeReset = () => {
    setSelectedSizes([]);
    onSizeSelect([]);
  };

  const uniqueCategory = useMemo(
    () => [
      ...new Set(
        products?.flatMap((p) => p.productCategories?.nodes?.map((c) => c.name) || [])
      ),
    ],
    [products]
  );

  const uniqueColors = useMemo(
    () => [
      ...new Set(
        products?.flatMap(
          (p) =>
            p.attributes?.nodes
              ?.filter((a) => a.name === "pa_color")
              ?.flatMap((a) => a.options) || []
        )
      ),
    ],
    [products]
  );

  const uniqueSizes = useMemo(
    () => [
      ...new Set(
        products?.flatMap(
          (p) =>
            p.attributes?.nodes
              ?.filter((a) => a.name === "pa_size")
              ?.flatMap((a) => a.options) || []
        )
      ),
    ],
    [products]
  );

  const fetchFilteredProducts = async (filter) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?filter=${filter}`);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error(error);
      setFilteredProducts(products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFilter === "featured") {
      setFilteredProducts(products);
    } else {
      fetchFilteredProducts(selectedFilter);
    }
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[20] ${showFilter ? "block" : "hidden"}`}
        onClick={() => setShowFilter(false)}
      ></div>
      <div className="flex items-center justify-center w-full px-3 lg:px-12 relative">
        <div className="h-[60px] bg-white shadow-sm mb-6 rounded-full flex items-center justify-between px-4 w-full">
          {/* Toggle filter */}
          <button
            className="uppercase flex items-center gap-1 text-md cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <span className="p-1 rounded-full border border-black">
              <Settings2Icon size={18} />
            </span>
            Filter
            <span className="text-sm capitalize bg-gray-200 rounded-full ml-1 px-2 py-1">
              Results ({filteredProducts.length})
            </span>
          </button>

          {/* Dropdown */}
          <select
            className="w-[120px] lg:w-[150px] border border-black rounded-full px-2 py-1"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="bestseller">Bestseller</option>
          </select>

          {/* Filter modal */}
          {showFilter && (
            <div className="absolute left-0 top-0 w-full flex justify-center px-3 lg:px-12 z-[21]">
              <div className="w-full bg-white shadow-lg rounded-3xl px-4 py-2">
                {/* Close */}
                <div
                  className="flex gap-1 cursor-pointer uppercase mt-2"
                  onClick={() => setShowFilter(false)}
                >
                  <div className="flex justify-start rounded-full border border-black w-fit">
                    <button className="text-black hover:text-gray-600 p-1">
                      <X size={18} />
                    </button>
                  </div>
                  Collapse Filter
                  <span className="text-sm capitalize bg-gray-200 rounded-full ml-1 px-2 py-1">
                    Results ({filteredProducts.length})
                  </span>
                </div>

                {/* Filters grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 py-4 gap-9">
                  {/* Sizes */}
                  <div>
                    <hr />
                    <h4 className="text-md uppercase my-2">Size</h4>
                    <p
                      className="text-sm underline text-gray-500 pb-3 cursor-pointer"
                      onClick={handleSizeReset}
                    >
                      reset
                    </p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <h5 className="text-sm">Top sizes:</h5>
                      {uniqueSizes
                        .filter((size) => {
                          const s = size?.toString().toUpperCase().trim();
                          return ["M", "L", "XL", "XXL"].includes(s);
                        })
                        .sort((a, b) => {
                          const order = { "M": 1, "L": 2, "XL": 3, "XXL": 4 };
                          return order[a.toUpperCase().trim()] - order[b.toUpperCase().trim()];
                        })
                        .map((size, index) => {
                          const isSelected = selectedSizes.includes(size);
                          return (
                            <div
                              key={index}
                              className={`px-4 py-2 border rounded text-sm uppercase cursor-pointer ${isSelected
                                ? "bg-black text-white border-black"
                                : "bg-white border-gray-300"
                                }`}
                              onClick={() =>
                                toggleSelection(selectedSizes, setSelectedSizes, size, onSizeSelect)
                              }
                            >
                              {size}
                            </div>
                          );
                        })}
                    </div>
                    <div className="flex gap-2 flex-wrap items-center mt-2">
                      <h5 className="text-sm">Bottom sizes:</h5>
                      {uniqueSizes
                        .filter((size) => {
                          const s = size?.toString().toUpperCase().trim();
                          return ["32", "34", "36", "38"].includes(s);
                        })
                        .sort((a, b) => {
                          const order = { "32": 1, "34": 2, "36": 3, "38": 4 };
                          return order[a.toUpperCase().trim()] - order[b.toUpperCase().trim()];
                        })
                        .map((size, index) => {
                          const isSelected = selectedSizes.includes(size);
                          return (
                            <div
                              key={index}
                              className={`px-4 py-2 border rounded text-sm uppercase cursor-pointer ${isSelected
                                ? "bg-black text-white border-black"
                                : "bg-white border-gray-300"
                                }`}
                              onClick={() =>
                                toggleSelection(selectedSizes, setSelectedSizes, size, onSizeSelect)
                              }
                            >
                              {size}
                            </div>
                          );
                        })}
                    </div>

                    {/* old sizes */}
                    {/* {uniqueSizes.map((size, index) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <div
                          key={index}
                          className={`px-4 py-2 border rounded text-sm uppercase cursor-pointer ${isSelected
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-300"
                            }`}
                          onClick={() =>
                            toggleSelection(
                              selectedSizes,
                              setSelectedSizes,
                              size,
                              onSizeSelect
                            )
                          }
                        >
                          {size}
                        </div>
                      );
                    })} */}


                    <div className="flex gap-2 flex-wrap items-center mt-2">
                      <h5 className="text-sm">Belt sizes:</h5>
                      {uniqueSizes
                        .filter((size) => {
                          // Normalize the string: remove spaces and make lowercase
                          const s = size?.toString().toLowerCase().replace(/\s+/g, '');
                          return s.includes("46") || s.includes("48") || s.includes("50");
                        })
                        .sort((a, b) => {
                          // Extract the first number found in the string to sort numerically
                          const numA = parseInt(a.match(/\d+/));
                          const numB = parseInt(b.match(/\d+/));
                          return numA - numB;
                        })
                        .map((size, index) => {
                          const isSelected = selectedSizes.includes(size);
                          return (
                            <div
                              key={index}
                              className={`px-4 py-2 border rounded text-sm uppercase cursor-pointer ${isSelected
                                  ? "bg-black text-white border-black"
                                  : "bg-white border-gray-300"
                                }`}
                              onClick={() =>
                                toggleSelection(selectedSizes, setSelectedSizes, size, onSizeSelect)
                              }
                            >
                              {size}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <hr />
                    <h4 className="text-md uppercase my-2">Color</h4>
                    <p
                      className="text-sm underline text-gray-500 pb-3 cursor-pointer"
                      onClick={handleColorsReset}
                    >
                      reset
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                      {uniqueColors.map((color, index) => {
                        const isSelected = selectedColors.includes(color);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 cursor-pointer capitalize"
                            onClick={() =>
                              toggleSelection(
                                selectedColors,
                                setSelectedColors,
                                color,
                                onColorSelect
                              )
                            }
                          >
                            <div
                              className={`w-5 lg:w-7 h-5 lg:h-7 rounded-full border ${isSelected
                                ? "border-2 border-black"
                                : "border-gray-300"
                                }`}
                              style={{
                                background: colorMap[color] || "#ccc",
                              }}
                            />
                            <span className="text-sm">{color}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ✅ Price Slider */}
                  <div>
                    <hr />
                    <h4 className="text-md uppercase my-2">Price</h4>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <p><span className="price-font">D</span>{priceRange[0]}</p>
                      <p><span className="price-font">D</span>{priceRange[1]}</p>
                    </div>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      className="w-full accent-black cursor-pointer"
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-black text-white rounded-full text-sm"
                      onClick={applyPriceFilter}
                    >
                      Apply Price Filter
                    </button>
                  </div>


                  {/* Categories + Price */}
                  <div>
                    <hr />
                    <h4 className="text-md uppercase my-2">Product type</h4>
                    <p
                      className="text-sm underline text-gray-500 pb-3 cursor-pointer"
                      onClick={handleCategoryReset}
                    >
                      reset
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {uniqueCategory.map((cat, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 capitalize cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategory.includes(cat)}
                            onChange={() =>
                              toggleSelection(
                                selectedCategory,
                                setSelectedCategory,
                                cat,
                                onCategorySelect
                              )
                            }
                            className="w-5 h-5 border rounded"
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Filter;
