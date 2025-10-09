"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Cart, CartButton } from "../components";

const Checkout = () => {
  const router = useRouter();
  const { cartItems, totalPrice, setCartItems } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [shippingCharge] = useState(10);
  const finalTotal = (Number(totalPrice) + shippingCharge).toFixed(2);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "AE",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/user/profile");
        if (data.success && data.user) {
          const meta = data.user.meta || {};
          setUser({
            first_name: meta.first_name ?? "",
            last_name: meta.last_name ?? "",
            email: data.user.user_email ?? "",
            phone: meta.billing_phone ?? "",
            address: meta.billing_address_1 ?? "",
            city: meta.billing_city ?? "",
            state: meta.billing_state ?? "",
            zip: meta.billing_postcode ?? "",
            country: meta.billing_country ?? "AE",
          });
        }
      } catch (err) {
        console.error("User profile load failed:", err);
      }
    };
    fetchProfile();
  }, []);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return toast.error("Your cart is empty.");

    setLoading(true);
    try {
      const userData = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
      };

      const { data } = await axios.post("/api/woo/create-order", {
        cartItems,
        user: userData,
        paymentMethod: "cod",
        shippingCharge,
      });

      if (data.success) {
        toast.success("Order placed successfully!");
        setCartItems([]);
        router.push(`/payment/success?order=${data.order.id}`);
      } else {
        toast.error(data.error?.message || "Order failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-10">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="mb-10 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={180} height={60} unoptimized />
          </Link>
          <Cart />
          <CartButton />
        </header>

        <h1 className="text-2xl mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl mb-4">Billing Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={user.first_name}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={user.last_name}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                className="border p-2 rounded-md"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              type="text"
              placeholder="Phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              type="text"
              placeholder="Address"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="border p-2 rounded-md w-full mt-3"
            />
            <div className="grid grid-cols-3 gap-3 mt-3">
              <input
                type="text"
                placeholder="City"
                value={user.city}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="State"
                value={user.state}
                onChange={(e) => setUser({ ...user, state: e.target.value })}
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Postcode"
                value={user.zip}
                onChange={(e) => setUser({ ...user, zip: e.target.value })}
                className="border p-2 rounded-md"
              />
            </div>
              <input type="text" placeholder="Country" value={user.country} onChange={(e) => setUser({ ...user, country: e.target.value })} className="border p-2 rounded-md w-full mt-3" />
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-xl mb-4">Your Order</h2>
            <div className="border rounded-md p-4 bg-gray-50 space-y-3">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <div>
                      <p>{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x <span className="price-font">D</span> {item.price}
                      </p>
                    </div>
                  </div>
                  <p>
                    <span className="price-font">D</span>{" "}
                    {(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between mt-3 text-sm">
                <p>Subtotal:</p>
                <p><span className="price-font">D</span> {totalPrice.toFixed(2)}</p>
              </div>

              <div className="flex justify-between text-sm">
                <p>Shipping:</p>
                <p><span className="price-font">D</span> {shippingCharge.toFixed(2)}</p>
              </div>

              <div className="flex justify-between text-lg mt-3 border-t pt-3">
                <p>Total:</p>
                <p><span className="price-font">D</span> {finalTotal}</p>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-6 w-full py-3 text-center bg-black text-white rounded-md hover:bg-gray-900 transition-all disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1 mt-5 text-sm hover:underline">
          <ChevronLeft size={16} /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default Checkout;