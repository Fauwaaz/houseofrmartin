import { useRouter } from "next/router";
import { useEffect } from "react";
import api from "../../utils/woocommerce";
import axios from "axios";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    const confirmPayment = async () => {
      if (!orderId) return;

      // ✅ Verify payment with RakBankPay
      const verify = await axios.post("/api/rakbank/verify", { orderId });

      if (verify.data.success) {
        // ✅ Mark WooCommerce order as paid
        await api.put(`orders/${verify.data.wooOrderId}`, {
          set_paid: true,
          status: "processing",
          transaction_id: verify.data.transactionId,
        });
      }
    };

    confirmPayment();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">✅ Payment Successful</h1>
      <p>Your order has been placed!</p>
    </div>
  );
}