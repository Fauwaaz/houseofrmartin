"use client";
import axios from "axios";
import { useRouter } from "next/router";

const PayButton = ({ cartItems, totalPrice }) => {
  const router = useRouter();

  const handlePayment = async () => {
    try {
      const orderId = "ORDER-" + Date.now(); // unique order id

      const { data } = await axios.post("/api/rakbank/checkout", {
        cartItems,
        totalAmount: totalPrice,
        orderId,
      });

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl; // redirect to RakBankPay page
      } else {
        alert("Failed to start payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Try again.");
      router.push('/payment/cancel')
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      Pay Now with Rakbank
    </button>
  );
};

export default PayButton;