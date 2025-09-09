const client = require("./client");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const secret = process.env.SECRET;
/* 
CREATE TABLE user_accounts (
	account_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name              TEXT NOT NULL,
	username          VARCHAR(150) NOT NULL,
	password_hash     TEXT NOT NULL,
	verified          BOOLEAN NOT NULL DEFAULT FALSE,
	created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
*/
const createUser = async ({ name, username, password }) => {
    const SQL = `
        INSERT INTO user_accounts (name, username, password_hash)
        VALUES ($1, $2, $3)
        RETURNING account_id, name, username, verified, created_at;
    `;
    const password_hash = await bcrypt.hash(password, 10);
    const params = [name, username, password_hash];
    const result = await client.query(SQL, params);
    return result.rows[0];
}

const getUserByUsername = async (username) => {
    const SQL = `
        SELECT account_id, name, username, password_hash, verified, created_at
        FROM user_accounts
        WHERE username = $1;
    `;
    const params = [username];
    const result = await client.query(SQL, params);
    return result.rows[0];
}

const getUserByEmail = async (email) => {
    const SQL = `
        SELECT account_id, name, username, password_hash, verified, created_at
        FROM user_accounts
        WHERE username = $1;
    `;
    const params = [email];
    const result = await client.query(SQL, params);
    return result.rows[0];
}

