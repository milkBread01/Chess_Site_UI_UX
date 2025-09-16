import 'dotenv/config';
import pg from "pg";

/* const client = new pg.Client(
    process.env.DATABASE_URL
); */
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default client;