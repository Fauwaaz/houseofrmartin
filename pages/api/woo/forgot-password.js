// /pages/api/woo/forgot-password.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://yourdomain.com";

    const wpResponse = await fetch(`${WOOCOMMERCE_URL}/wp-login.php?action=lostpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ user_login: email }),
    });

    const text = await wpResponse.text();

    if (text.includes("Check your email for the confirmation link")) {
      return res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    }

    if (text.includes("Invalid username") || text.includes("not registered")) {
      return res.status(404).json({
        success: false,
        message: "No user found with that email address",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected response from WordPress",
      debug: text,
    });
  } catch (err) {
    console.error("Forgot Password API Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}