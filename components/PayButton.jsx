// "use client";
// import axios from "axios";
// import { useRouter } from "next/router";

// const PayButton = ({ cartItems, totalPrice }) => {
//   const router = useRouter();

//   const handlePayment = async () => {
//     try {
//       const orderId = "ORDER-" + Date.now(); // unique order id

//       const { data } = await axios.post("/api/rakbank/checkout", {
//         cartItems,
//         totalAmount: totalPrice,
//         orderId,
//       });

//       if (data?.paymentUrl) {
//         window.location.href = data.paymentUrl; // redirect to RakBankPay page
//       } else {
//         alert("Failed to start payment.");
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Payment failed. Try again.");
//       router.push('/payment/cancel')
//     }
//   };

//   return (
//     <button
//       onClick={handlePayment}
//       className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//     >
//       Pay Now
//     </button>
//   );
// };

// export default PayButton;
"use client";
import axios from "axios";

const PayButton = ({ cartItems, totalPrice, user }) => {
  const handlePayment = async () => {
    try {
      const orderId = "ORDER-" + Date.now();

      // 1️⃣ Create WooCommerce order
      const { data: orderRes } = await axios.post("/api/woo/create-order", {
        cartItems,
        user, // make sure user object has name, email, phone, address, city, state, zip, country
      });

      if (!orderRes.success) {
        return alert("Failed to create order: " + orderRes.error.message);
      }

      const orderData = orderRes.order;

      // 2️⃣ Initiate CCAvenue payment
      const { data } = await axios.post("/api/ccavenue/initiate", {
        orderId: orderData.id,
        amount: totalPrice,
        user,
        cartItems,
        redirectUrl: `${window.location.origin}/payment-success?order=${orderData.id}`,
      });

      if (data?.encRequest && data?.transactionUrl) {
        // redirect to CCAvenue payment page
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
      } else {
        alert("Payment initiation failed");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert("Payment failed. Check console for details.");
    }
  };


  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      Pay Now
    </button>
  );
};

export default PayButton;