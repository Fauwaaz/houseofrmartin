"use client";
import Image from "next/image";
import { useWishlist } from "../../context/WishListStateContext";

const WishlistItem = ({ product }) => {
  const { removeFromWishlist } = useWishlist();

  const handleAddToCart = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?wc-ajax=add_to_cart`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: product.product_id,
        variation_id: product.variation_id || "",
        quantity: 1,
      }),
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border flex flex-col items-center justify-between">
      <Image
        src={product.image || "/placeholder.jpg"}
        alt={product.name}
        width={150}
        height={150}
        className="object-contain mb-2"
      />
      <p className="font-medium text-center text-sm mb-2">{product.name}</p>

      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-3 py-1 rounded text-xs uppercase"
        >
          Add to Bag
        </button>
        <button
          onClick={() => removeFromWishlist(product.product_id)}
          className="border border-black text-black px-3 py-1 rounded text-xs uppercase"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;