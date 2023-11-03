import { Client } from 'pg';
import { config } from "dotenv";
config()


const client = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: 5432,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

export async function connectDb() {
  try {
    await client.connect();
    // await createTable();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  }
}