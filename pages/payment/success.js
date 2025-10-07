import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function PaymentSuccess() {
  const router = useRouter();
  const { order } = router.query;
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (order) {
      fetchOrderDetails();
    }

    async function fetchOrderDetails() {
      try {
        const { data } = await axios.get(`/api/woo/order?orderId=${order}`);
        setOrderData(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    }
  }, [order]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful 🎉</h1>

        {orderData ? (
          <div className="border-t border-gray-200 pt-4 text-left">
            <p><strong>Order ID:</strong> {orderData.id}</p>
            <p><strong>Total:</strong> {orderData.total} {orderData.currency}</p>
            <p><strong>Status:</strong> {orderData.status}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading order details...</p>
        )}
      </div>
    </div>
  );
}