"use client";

import { Settings2Icon, X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { GET_ALL } from "../../utils/queries";
import { colorMap } from "../../utils/data";

export async function getStaticProps() {
    const { data } = await client.query({ query: GET_ALL });
    const products = data?.products?.nodes || [];

    return {
        props: { products },
        revalidate: 1,
    };
}

const Filter = ({ products, setFilteredProducts, setLoading, onColorSelect, onSizeSelect, onCategorySelect }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("featured");
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    // Collect all categories from products
    const allCategory = products?.flatMap(
        (product) => product.productCategories?.nodes?.map((cat) => cat.name) || []
    );

    // Deduplicate
    const uniqueCategory = [...new Set(allCategory)];

    // Toggle selection
    const toggleCategory = (cat) => {
        let updated;
        if (selectedCategory.includes(cat)) {
            updated = selectedCategory.filter((c) => c !== cat);
        } else {
            updated = [...selectedCategory, cat];
        }
        setSelectedCategory(updated);
        onCategorySelect(updated);
    };

    const allColors = products
        ?.flatMap((product) =>
            product.attributes?.nodes
                ?.filter((attr) => attr.name === "pa_color")
                ?.flatMap((attr) => attr.options) || []
        )
        .filter(Boolean); // remove null/undefined

    const uniqueColors = [...new Set(allColors)];

    const toggleColor = (color) => {
        let updated;
        if (selectedColors.includes(color)) {
            updated = selectedColors.filter((c) => c !== color);
        } else {
            updated = [...selectedColors, color];
        }
        setSelectedColors(updated);
        onColorSelect(updated); // pass to parent
    };

    const allSizes = products
        ?.flatMap((product) =>
            product.attributes?.nodes
                ?.filter((attr) => attr.name === "pa_size")
                ?.flatMap((attr) => attr.options) || []
        )
        .filter(Boolean);
    const uniqueSizes = [...new Set(allSizes)]

    const toggleSize = (size) => {
        let updated;
        if (selectedSizes.includes(size)) {
            updated = selectedSizes.filter((s) => s !== size);
        } else {
            updated = [...selectedSizes, size];
        }
        setSelectedSizes(updated);
        onSizeSelect(updated);
    };

    const handleReset = () => {
    }

    const fetchFilteredProducts = async (filter) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/products?filter=${filter}`);
            setFilteredProducts(data.products || []);
        } catch (error) {
            console.error(error);
            setFilteredProducts(products); // fallback
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedFilter === "featured") {
            setFilteredProducts(products); // reset
        } else {
            fetchFilteredProducts(selectedFilter);
        }
    }, [selectedFilter]);

    return (
        <div className="flex items-center justify-center w-full px-3 lg:px-6 relative">
            <div className="h-[50px] bg-white shadow-sm mb-6 rounded-full flex items-center justify-between px-4 w-full relative">
                <button
                    className="uppercase flex items-center gap-1 text-md cursor-pointer"
                    onClick={() => setShowFilter(!showFilter)}
                >
                    <span className="p-1 rounded-full border border-black">
                        <Settings2Icon size={16} />
                    </span>
                    Filter
                </button>

                <div style={{ zIndex: "100" }}>
                    <select
                        className="w-[120px] lg:w-[150px] border border-black rounded-full px-2 py-1"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="featured">Featured</option>
                        <option value="new-arrivals">New Arrivals</option>
                        <option value="bestseller">Bestseller</option>
                    </select>
                </div>

                {/* Filter Modal */}
                {showFilter && (
                    <div className="absolute left-0 top-0 w-full flex items-center justify-center px-0 z-50">
                        <div className="w-full bg-gray-100 shadow-lg rounded-3xl px-4 py-3">
                            <div className="flex gap-1 cursor-pointer" onClick={() => setShowFilter(false)}>
                                <div className="flex justify-start rounded-full border border-black self-auto w-fit">
                                    <button
                                        className="text-black hover:text-gray-600 p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                Collapse Filter
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 py-4 gap-9">
                                <div>
                                    <hr />
                                    <div className="py-2">
                                        <h4 className="text-md uppercase mb-2">Size</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {uniqueSizes.map((size, index) => {
                                                const isSelected = selectedSizes.includes(size);

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 cursor-pointer capitalize"
                                                        onClick={() => toggleSize(size)}
                                                    >
                                                        <div
                                                            className={`px-4 py-2 border text-sm rounded uppercase cursor-pointe text-black bg-white border-black ${isSelected ? "bg-black" : "border-gray-300"}`}
                                                            title={size}
                                                        >{size}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <hr />
                                    <div className="py-2">
                                        <h4 className="text-md uppercase mb-2">Product type</h4>
                                        <p
                                            className="text-sm underline text-gray-500 pb-3 cursor-pointer"
                                            onClick={handleReset}
                                        >
                                            reset
                                        </p>

                                        <div className="grid grid-cols-4 gap-3 flex-wrap">
                                            {uniqueCategory.map((category, index) => {
                                                const isSelected = selectedCategory.includes(category);
                                                return (
                                                    <label
                                                        key={index} 
                                                        className="flex flex-row gap-2 items-center cursor-pointer capitalize"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleCategory(category)}
                                                            className={`w-5 h-5 rounded border ${isSelected ? "border-2 border-black" : "border-gray-300"
                                                                }`}
                                                            title={category}
                                                        />
                                                        <span className="text-sm">{category}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <hr />
                                    <div className="py-2">
                                        <h4 className="text-md uppercase mb-2">price</h4>
                                    </div>
                                </div>
                                <div>
                                    <hr />
                                    <div className="py-2">
                                        <h4 className="text-md uppercase mb-2">color</h4>
                                        <p
                                            className="text-sm underline text-gray-500 pb-3 cursor-pointer"
                                            onClick={handleReset}
                                        >
                                            reset
                                        </p>

                                        <div className="grid grid-cols-3 gap-3 flex-wrap">
                                            {uniqueColors.map((color, index) => {
                                                const isSelected = selectedColors.includes(color);

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 cursor-pointer capitalize"
                                                        onClick={() => toggleColor(color)}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-full border ${isSelected ? "border-2 border-black" : "border-gray-300"}`}
                                                            style={{ backgroundColor: colorMap[color] || "#ccc" }}
                                                            title={color}
                                                        ></div>
                                                        <span className="text-sm">{color}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;