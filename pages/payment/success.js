import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading"
import { Layout } from "../../components";
import Link from "next/link";
import { CheckCircle, CheckCircle2Icon, ChevronLeft } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const { order } = router.query;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order) return;

    async function fetchOrder() {
      try {
        const res = await axios.get(`/api/woo/order?orderId=${order}`);
        setOrderData(res.data.order);
      } catch (err) {
        setError("Failed to fetch order details");
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [order]);

  if (loading) return <div><Loading /></div>;
  if (error) return <div style={{ textAlign: "center", padding: "50px" }}>{error}</div>;
  if (!orderData) return null;

  return (
    <Layout>
      <div style={{ maxWidth: "700px", marginTop: "120px", marginBottom: "40px", textAlign: "left" }}>
        <h1 className="flex gap-2"><CheckCircle color="green" /> Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been received.</p>

        <div style={{ background: "#f9f9f9", padding: "20px", marginTop: "30px", borderRadius: "10px" }}>
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {orderData.id}</p>
          <p><strong>Status:</strong> {orderData.status}</p>
          <p><strong>Total:</strong> <span className="price-font">D</span> {orderData.total} </p>

          <h4 style={{ marginTop: "20px" }}>Items:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {orderData.line_items.map((item) => (
              <li key={item.id} style={{ margin: "10px 0", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                <strong>{item.name}</strong> × {item.quantity} — {item.total} {orderData.currency}
                {item.meta_data?.map((meta) => (
                  <div key={meta.id} style={{ fontSize: "0.9em", color: "#555" }}>
                    {meta.key}: {meta.value}
                  </div>
                ))}
              </li>
            ))}
          </ul>
          <Link href='/products' className="rounded-lg text-black flex gap-2 items-center hover:underline"><ChevronLeft /> Return to Shop</Link>
        </div>
      </div>
    </Layout>
  );
}
