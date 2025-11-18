import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Tes koneksi awal
(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database pool...");
  await pool.end();
  process.exit(0);
});

export default pool;

export async function warmupDbClients(
  count = parseInt(process.env.PG_WARMUP_CLIENTS, 10) || 1
) {
  try {
    const clients = [];
    for (let i = 0; i < count; i++) {
      const client = await pool.connect();
      clients.push(client);
    }
    await Promise.all(clients.map((c) => c.query("SELECT 1")));
    clients.forEach((c) => c.release());
    console.log(`✅ DB pool warmed with ${count} connection(s)`);
  } catch (err) {
    console.warn("DB warmup failed:", err.message);
  }
}
