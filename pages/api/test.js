import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    const [rows] = await conn.query('SELECT NOW() as now');
    await conn.end();

    res.status(200).json({ success: true, now: rows[0].now });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}