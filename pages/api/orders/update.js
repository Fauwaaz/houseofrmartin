import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const {
      order_id,
      status,          // existing usage (keep)
      action,          // NEW: "cancel" | "return"
      transaction_id,
    } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required",
      });
    }

    /**
     * -------------------------------------
     * DETERMINE FINAL STATUS
     * -------------------------------------
     */
    let finalStatus = status || null;
    let setPaid = false;

    if (action) {
      if (action === "cancel") {
        finalStatus = "cancelled";
        setPaid = false;
      }

      else if (action === "return") {
        finalStatus = "pending";
        setPaid = false;
      }

      else {
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
      }
    }

    /**
     * Existing logic preserved
     */
    if (!finalStatus) {
      finalStatus = "processing";
    }

    if (["processing", "completed"].includes(finalStatus)) {
      setPaid = true;
    }

    /**
     * -------------------------------------
     * UPDATE ORDER IN WOO
     * -------------------------------------
     */
    const { data } = await api.put(`orders/${order_id}`, {
      status: finalStatus,
      set_paid: setPaid,
      transaction_id: transaction_id || undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      newStatus: finalStatus,
      order: data,
    });

  } catch (error) {
    console.error(
      "WooCommerce order update error:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.response?.data || error.message,
    });
  }
}
