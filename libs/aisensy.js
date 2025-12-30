export async function sendAbandonedCartMessage({
  phone,
  cartItems,
  stage,
}) {
  const payload = {
    phone: phone,
    template_name: "woocommerce_abandoned_carts",
    broadcast_name: `abandoned_cart_${stage}`,
    parameters: {
      items: cartItems.map(i => `${i.name} x${i.quantity}`).join(", "),
    },
  };

  const res = await fetch(
    process.env.AISENSY_ENDPOINT_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AISENSY_APIKEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error("AiSensy failed: " + err);
  }
}