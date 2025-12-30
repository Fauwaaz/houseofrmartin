"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishListStateContext";
import { colorMap } from "../../utils/data";

/**
 * REAL category mapping (slug → Woo category IDs)
 */
const OUTFIT_CATEGORY_ID_MAP = {
  shirts: [34, 33],     // Jeans, Trousers
  tshirts: [34, 33],
  jeans: [15, 16],      // Shirts, T-shirts
  trousers: [15, 16],
};

const getDiscountPercent = (regular, sale) => {
  if (!regular || !sale || Number(regular) <= Number(sale)) return null;
  return Math.round(((regular - sale) / regular) * 100);
};

export default function CompleteTheOutfit({
  currentCategories = [],
  currentProductId,
}) {
  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const targetCategoryIds = [
    ...new Set(
      currentCategories.flatMap(
        (slug) => OUTFIT_CATEGORY_ID_MAP[slug] || []
      )
    ),
  ];

  useEffect(() => {
    if (!targetCategoryIds.length) return;

    const fetchOutfit = async () => {
      const res = await fetch(
        `/api/complete-the-outfit?categories=${targetCategoryIds.join(
          ","
        )}&exclude=${currentProductId}`
      );
      const data = await res.json();
      setProducts(data || []);
    };

    fetchOutfit();
  }, [targetCategoryIds.join(","), currentProductId]);

  if (!products.length) return null;

  return (
    <section className="px-0 lg:px-10 mt-5 lg:mt-12 pb-4 lg:pb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 lg:gap-6">
        {products.map((product) => {
          const inWishlist = isInWishlist(product.id);

          const handleWishlistClick = () => {
            if (inWishlist) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist({
                productId: product.id,
                name: product.name,
                image: product.images?.[0]?.src || "/placeholder.jpg",
                price: parseFloat(
                  product.sale_price || product.price || 0
                ),
                slug: product.slug,
              });
            }
          };

          const sale =
            product.sale_price || product._derived_sale;
          const regular =
            product.regular_price || product._derived_regular;
          const price =
            sale || product._derived_price || product.price;


          const colors =
            product.attributes
              ?.find((a) => a.name.toLowerCase() === "color")
              ?.options || [];

          const limitedColors = colors.slice(0, 3);
          const remaining = colors.length - 3;

          return (
            <div
              key={product.id}
              className="bg-white shadow-sm rounded-none lg:rounded-[10px] flex flex-col items-center overflow-hidden pb-4 relative"
            >
              {/* TAG */}
              {product.tags?.length > 0 && (
                <div className="bg-black/70 px-[7px] py-[5px] lg:px-4 lg:py-2 text-[8px] lg:text-[12px] text-white text-center absolute rounded-2xl z-10 uppercase top-2 left-2">
                  {product.tags[0].name}
                </div>
              )}

              {/* WISHLIST */}
              <div className="bg-white/40 pt-2 px-2 rounded-full absolute z-10 top-2 right-2">
                <button onClick={handleWishlistClick}>
                  <Heart
                    fill={inWishlist ? "red" : "none"}
                    stroke={inWishlist ? "red" : "gray"}
                  />
                </button>
              </div>

              {/* IMAGE */}
              <Link
                href={`/products/${product.slug}`}
                className="w-full relative group"
              >
                <Image
                  src={product.images?.[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  width={600}
                  height={300}
                  className="object-cover object-top max-h-[248px] lg:max-h-[600px] transition-opacity duration-300 group-hover:opacity-0"
                />
                {product.images?.[1]?.src && (
                  <Image
                    src={product.images[1].src}
                    alt={`${product.name} gallery`}
                    width={600}
                    height={300}
                    className="object-cover object-top absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              </Link>

              {/* TITLE + CATEGORY */}
              <div className="flex w-full flex-col border-t lg:flex-row items-start lg:items-center lg:justify-between px-3">
                <div className="flex flex-col gap-1">
                  <Link href={`/products/${product.slug}`} className="hover:underline">
                    <h3 className="mt-4 text-left text-sm lg:text-lg font-semibold">
                      {product.name.length > 35
                        ? product.name.substring(0, 40) + "..."
                        : product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {product.categories?.[0]?.name || ""}
                  </p>
                </div>
              </div>

              {/* COLORS + PRICE */}
              <div className="mt-2 px-3 w-full">
                <div className="flex items-start lg:items-center gap-2 flex-col lg:flex-row justify-between">
                  <div className="flex items-center gap-1">
                    {/* {limitedColors.map((color, i) => (
                      <span
                        key={i}
                        className="inline-block w-3 lg:w-5 h-3 lg:h-5 rounded-full border border-gray-300 hover:border-black"
                        style={{ background: colorMap[color] || "#ccc" }}
                        title={color}
                      />
                    ))}
                    {remaining > 0 && (
                      <span className="underline text-xs lg:text-sm">
                        +{remaining}
                      </span>
                    )} */}
                    <span className="text-gray-400 text-xs lg:text-sm">
                      Colors Available
                    </span>
                  </div>

                  <div className="text-center flex gap-2 items-center">
                    {sale ? (
                      <>
                        <p className="text-md price-font lg:text-lg">
                          D {sale}
                        </p>
                        <p className="text-sm line-through price-font text-gray-500">
                          D {regular}
                        </p>
                        <span className="text-xs bg-red-500 price-font text-white px-2 py-1 rounded-full">
                          {getDiscountPercent(regular, sale)}% OFF
                        </span>
                      </>
                    ) : (
                      <p className="text-md price-font lg:text-lg">
                        D {price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}