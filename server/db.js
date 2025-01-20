import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Connected to the database");
    client.release();
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
}

testConnection();
