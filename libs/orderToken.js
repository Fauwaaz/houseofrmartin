import jwt from "jsonwebtoken";

const SECRET = process.env.ORDER_TOKEN_SECRET;

export function signOrderToken(orderId) {
  return jwt.sign({ orderId }, SECRET, { expiresIn: "10m" });
}

export function verifyOrderToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}