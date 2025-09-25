import Link from "next/link";
import { Home, Grid, Heart, User } from "lucide-react";

const FooterBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-black">
          <Home size={22} />
          <span className="text-[11px]">Home</span>
        </Link>

        <Link href="/products" className="flex flex-col items-center text-gray-700 hover:text-black">
          <Grid size={22} />
          <span className="text-[11px]">Collections</span>
        </Link>

        <Link href="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-black">
          <Heart size={22} />
          <span className="text-[11px]">Wishlist</span>
        </Link>

        <Link href="/my-account" className="flex flex-col items-center text-gray-700 hover:text-black">
          <User size={22} />
          <span className="text-[11px]">Account</span>
        </Link>
      </div>
    </div>
  );
};

export default FooterBar;