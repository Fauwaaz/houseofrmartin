import { Layout } from "../components";
import { useWishlist } from "../context/WishListStateContext";
import { useStateContext } from "../context/StateContext";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { onAdd } = useStateContext();

    if (!wishlist.length) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    Your wishlist is empty.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mt-[120px] lg:mt-[80px] py-6 px-3">
                <h1 className="text-2xl mb-4">Your Wishlist</h1>
                <ol className="space-y-6">
                    {wishlist.map((item, idx) => {
                        // const [selectedSize, setSelectedSize] = useState(item.size);
                        // const [selectedColor, setSelectedColor] = useState(item.color);
                        // const [quantity, setQuantity] = useState(item.quantity || 1);

                        return (
                            <li key={`${item.productId}-${item.variationId}`} className="border p-4 rounded-md flex bg-white/50 gap-4 flex-col md:flex-row items-start">
                                <div className="relative flex-shrink-0">
                                    <Link href={`/products/${item.slug}`}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            className="object-contain rounded-md"
                                        />
                                    </Link>
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-2">
                                    <Link href={`/products/${item.slug}`}>
                                        <h2 className="text-lg">{item.name}</h2>
                                    </Link>
                                    <p className="text-gray-600">Price:&nbsp;<span className="price-font">D</span>{item.price}</p>
                                    <p>{item.description}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Link href={`/products/${item.slug}`} className="bg-black text-center text-white px-3 py-1 rounded">
                                            View Product
                                        </Link>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => removeFromWishlist(item.productId, item.variationId)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {/* <div className="flex gap-2 flex-wrap">
                                        <div>
                                            <label className="text-sm block">Size:</label>
                                            <select
                                                value={selectedSize}
                                                onChange={(e) => setSelectedSize(e.target.value)}
                                                className="border rounded p-1"
                                            >
                                                <option value={item.size}>{item.size}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm block">Color:</label>
                                            <select
                                                value={selectedColor}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                className="border rounded p-1"
                                            >
                                                <option value={item.color}>{item.color}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm block">Qty:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="border rounded p-1 w-20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="bg-black text-white px-3 py-1 rounded"
                                            onClick={() => {
                                                onAdd({
                                                    id: item.variationId,
                                                    name: item.name,
                                                    price: item.price || 0,
                                                    image: item.image,
                                                    size: selectedSize,
                                                    color: selectedColor,
                                                    slug: item.slug,
                                                    quantity
                                                }, quantity);
                                            }}
                                        >
                                            Add to Bag
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => removeFromWishlist(item.productId, item.variationId)}
                                        >
                                            Remove
                                        </button>
                                    </div> */}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </Layout>
    );
};

export default Wishlist;