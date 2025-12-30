import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: "wc/v3",
});

export default async function handler(req, res) {
  try {
    // Your Google Apps Script Webhook
    const SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK;

    let page = 1;
    let allOrders = [];

    // Fetch all orders (pagination)
    while (true) {
      const response = await api.get("orders", {
        per_page: 100, // Max allowed by WooCommerce
        page
      });

      if (response.data.length === 0) break;

      allOrders = [...allOrders, ...response.data];
      page++;
    }

    // Format orders for Google Sheets
    const sheetRows = allOrders.map(order => {
      const items = order.line_items.map(
        (item) => `${item.name} x ${item.quantity}`
      ).join(", ");

      const trackingNumber =
        order.meta_data?.find((m) => m.key === "_tracking_number")?.value || "";

      const trackingCarrier =
        order.meta_data?.find((m) => m.key === "_tracking_carrier")?.value || "";

      const trackingURL =
        order.meta_data?.find((m) => m.key === "_tracking_url")?.value || "";

      return {
        orderId: order.id,
        date: order.date_created,
        status: order.status,
        customerName: `${order.billing.first_name} ${order.billing.last_name}`,
        email: order.billing.email,
        phone: order.billing.phone,
        address: order.billing.address_1,
        city: order.billing.city,
        country: order.billing.country,
        paymentMethod: order.payment_method_title,
        subtotal: order.total - order.shipping_total,
        shipping: order.shipping_total,
        total: order.total,
        items,
        trackingNumber,
        trackingCarrier,
        trackingURL
      };
    });

    // Send rows to Google Sheet
    await fetch(SHEET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "sync_all_orders",
        orders: sheetRows
      }),
    });

    return res.status(200).json({
      success: true,
      count: sheetRows.length,
      message: "Orders synced to Google Sheet"
    });

  } catch (err) {
    console.error("Sync error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
}