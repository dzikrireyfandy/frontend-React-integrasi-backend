import 'dotenv/config';
import mssql from 'mssql';
import { drizzle } from 'drizzle-orm/node-mssql';

// Support format "host\instanceName" (mis. localhost\MSSQLSERVER25).
// Kalau ada instance name, PORT diabaikan -> driver pakai SQL Server Browser
// (UDP 1434) buat otomatis nemuin port instance itu.
function parseServer(raw: string): { server: string; instanceName?: string } {
  const [server, instanceName] = raw.split('\\');
  return instanceName ? { server, instanceName } : { server };
}

const rawServer = process.env.DB_SERVER ?? 'localhost';
const { server, instanceName } = parseServer(rawServer);

const config: mssql.config = {
  server,
  ...(instanceName ? {} : { port: Number(process.env.DB_PORT ?? 1433) }),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    ...(instanceName ? { instanceName } : {}),
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let poolPromise: Promise<mssql.ConnectionPool> | null = null;
let dbPromise: ReturnType<typeof buildDb> | null = null;

async function buildDb() {
  poolPromise ??= mssql.connect(config);
  const pool = await poolPromise;
  return drizzle({ client: pool });
}

// Satu instance Drizzle dipakai ulang untuk seluruh aplikasi 
export function getDb() {
  if (!dbPromise) {
    dbPromise = buildDb().catch((error) => {
      dbPromise = null;
      poolPromise = null;
      throw error;
    });
  }
  return dbPromise;
}