import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

let client = null;
let db = null;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db();
  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not connected');
  return db;
}
