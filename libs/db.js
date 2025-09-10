import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "dashboard.houseofrmartin.com",     
  user: "yxcuzrhp_wp_nau5o",     
  password: "n2*!E6p@Pi9VyZEW",
  database: "yxcuzrhp_wp_rpe3v", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});