import { useState } from "react";
import Image from "next/image";
import { useStateContext } from "../../context/StateContext";
import { useWishlist } from "../../context/WishListStateContext";

const WishlistItem = ({ item, product }) => {
  const { onAdd } = useStateContext();
  const { removeFromWishlist } = useWishlist();

  const variants = product.variations?.nodes || [];
  const colors = Array.from(
    new Set(
      variants.map(v => 
        v.attributes?.nodes?.find(a => a.name.toLowerCase() === "pa_color")?.value || "Default"
      )
    )
  );

  const sizes = Array.from(
    new Set(
      variants.map(v => 
        v.attributes?.nodes?.find(a => a.name.toLowerCase() === "pa_size")?.value || "Default"
      )
    )
  );

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  const selectedVariant = variants.find(v => {
    const color = v.attributes?.nodes?.find(a => a.name.toLowerCase() === "pa_color")?.value;
    const size = v.attributes?.nodes?.find(a => a.name.toLowerCase() === "pa_size")?.value;
    return color === selectedColor && size === selectedSize;
  });

  const price = selectedVariant?.price || product.price;
  const image = selectedVariant?.image?.sourceUrl || product.featuredImage?.node?.sourceUrl || "/placeholder.jpg";

  return (
    <div className="flex gap-4 items-center border-b py-4">
      <Image src={image} alt={product.name} width={80} height={80} className="object-contain" />
      
      <div className="flex-1">
        <h2 className="font-semibold">{product.name}</h2>
        <p className="text-gray-600">Price: D{price}</p>

        <div className="flex gap-2 mt-2">
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border rounded p-1"
          >
            {colors.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border rounded p-1"
          >
            {sizes.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onAdd({
              id: selectedVariant?.id || product.id,
              name: product.name,
              price,
              image,
              color: selectedColor,
              size: selectedSize,
              quantity: 1,
            }, 1)}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Add to Bag
          </button>

          <button
            onClick={() => removeFromWishlist(product.id, selectedVariant?.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;