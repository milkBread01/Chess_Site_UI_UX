import client from "#db/client";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const secret = process.env.SECRET;
/* 
CREATE TABLE user_accounts (
	account_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name              TEXT NOT NULL,
	username          VARCHAR(150) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
	password_hash     TEXT NOT NULL,
	verified          BOOLEAN NOT NULL DEFAULT FALSE,
	created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
*/
const createUser = async ({ name, username, email, password }) => {
    const SQL = `
        INSERT INTO user_accounts (name, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING account_id, name, username, email, verified, created_at;
    `;
    const password_hash = await bcrypt.hash(password, 10);
    const params = [name, username, email, password_hash];
    const result = await client.query(SQL, params);
    return result.rows[0];
}
const getUserDetailsByUsername = async ({username}) => {
    const SQL = `
        SELECT account_id, name, username, email, verified, created_at
        FROM user_accounts
        WHERE username = $1;
    `;
    const response = await client.query(SQL, [username]);
    return response.rows[0];
}

const getUserByUsername = async ({username, password}) => {
    
    const SQL = `
        SELECT account_id, name, username, password_hash, verified, created_at
        FROM user_accounts
        WHERE username = $1;
    `;
    

    const response = await client.query(SQL, [username]);
    const user = response.rows[0];
    console.log('Passowrd',password)
    console.log('hash',user.password)
    const verify = await bcrypt.compare(password, user.password_hash);
    
    if(verify){
        return user;
    } else {
        return "Incorrect Credentials";
    }
}
const getDetailsWithID = async ({account_id}) => {
    const SQL = `
        SELECT account_id, name, username, email, verified, created_at
        FROM user_accounts
        WHERE account_id = $1;
    `;
    const response = await client.query(SQL, [account_id]);
    return response.rows[0];
}

const findByUsername = async ({username}) => {
    const SQL = `
        SELECT account_id
        FROM user_accounts
        WHERE username = $1;
    `;
    //console.log("Finding by username:", username);
    const response = await client.query(SQL, [username]);
    //console.log("Response:", response);
    return response.rows[0];
}

const findByEmail = async ({email}) => {
    const SQL = `
        SELECT account_id
        FROM user_accounts
        WHERE email = $1;
    `;
    //console.log("Finding by email:", email);
    const response = await client.query(SQL, [email]);
    //console.log("Response:", response);
    return response.rows[0];
}

const getUserByEmail = async ({email, password}) => {
    const SQL = `
        SELECT account_id, name, username, password_hash, verified, created_at
        FROM user_accounts
        WHERE email = $1;
    `;
    const response = await client.query(SQL, [email]);
    const user = response.rows[0];
    const verify = await bcrypt.compare(password, user.password_hash);
    if(verify){
        return user;
    } else {
        return "Incorrect Credentials";
    }
}

export {
    createUser,
    getUserByUsername,
    getUserByEmail,
    findByEmail,
    findByUsername,
    getUserDetailsByUsername,
    getDetailsWithID
}