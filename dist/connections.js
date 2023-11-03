"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
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
//# sourceMappingURL=connections.js.map