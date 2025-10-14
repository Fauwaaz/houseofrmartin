"use client";
import { useEffect, useState } from "react";
import client from "../../libs/apollo";
import { GET_ALL } from "../../utils/queries";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishListStateContext";
import { colorMap } from "../../utils/data";

const getDiscountPercent = (regular, sale) => {
  if (!regular || !sale || parseFloat(regular) <= parseFloat(sale)) return null;
  return Math.round(((regular - sale) / regular) * 100);
};

export default function RandomProductCard() {
  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await client.query({ query: GET_ALL });
        const all = res?.data?.products?.nodes || [];
        setProducts(all.sort(() => 0.5 - Math.random()).slice(0, 4)); // Random 4
      } catch (error) {
        console.error("Error fetching random products:", error);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0)
    return (
      <div className="text-center text-gray-500 py-10">
        No products found from API.
      </div>
    );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-10">
      {products.map((product) => {
        const inWishlist = isInWishlist(product.id);
        let firstVariation = null;
        let displayPrice = null;

        if (
          product.__typename === "VariableProduct" &&
          product.variations?.nodes?.length > 0
        ) {
          const sorted = [...product.variations.nodes].sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
          firstVariation = sorted[0];
          displayPrice = firstVariation.price;
        }

        const handleWishlistClick = () => {
          if (inWishlist) {
            removeFromWishlist(product.id);
          } else {
            addToWishlist({
              productId: product.id,
              name: product.name,
              image: product.featuredImage?.node?.sourceUrl || "/placeholder.jpg",
              price:
                product.__typename === "VariableProduct"
                  ? parseFloat(product.variations?.nodes?.[0]?.price || 0)
                  : parseFloat(product.price || 0),
              slug: product.slug,
            });
          }
        };

        return (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg flex flex-col items-center overflow-hidden pb-4 relative transition-transform duration-200 hover:scale-[1.02]"
          >
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-10 bg-white/60 rounded-full p-1 hover:bg-white">
              <button onClick={handleWishlistClick}>
                <Heart
                  size={20}
                  fill={inWishlist ? "red" : "none"}
                  stroke={inWishlist ? "red" : "gray"}
                />
              </button>
            </div>

            {/* Product Image */}
            <Link href={`/products/${product.slug}`} className="w-full group">
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={
                    product.featuredImage?.node?.sourceUrl || "/placeholder.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="px-3 mt-3 w-full text-center">
              <Link
                href={`/products/${product.slug}`}
                className="hover:underline text-sm lg:text-lg font-semibold"
              >
                {product.name.length > 45
                  ? product.name.substring(0, 45) + "..."
                  : product.name}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                {product.productCategories?.nodes?.[0]?.name || ""}
              </p>

              {/* Colors */}
              <div className="flex justify-center gap-1 mt-2">
                {product.attributes?.nodes
                  ?.filter((attr) => attr.name === "pa_color")
                  ?.flatMap((attr) => attr.options)
                  ?.slice(0, 3)
                  .map((color, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: colorMap[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
              </div>

              {/* Price */}
              <div className="mt-2">
                {product.__typename === "SimpleProduct" && (
                  <div className="text-center">
                    {product.salePrice ? (
                      <>
                        <p className="text-md font-bold text-red-600">
                          D {product.salePrice}
                        </p>
                        <p className="text-sm line-through text-gray-400">
                          D {product.regularPrice}
                        </p>
                      </>
                    ) : (
                      <p className="text-md font-semibold">
                        D {product.regularPrice}
                      </p>
                    )}
                  </div>
                )}

                {product.__typename === "VariableProduct" && firstVariation && (
                  <div className="text-center">
                    <p className="text-md font-semibold">
                      D {firstVariation.salePrice || firstVariation.regularPrice}
                    </p>
                    {firstVariation.salePrice && (
                      <p className="text-sm line-through text-gray-400">
                        D {firstVariation.regularPrice}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}