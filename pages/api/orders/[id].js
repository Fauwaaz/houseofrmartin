"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/woocommerce";

const OrderPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to fetch order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-10">No order found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <p>Status: <span className="font-semibold">{order.status}</span></p>
      <p>Total: <span className="font-semibold">D {order.total}</span></p>
      <p>Payment Method: <span className="font-semibold">{order.payment_method_title}</span></p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Items:</h2>
      <ul className="space-y-4">
        {order.line_items.map((item) => (
          <li key={item.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-semibold">D {item.total}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Billing Details:</h2>
      <p>{order.billing.first_name} {order.billing.last_name}</p>
      <p>{order.billing.address_1}, {order.billing.city}</p>
      <p>{order.billing.state}, {order.billing.postcode}</p>
      <p>{order.billing.country}</p>
      <p>Email: {order.billing.email}</p>
      <p>Phone: {order.billing.phone}</p>
    </div>
  );
};

export default OrderPage;