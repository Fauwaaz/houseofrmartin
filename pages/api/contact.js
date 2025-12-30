import nodemailer from "nodemailer";

const generateUserEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting us</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ffffff; color: black; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f8f7f5; }
    .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
    .user_name { text-transform: capitalize; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/logo.webp" alt="House of R-Martin Logo" style="max-width: 150px; margin-bottom: 10px;">
      <h1>Thank You for Reaching Out!</h1>
    </div>
    <div class="content">
      <h2>Hi <span class='user_name'>${name}</span>,</h2>
      <p>Thank you for contacting us. We've received your message and our team will get back to you as soon as possible.</p>
      <p>We typically respond within 24 hours during business days.</p>
      <p>Best regards,<br><strong>The House of R-Martin Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} House of R-Martin. All rights reserved.</p>
      <p>orders@houseofrmartin.com</p>
    </div>
  </div>
</body>
</html>
`;

const generateAdminEmailTemplate = (name, email, phone, message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ffffff; color: black; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
    .detail { margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px; }
    .label { font-weight: bold; color: #374151; }
    .value { color: #1f2937; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>Received on ${new Date().toLocaleString()}</p>
    </div>
    <div class="content">
      <div class="info-box">
        <h2>Contact Details</h2>
        <div class="detail"><span class="label">Name:</span> <span class="value">${name}</span></div>
        <div class="detail"><span class="label">Email:</span> <span class="value"><a href="mailto:${email}">${email}</a></span></div>
        <div class="detail"><span class="label">Phone:</span> <span class="value"><a href="tel:${phone}">${phone}</a></span></div>
      </div>
      <div class="message-box">
        <h3>Message:</h3>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb;">${message}</p>
      </div>
      <p><strong>Action Required:</strong> Please respond within 24 hours.</p>
    </div>
    <div class="footer">
      <p>This email was automatically generated from the contact form.</p>
      <p>&copy; ${new Date().getFullYear()} House of R-Martin</p>
    </div>
  </div>
</body>
</html>
`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // app password
  },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }

      if (phone && (phone.length < 10 || phone.length > 13)) {
        return res.status(400).json({ error: "Invalid phone number." });
      }

      await transporter.verify();

      const adminMailOptions = {
        from: {
          name: "House of R-Martin",
          address: process.env.SMTP_EMAIL || "orders@houseofrmartin.com",
        },
        to: process.env.ADMIN_EMAIL || "orders@houseofrmartin.com",
        subject: `New Contact Form Submission from ${name}`,
        html: generateAdminEmailTemplate(name, email, phone, message),
        replyTo: email,
      };

      const userMailOptions = {
        from: {
          name: "House of R-Martin",
          address: process.env.SMTP_EMAIL || "orders@houseofrmartin.com",
        },
        to: email,
        subject: "Thank you for contacting House of R-Martin",
        html: generateUserEmailTemplate(name),
      };

      const [adminResult, userResult] = await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
      ]);

      console.log("Admin email sent:", adminResult.messageId);
      console.log("User email sent:", userResult.messageId);

      return res.status(200).json({
        success: true,
        message: "Emails sent successfully.",
        adminMessageId: adminResult.messageId,
        userMessageId: userResult.messageId,
      });
    } catch (error) {
      console.error("Email sending error:", error);
      let errorMsg = "Failed to send email. Please try again later.";

      if (error.code === "EAUTH") errorMsg = "Email authentication failed. Check Gmail app password.";
      else if (["ECONNECTION", "ETIMEDOUT"].includes(error.code)) errorMsg = "Failed to connect to Gmail.";
      else if (error.code === "EMESSAGE") errorMsg = "Invalid email format.";

      return res.status(500).json({ error: errorMsg });
    }
  } else if (req.method === "GET") {
    return res.status(200).json({ message: "running" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}