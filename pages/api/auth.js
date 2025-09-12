import mysql from 'mysql2/promise';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { isLogin, name, email, phone, password } = req.body;

  async function testDB() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  console.log("✅ Connected to DB");
}
testDB().catch(console.error);

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    if (isLogin) {
      // Check if user exists
      const [rows] = await conn.execute(
        'SELECT * FROM fxiEe_users WHERE email = ? AND password = ? LIMIT 1',
        [email, password]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: rows[0].id, email: rows[0].email },
        SECRET_KEY,
        { expiresIn: '1h' } // 1 hour expiry
      );

      res.setHeader('Set-Cookie', serialize('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
      }));

      return res.json({ success: true, message: 'Login successful' });
    } else {
      // Create new user
      await conn.execute(
        'INSERT INTO fxiEe_users (name, email, phone, password) VALUES (?, ?, ?, ?)',
        [name, email, phone, password]
      );

      return res.json({ success: true, message: 'Account created successfully' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}