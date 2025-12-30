"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Head from "next/head";

const Checkout = () => {
  const router = useRouter();
  const { cartItems, totalPrice, setCartItems, discountAmount, coupon } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(8);
  const [codCharge, setCodCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("ccavenue");
  const [errors, setErrors] = useState({});

  const subtotalAfterDiscount = Number(totalPrice) - Number(discountAmount);
  const finalTotal = (
    subtotalAfterDiscount +
    shippingCharge +
    codCharge
  ).toFixed(2);


  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "AE",
  });

  const countriesData = {
    Bahrain: {
      "Capital Governorate": ["Manama"],
      "Northern Governorate": ["Budaiya", "Diraz", "Hamad Town"],
      "Southern Governorate": ["Riffa", "Isa Town"],
      "Muharraq Governorate": ["Muharraq", "Hidd"],
    },
    Kuwait: {
      "Al Ahmadi": ["Ahmadi City", "Fahaheel"],
      "Al Asimah": ["Kuwait City"],
      Hawalli: ["Hawalli City", "Salmiya"],
      Farwaniya: ["Farwaniya City", "Khaitan"],
      Jahra: ["Jahra City"],
      "Mubarak Al-Kabeer": ["Mangaf", "Abu Halifa"],
    },
    Oman: {
      "Muscat Governorate": ["Muscat", "Seeb", "Muttrah"],
      Dhofar: ["Salalah", "Taqah"],
      "Al Batinah North": ["Sohar", "Shinas"],
      "Al Batinah South": ["Rustaq", "Nakhal"],
      "Al Dakhiliyah": ["Nizwa", "Bahla"],
      "Al Sharqiyah North": ["Ibra", "Al Qabil"],
      "Al Sharqiyah South": ["Sur", "Jaalan Bani Bu Ali"],
      "Al Dhahirah": ["Ibri"],
      "Al Wusta": ["Haima"],
      Musandam: ["Khasab"],
    },
    'United Arab Emirates': {
      "Abu Dhabi Emirate": ["Abu Dhabi City", "Al Ain", "Al Dhafra"],
      "Dubai Emirate": ["Dubai"],
      "Sharjah Emirate": ["Sharjah City", "Khor Fakkan"],
      "Ajman Emirate": ["Ajman City"],
      "Umm Al Quwain Emirate": ["Umm Al Quwain City"],
      "Ras Al Khaimah Emirate": ["Ras Al Khaimah City"],
      "Fujairah Emirate": ["Fujairah City", "Dibba"],
    },
    "Saudi Arabia": {
      "Riyadh Region": ["Riyadh", "Al Kharj", "Buraydah"],
      "Makkah Region": ["Jeddah", "Mecca", "Ta'if"],
      "Madinah Region": ["Medina", "Yanbu"],
      "Eastern Province (Ash Sharqiyah)": ["Dammam", "Dhahran", "Al Khobar"],
      "Qassim Region": ["Buraidah", "Unaizah"],
      "Asir Region": ["Abha", "Khamis Mushait"],
      "Tabuk Region": ["Tabuk", "Umluj"],
      "Hail Region": ["Hail"],
      "Northern Borders": ["Arar"],
      "Jazan Region": ["Jizan"],
      "Najran Region": ["Najran"],
      "Al Bahah Region": ["Al Bahah"],
    },
  };

  const states = user.country ? Object.keys(countriesData[user.country] || {}) : [];
  const cities =
    user.state && user.country
      ? countriesData[user.country][user.state] || []
      : [];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/user/profile");
        if (!data.success) return router.push("/auth");
        if (data.user) {
          const meta = data.user.meta || {};
          setUser({
            first_name: meta.first_name || "",
            last_name: meta.last_name || "",
            email: data.user.user_email || "",
            phone: meta.billing_phone || "",
            address: meta.billing_address_1 || "",
            city: meta.billing_city || "",
            state: meta.billing_state || "",
            zip: meta.billing_postcode || "",
            country: meta.billing_country || "AE",
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
        router.push("/auth");
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    // COD charge is ALWAYS 10
    if (paymentMethod === "cod") {
      setCodCharge(10);
    } else {
      setCodCharge(0);
    }

    // SHIPPING charge depends on cart total
    if (totalPrice >= 150) {
      setShippingCharge(0);
    } else {
      setShippingCharge(15);
    }
  }, [paymentMethod, totalPrice]);




  const handlePlaceOrder = async () => {
    if (!cartItems.length) return toast.error("Your cart is empty.");

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "address",
      "address2",
      "city",
      "state",
      "country",
    ];


    let newErrors = {};
    for (const field of requiredFields) {
      const value = String(user[field] ?? "").trim();
      if (!value) newErrors[field] = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = document.querySelector(
        `[data-field="${Object.keys(newErrors)[0]}"]`
      );
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Please fill in all required fields");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const userData = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        address: user.address + " " + user.address2,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
      };

      const { data: orderRes } = await axios.post("/api/woo/create-order", {
        cartItems,
        user: userData,
        paymentMethod,
        shippingCharge,
        codCharge,
        discountAmount,
        finalTotal,
        couponCode: coupon?.code || null,
      });

      if (!orderRes.success || !orderRes.order?.id) {
        toast.error(orderRes.error?.message || "Failed to create order");
        return;
      }

      const orderId = orderRes.order.id;

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully!");
        setCartItems([]);
        return router.push(`/payment/success?order=${orderId}`);
      }

      if (paymentMethod === "rakbank") {
        try {
          const { data } = await axios.post("/api/rakbank/initiate", {
            orderId,
            amount: finalTotal,
            user: userData,
            cartItems,
            redirectUrl: `${window.location.origin}/payment/success?order=${orderId}`,
            cancelUrl: `${window.location.origin}/payment/cancel?order=${orderId}`,
          });

          const sessionId = data?.sessionId;
          if (!sessionId) {
            toast.error("RakBankPay session creation failed");
            return;
          }

          const existingScript = document.querySelector('script[src*="checkout.js"]');
          if (existingScript) existingScript.remove();

          const script = document.createElement("script");
          script.src = "https://rakbankpay-nam.gateway.mastercard.com/static/checkout/checkout.min.js";
          script.async = true;

          window.errorCallback = function (error) {
            console.error("RakBankPay error:", error);
            toast.error("Payment failed. Please try again.");
          };
          window.cancelCallback = function () {
            window.location.href = `${window.location.origin}/payment/cancel?order=${orderId}`;
          };
          window.completeCallback = function () {
            window.location.href = `${window.location.origin}/payment/success?order=${orderId}`;
          };

          script.onload = () => {
            const interval = setInterval(() => {
              if (window.Checkout && typeof window.Checkout.configure === "function") {
                clearInterval(interval);

                window.Checkout.configure({
                  session: { id: sessionId },
                });

                window.Checkout.showPaymentPage();
              }
            }, 200);
          };

          document.body.appendChild(script);
        } catch (err) {
          console.error("RakBankPay initiate error:", err);
          toast.error("RakBankPay initiate failed");
        }
      }

      if (paymentMethod === "ccavenue") {
        const { data } = await axios.post("/api/ccavenue/initiate", {
          orderId,
          amount: finalTotal,
          user: userData,
          cartItems,
          redirectUrl: `${window.location.origin}/payment/success?order=${orderId}`,
          cancelUrl: `${window.location.origin}/payment/cancel?order=${orderId}`,
        });
        if (data?.encRequest && data?.transactionUrl) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.transactionUrl;

          const input1 = document.createElement("input");
          input1.type = "hidden";
          input1.name = "encRequest";
          input1.value = data.encRequest;
          form.appendChild(input1);

          const input2 = document.createElement("input");
          input2.type = "hidden";
          input2.name = "access_code";
          input2.value = data.accessCode;
          form.appendChild(input2);

          document.body.appendChild(form);
          form.submit();
        } else toast.error("CC Avenue payment failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout - House of R-Martin</title>
        <meta name="description" content="Checkout | House of R-Martin" />
        <link rel="icon" href="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/11/favicon.png" />
      </Head>
      <div className="min-h-screen bg-white px-4 md:px-10">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <header className="mb-10 flex justify-start items-center">
            <Link href="/">
              <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/logo.webp" alt="Logo" width={180} height={60} unoptimized />
            </Link>
          </header>

          <h1 className="text-2xl mb-6">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl mb-4">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  data-field="first_name"
                  type="text"
                  placeholder="First Name"
                  value={user.first_name}
                  onChange={(e) => {
                    setUser({ ...user, first_name: e.target.value });
                    if (errors.first_name) setErrors({ ...errors, first_name: false });
                  }}
                  className={`border p-2 rounded-md ${errors.first_name ? "border-red-500" : ""}`}
                  required
                />
                <input
                  data-field="last_name"
                  type="text"
                  placeholder="Last Name"
                  value={user.last_name}
                  onChange={(e) => {
                    setUser({ ...user, last_name: e.target.value });
                    if (errors.last_name) setErrors({ ...errors, last_name: false });
                  }}
                  className={`border p-2 rounded-md ${errors.last_name ? "border-red-500" : ""}`}
                  required
                />
              </div>

              <input
                data-field="email"
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
                className={`border p-2 rounded-md w-full mt-3 ${errors.email ? "border-red-500" : ""}`}
                required
              />

              <input
                data-field="phone"
                type="text"
                placeholder="Phone"
                value={user.phone}
                onChange={(e) => {
                  setUser({ ...user, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: false });
                }}
                className={`border p-2 rounded-md w-full mt-3 ${errors.phone ? "border-red-500" : ""}`}
                required
              />

              {/* Address Line 1 */}
              <input
                data-field="address"
                type="text"
                placeholder="Street, Building name/no"
                value={user.address}
                onChange={(e) => {
                  setUser({ ...user, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: false });
                }}
                className={`border p-2 rounded-md w-full mt-3 ${errors.address ? "border-red-500" : ""}`}
                required
              />

              {/* Address Line 2 */}
              <input
                data-field="address2"
                type="text"
                placeholder="Apartment/Villa/Room Number"
                value={user.address2}
                onChange={(e) => {
                  setUser({ ...user, address2: e.target.value });
                  if (errors.address2) setErrors({ ...errors, address2: false });
                }}
                className={`border p-2 rounded-md w-full mt-3 ${errors.address2 ? "border-red-500" : ""}`}
                required
              />

              {/* Country - FIXED: Spread existing 'user' state to keep other fields */}
              <select
                data-field="country"
                value={user.country}
                onChange={(e) => {
                  // FIX: Use spread operator to preserve existing user details
                  setUser({ ...user, country: e.target.value, state: "", city: "" });
                  if (errors.country) setErrors({ ...errors, country: false });
                }}
                className={`border p-2 rounded-md w-full mt-3 ${errors.country ? "border-red-500" : ""}`}
                required
              >
                <option value="">Select Country</option>
                {Object.keys(countriesData).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-3 mt-3">
                {/* State - FIXED: Spread existing 'user' state to keep other fields */}
                <select
                  data-field="state"
                  value={user.state}
                  onChange={(e) => {
                    // FIX: Use spread operator to preserve existing user details
                    setUser({ ...user, state: e.target.value, city: "" });
                    if (errors.state) setErrors({ ...errors, state: false });
                  }}
                  className={`border p-2 rounded-md ${errors.state ? "border-red-500" : ""}`}
                  required
                  disabled={!user.country}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                {/* City - FIXED: Spread existing 'user' state to keep other fields */}
                <select
                  data-field="city"
                  value={user.city}
                  onChange={(e) => {
                    // FIX: Use spread operator to preserve existing user details
                    setUser({ ...user, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: false });
                  }}
                  className={`border p-2 rounded-md ${errors.city ? "border-red-500" : ""}`}
                  required
                  disabled={!user.state}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                {/* PO Box (Optional) - FIXED: Spread existing 'user' state to keep other fields */}
                <input
                  type="text"
                  placeholder="PO Box (Optional)"
                  value={user.zip}
                  onChange={(e) => setUser({ ...user, zip: e.target.value })}
                  className="border p-2 rounded-md"
                />
              </div>
            </div>

            {/* Order Summary (unchanged) */}
            <div>
              <h2 className="text-xl mb-4">Your Order</h2>
              <div className="border rounded-md p-4 bg-gray-50 space-y-3">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-3">
                      <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md object-cover" unoptimized />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-500 ">
                          {item.color}, {item.size}, {item.quantity} x <span className="price-font">D</span> {item.price}
                        </p>
                      </div>
                    </div>
                    <p>
                      <span className="price-font">D</span> {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}

                <p className="text-sm text-center mb-2 bg-green-100 rounded text-green-700 border border-dashed border-green-500 p-1">Free shipping order above — <span className="price-font">D</span>150</p>

                <div className="flex justify-between mt-3 text-sm">
                  <p>Subtotal:</p>
                  <p><span className="price-font">D</span> {totalPrice.toFixed(2)}</p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Shipping:</p>
                  {shippingCharge === 0 ? (
                    <p className="text-green-600 font-medium">Free Shipping</p>
                  ) : (
                    <p>
                      + <span className="price-font">D</span> {shippingCharge}
                    </p>
                  )}
                </div>

                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-sm text-red-600">
                    <p>COD Charge:</p>
                    <p>
                      + <span className="price-font">D</span> 10
                    </p>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <p>
                      Discount {coupon ? `(${coupon.code.toUpperCase()})` : ""}:
                    </p>
                    <p>
                      - <span className="price-font">D</span> {discountAmount.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-lg mt-3 border-t pt-3">
                  <p>Total:</p>
                  <p><span className="price-font">D</span> {finalTotal}</p>
                </div>
              </div>

              {/* Payment Method Selection (unchanged) */}
              <div className="mt-6 border rounded-md p-4 bg-white">
                <h3 className="font-medium mb-2">Select Payment Method</h3>
                <div className="flex flex-col flex-wrap gap-4 items-start">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="ccavenue" checked={paymentMethod === "ccavenue"} onChange={() => setPaymentMethod("ccavenue")} />
                    <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/0002309_ccavenue-payment-module-e1759992127347.png" alt="CC Avenue" width={90} height={40} unoptimized /> /
                    <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/12/Apple_Pay-Logo.wine_-scaled.png" alt="apple_pay" width={55} height={40} unoptimized /> /
                    <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/12/Google_Pay_Logo.svg_.png" alt="google_pay" width={45} height={40} unoptimized />
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="rakbank" checked={paymentMethod === "rakbank"} onChange={() => setPaymentMethod("rakbank")} />
                    <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/rak_bank-logo-share-en-e1759992174237.png" alt="Rakbank" width={85} height={40} unoptimized />
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <span>Cash on delivery</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex items-center  justify-center gap-2 mt-6 w-full py-3 text-center bg-black text-white rounded-md hover:bg-gray-900 transition-all disabled:opacity-60"
              >
                {loading ? (
                  "Processing..."
                ) : paymentMethod === "cod" ? (
                  "Place Order"
                ) : paymentMethod === "rakbank" ? (
                  <>
                    Pay with{" "}
                    <Image
                      src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/logo-rakbank.webp"
                      alt="Rakbank"
                      width={90}
                      height={40}
                      unoptimized
                    />
                  </>
                ) : (
                  <>
                    Pay with{" Card / Apple Pay / Google Pay"}
                    {/* <Image
                      src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/ccavenue-logo.png"
                      alt="CCAvenue"
                      width={90}
                      height={40}
                      unoptimized
                    /> */}
                  </>
                )}
              </button>

            </div>
          </div>

          <Link href="/" className="flex items-center gap-1 mt-5 text-sm hover:underline">
            <ChevronLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Checkout;