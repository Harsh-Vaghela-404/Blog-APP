"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDb = exports.connectDb = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = new pg_1.Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: 5432,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});
async function connectDb() {
    try {
        await client.connect();
        // await createTable();
        console.log('Connected to PostgreSQL database');
    }
    catch (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    }
}
exports.connectDb = connectDb;
async function queryDb(query, values) {
    try {
        const result = await client.query(query, values);
        return result.rows;
    }
    catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}
exports.queryDb = queryDb;
async function createTable() {
    const USER_SQL = `CREATE TABLE IF NOT EXISTS bloguser(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
    await queryDb(USER_SQL, []);
    const POST_SQL = `CREATE TABLE IF NOT EXISTS post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT,
    author_id INT REFERENCES bloguser(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  `;
    await queryDb(POST_SQL, []);
    const PostComment_SQL = `CREATE TABLE IF NOT EXISTS post_comment(
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES post(id) NOT NULL,
    author_id INT REFERENCES bloguser(id) NOT NULL,
    content Text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    await queryDb(PostComment_SQL, []);
}
//# sourceMappingURL=connections.js.map