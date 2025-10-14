import { Layout } from "../components";
import { useWishlist } from "../context/WishListStateContext";
import WishlistItem from "../components/common/WishListItem";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen items-center justify-center px-4 lg:px-10">
        <h1 className="text-2xl lg:text-4xl mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <WishlistItem key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;