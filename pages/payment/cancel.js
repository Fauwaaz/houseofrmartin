"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "../../components";
import { XCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  const router = useRouter();
  const { order, payment_id, gateway } = router.query;
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!order) return;

    async function updateOrderStatus() {  
      try {
        await axios.post("/api/woo/update-payment", {
          orderId: order,
          paymentId: payment_id || "N/A",
          paymentMethod: gateway || "unknown",
          status: "failed",
        });
      } catch (err) {
        console.error("Failed to mark order as failed:", err);
      } finally {
        setUpdated(true);
      }
    }

    updateOrderStatus();
  }, [order, payment_id, gateway]);

  if (!updated) return <div className="p-20 text-center">Processing...</div>;

  return (
    <Layout>
      <div className="max-w-[600px] mx-auto mt-[120px] mb-[40px] text-center">
        <h1 className="flex justify-center items-center gap-2 text-red-600 text-2xl font-semibold">
          <XCircle color="red" /> Payment Failed
        </h1>
        <p className="text-gray-600 mt-2">
          Unfortunately, your payment could not be processed or was cancelled.
        </p>

        <div className="bg-gray-100 p-6 mt-6 rounded-xl">
          <p><strong>Order ID:</strong> {order}</p>
        </div>

        <div className="mt-6">
          <Link href="/products" className="flex justify-center gap-2 items-center mt-4 text-gray-800 hover:underline">
            <ChevronLeft /> Return to Shop
          </Link>
        </div>
      </div>
    </Layout>
  );
}