// pages/wishlist.js
import { Layout } from "../components";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { useWishlist } from "../context/WishListStateContext";
import { useStateContext } from "../context/StateContext";
import Image from "next/image";
import Link from "next/link";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";

const WishlistPage = () => {
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
          {wishlist.map((item) => (
            <li
              key={`${item.productId}-${item.variationId}`}
              className="border p-4 rounded-md flex bg-white/50 gap-4 flex-col md:flex-row items-start"
            >
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
                <p className="text-gray-600">
                  Price:&nbsp;<span className="price-font">D</span>
                  {item.price}
                </p>
                <p>{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/products/${item.slug}`}
                    className="bg-black text-center text-white px-3 py-1 rounded"
                  >
                    View Product
                  </Link>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      removeFromWishlist(item.productId, item.variationId)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Layout>
  );
};

export default WishlistPage;

// Server-side protection
export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.session;

  if (!token) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  try {
    // Verify JWT
    jwt.verify(token, SECRET_KEY);

    // Allow access
    return { props: {} };
  } catch (err) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
}