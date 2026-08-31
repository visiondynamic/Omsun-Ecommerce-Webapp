import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Support Railway MySQL variables (MYSQLHOST, MYSQLUSER, etc. or DATABASE_URL / MYSQL_URL)
const databaseUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

export const pool = databaseUrl
  ? mysql.createPool(databaseUrl)
  : mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
      user: process.env.MYSQLUSER || process.env.DB_USER || "root",
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || "omsun",
      port: process.env.MYSQLPORT ? Number(process.env.MYSQLPORT) : Number(process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4_unicode_ci",
      namedPlaceholders: true,
    });

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

