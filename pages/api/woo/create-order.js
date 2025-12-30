// pages/api/woo/create-order.js
import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: { message: "Method not allowed" } });
  }

  try {
    const {
      cartItems,
      user,
      paymentMethod,
      couponCode,
      paymentId,
      origin,
    } = req.body;

    if (!cartItems?.length) {
      return res.status(400).json({ success: false, error: { message: "Cart is empty" } });
    }

    if (!user?.email || !user?.name) {
      return res.status(400).json({ success: false, error: { message: "User info missing" } });
    }

    // ------------------------------------
    // BASE CALCULATIONS
    // ------------------------------------
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const shippingCharge = subtotal >= 150 ? 0 : 15;
    const codCharge = paymentMethod === "cod" ? 10 : 0;

    // ------------------------------------
    // COUPON LOGIC + B1G1 LOGIC
    // ------------------------------------
    let estimatedDiscount = 0;
    let couponFound = null;

    if (couponCode) {
      try {
        const couponRes = await api.get(`coupons?code=${encodeURIComponent(couponCode)}`);
        const coupons = Array.isArray(couponRes.data) ? couponRes.data : [];
        couponFound = coupons.find(
          (c) => String(c.code).toLowerCase() === String(couponCode).toLowerCase()
        );
      } catch (e) {
        console.warn("Failed fetching coupon:", e?.message);
      }
    }

    // ----------- CUSTOM B1G1 MULTI-PAIR DISCOUNT ----------
    if (couponFound && couponFound.code?.toLowerCase() === "b1g1") {
      let priceList = [];

      // expand cart items into per-unit prices
      cartItems.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          priceList.push(Number(item.price));
        }
      });

      priceList.sort((a, b) => a - b);

      const totalQty = priceList.length;
      const freeItems = Math.floor(totalQty / 2); // 2=1 free, 4=2 free, 6=3 free...

      const cheapest = priceList.slice(0, freeItems);

      estimatedDiscount = cheapest.reduce((a, b) => a + b, 0);
    }

    // ----------- NORMAL COUPON TYPES ----------
    else if (couponFound) {
      if (couponFound.discount_type === "percent") {
        estimatedDiscount = (subtotal * parseFloat(couponFound.amount)) / 100;
      } else {
        estimatedDiscount = parseFloat(couponFound.amount) || 0;
      }
    }

    const estimatedTotalBeforeTax =
      subtotal - estimatedDiscount + shippingCharge + codCharge;

    // ------------------------------------
    // PREPARE LINE ITEMS
    // ------------------------------------
    const line_items = cartItems.map((item) => {
      const total = (Number(item.price) * Number(item.quantity)).toFixed(2);
      return {
        product_id: item.id,
        variation_id: item.variation_id || undefined,
        quantity: Number(item.quantity),
        subtotal: total,
        total: total,
        name: item.name || "",
        sku: item.sku || `ITEM-${item.id}`,
        meta_data: [
          ...(item.size ? [{ key: "Size", value: item.size }] : []),
          ...(item.color ? [{ key: "Color", value: item.color }] : []),
          ...(item.image ? [{ key: "Product Image", value: item.image }] : []),
        ],
      };
    });

    // ------------------------------------
    // SHIPPING
    // ------------------------------------
    const shipping_lines = [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate Shipping",
        total: shippingCharge.toFixed(2),
      },
    ];

    // ------------------------------------
    // FEE LINES (COD + B1G1)
    // ------------------------------------
    let fee_lines = [];

    // COD fee
    if (codCharge) {
      fee_lines.push({
        name: "COD Charge",
        tax_class: "",
        total: codCharge.toFixed(2),
      });
    }

    // B1G1 discount (must send as NEGATIVE fee)
    if (couponFound && couponFound.code?.toLowerCase() === "b1g1" && estimatedDiscount > 0) {
      fee_lines.push({
        name: "B1G1 Discount",
        total: `-${estimatedDiscount.toFixed(2)}`,
        tax_class: "",
      });
    }

    // ------------------------------------
    // COUPON LINES (only for display, real discount applied via fee line)
    // ------------------------------------
    const coupon_lines =
      couponCode && estimatedDiscount > 0
        ? [
            {
              code: couponCode,
              discount: estimatedDiscount.toFixed(2),
              discount_tax: "0",
            },
          ]
        : [];

    // ------------------------------------
    // PAYMENT METHOD TITLE
    // ------------------------------------
    let paymentTitle =
      {
        cod: "Cash on Delivery",
        ccavenue: "CCAvenue",
        rakbank: "RakBankPay",
        rakbankpay: "RakBankPay",
      }[paymentMethod] || paymentMethod || "Other";

    // ------------------------------------
    // CUSTOMER LOOKUP
    // ------------------------------------
    let customerId = 0;
    try {
      const custRes = await api.get(
        `customers?email=${encodeURIComponent(user.email)}`
      );
      if (Array.isArray(custRes.data) && custRes.data[0]?.id) {
        customerId = custRes.data[0].id;
      }
    } catch (e) {
      console.warn("Customer lookup failed:", e?.message);
    }

    // ------------------------------------
    // META DATA
    // ------------------------------------
    const clientIp =
      origin?.ip ||
      (req.headers["x-forwarded-for"]
        ? String(req.headers["x-forwarded-for"]).split(",")[0]
        : "") ||
      req.socket.remoteAddress ||
      "";

    const referrer =
      origin?.referral || req.headers.referer || req.headers.referrer || "";

    const userAgent = req.headers["user-agent"] || "";
    const utmParams =
      origin?.utm && typeof origin.utm === "object"
        ? JSON.stringify(origin.utm)
        : null;

    // ------------------------------------
    // ORDER PAYLOAD
    // ------------------------------------
    const orderPayload = {
      payment_method: paymentMethod,
      payment_method_title: paymentTitle,
      set_paid: false,
      customer_id: customerId,
      billing: {
        first_name: (user.name || "").split(" ")[0] || "",
        last_name: (user.name || "").split(" ").slice(1).join(" ") || "",
        address_1: user.address || "",
        city: user.city || "",
        state: user.state || "",
        postcode: user.zip || "",
        country: user.country || "AE",
        email: user.email || "",
        phone: user.phone || "",
      },
      shipping: {
        first_name: (user.name || "").split(" ")[0] || "",
        last_name: (user.name || "").split(" ").slice(1).join(" ") || "",
        address_1: user.address || "",
        city: user.city || "",
        state: user.state || "",
        postcode: user.zip || "",
        country: user.country || "AE",
      },
      line_items,
      shipping_lines,
      fee_lines,
      coupon_lines,
      customer_note: user.note || "",
      customer_ip_address: clientIp,
      customer_user_agent: userAgent,
      meta_data: [
        { key: "_order_origin", value: "nextjs-storefront" },
        { key: "_client_ip", value: clientIp },
        { key: "_referrer", value: referrer },
        { key: "_landing_page", value: origin?.landing || "" },
        { key: "_checkout_page", value: origin?.checkout || "" },
        ...(utmParams ? [{ key: "_utm_params", value: utmParams }] : []),
        { key: "_device_user_agent", value: userAgent },
        { key: "order_subtotal_est", value: subtotal.toFixed(2) },
        { key: "estimated_discount", value: estimatedDiscount.toFixed(2) },
        { key: "shipping_charge_est", value: shippingCharge.toFixed(2) },
        { key: "cod_charge_est", value: codCharge.toFixed(2) },
        {
          key: "order_total_with_charges_est",
          value: estimatedTotalBeforeTax.toFixed(2),
        },
        ...(paymentId ? [{ key: "_payment_id", value: String(paymentId) }] : []),
      ],
    };

    // ------------------------------------
    // CREATE ORDER
    // ------------------------------------
    let wooResponse;
    try {
      wooResponse = await api.post("orders", orderPayload);
    } catch (wooErr) {
      console.error("WooCommerce error:", wooErr?.response?.data || wooErr?.message);
      return res.status(500).json({
        success: false,
        error: wooErr?.response?.data || { message: "WooCommerce order creation failed" },
      });
    }

    const created = wooResponse.data || {};

    let actualDiscount = 0;
    if (created.discount_total) {
      actualDiscount = parseFloat(created.discount_total) || 0;
    }

    return res.status(200).json({
      success: true,
      order: created,
      charges: {
        subtotal: subtotal.toFixed(2),
        estimatedDiscount: estimatedDiscount.toFixed(2),
        actualDiscount: actualDiscount.toFixed(2),
        shippingCharge: shippingCharge.toFixed(2),
        codCharge: codCharge.toFixed(2),
        estimatedTotal: estimatedTotalBeforeTax.toFixed(2),
      },
    });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return res.status(500).json({ success: false, error: { message: "Server error" } });
  }
}