import { signOrderToken } from "../../../libs/orderToken";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { orderId } = req.body;

  if (!orderId)
    return res.status(400).json({ error: "Missing orderId" });

  const token = signOrderToken(orderId);

  return res.status(200).json({ token });
}
