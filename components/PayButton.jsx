"use client";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { pushEvent } from "../utils/dataLayer";
import { EVENT_TYPES } from "../utils/dataLayerEvents";
import { createEventPayloads } from "../utils/dataLayerPayloads";

const PayButton = ({ cartItems, totalPrice }) => {
  const router = useRouter();

  const handleCheckout = () => {
    pushEvent(EVENT_TYPES.BEGIN_CHECKOUT, createEventPayloads.viewCart(cartItems));
    if (!cartItems.length) return toast.error("Your cart is empty.");
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-all"
    >
      Checkout
    </button>
  );
};

export default PayButton;