// /pages/payment/success.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { Layout } from "../../components";
import Link from "next/link";
import { CheckCircle, ChevronLeft, Package, CreditCard, User, Mail } from "lucide-react";
import { useStateContext } from "../../context/StateContext";
import Image from "next/image";
import { pushEvent } from "../../utils/dataLayer";
import { EVENT_TYPES } from "../../utils/dataLayerEvents";
import { createEventPayloads } from "../../utils/dataLayerPayloads";
import { runConfetti } from "../../utils/utils";

export default function PaymentSuccess() {
  const router = useRouter();
  const { order, payment_id, gateway, status } = router.query;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    if (!order) return;

    async function handlePaymentSuccess() {
      setLoading(true);
      try {
        let paymentVerified = true;

        if (gateway === "rakbank") {
          const verifyRes = await axios.post("/api/rakbank/verify", { orderId: order });
          paymentVerified = verifyRes.data.success;

          if (!paymentVerified) {
            setError("RakBank payment verification failed.");
            setLoading(false);
            return;
          }
        }

        await axios.post("/api/woo/update-payment", {
          orderId: order,
          paymentId: payment_id || "N/A",
          paymentMethod: gateway || "unknown",
          status: paymentVerified ? "success" : "failed",
        });

        const res = await axios.get(`/api/woo/order?orderId=${order}`);
        const fetchedOrder = res.data.order;

        pushEvent(EVENT_TYPES.PURCHASE, createEventPayloads.purchase(fetchedOrder));

        setOrderData(fetchedOrder);
        localStorage.clear();
        setCartItems([]);
        setTotalPrice(0);
        setTotalQuantities(0);
        runConfetti();
      } catch (err) {
        console.error("Error updating/fetching order:", err);
        setError("Payment update failed or order not found.");
      } finally {
        setLoading(false);
      }
    }
    handlePaymentSuccess();
  }, [order, payment_id, gateway, status, setCartItems, setTotalPrice, setTotalQuantities]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-12">{error}</div>;
  if (!orderData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'processing':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-[180px] lg:mt-[140px] mb-16 px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-5 py-12 px-6 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl relative">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-green-700 mb-4">
            Order #{orderData.id} Confirmed
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
        </div>

        <div className="space-y-5">
          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <Package size={20} className="text-gray-600" />
              <h2 className="text-xl  text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-lg  text-gray-900">#{orderData.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full capitalize text-sm font-medium ${getStatusColor(orderData.status)}`}>
                    {orderData.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-xl  text-green-600">
                    {orderData.total} {orderData.currency}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg  text-gray-900">
                    {new Date(orderData.date_created).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <User size={20} className="text-gray-600" />
                <h3 className="text-lg  text-gray-900">Customer Information</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Name</span>
                    <span className="text-sm  text-gray-900">
                      {orderData.billing?.first_name} {orderData.billing?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <span className="text-sm  text-gray-900">{orderData.billing?.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <span className="text-sm  text-gray-900">
                      {orderData.billing?.phone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <CreditCard size={20} className="text-gray-600" />
                <h3 className="text-lg  text-gray-900">Payment Information</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Method</span>
                    <span className="text-sm  text-gray-900">
                      {orderData.payment_method_title || 'N/A'}
                    </span>
                  </div>
                  {orderData.meta_data?.find((m) => m.key === "payment_id") && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-500">Payment ID</span>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {orderData.meta_data.find((m) => m.key === "payment_id").value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <Package size={20} className="text-gray-600" />
              <h3 className="text-lg  text-gray-900">Order Items</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {orderData.line_items.map((item) => (
                  <div key={item.id} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className=" text-gray-900 mb-2">{item.name}</h4>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span className=" text-gray-700">
                            {item.total} {orderData.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Item Meta Data */}
                    {item.meta_data?.filter((meta) => !meta.key.startsWith("_"))?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 mt-3">
                        {item.meta_data
                          .filter((meta) => !meta.key.startsWith("_"))
                          .map((meta) => {
                            const isImage = typeof meta.value === "string" && 
                              meta.value.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                            return (
                              <div key={meta.id} className="flex items-center gap-3 mb-2 last:mb-0">
                                <span className="text-sm font-medium text-gray-500 min-w-20">
                                  {meta.key}:
                                </span>
                                {isImage ? (
                                  <div className="mt-1">
                                    <Image 
                                      height={60} 
                                      width={60} 
                                      src={meta.value} 
                                      alt={item.name}
                                      className="rounded-lg border border-gray-200 object-cover"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-700">{meta.value}</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700  hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <ChevronLeft size={20} />
              Continue Shopping
            </Link>
            <Link 
              href="/my-account" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg  hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View All Orders
            </Link>
          </div>

          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Need help with your order?{' '}
              <Link href="/contact" className="text-black-600  hover:text-gray-700 hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}