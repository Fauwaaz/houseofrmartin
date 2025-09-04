import { db } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await db.query("SELECT NOW() as time");
    res.status(200).json({ success: true, serverTime: rows[0].time });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}