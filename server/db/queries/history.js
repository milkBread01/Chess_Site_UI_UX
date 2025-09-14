import client from "#db/client";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const secret = process.env.SECRET;

/* 
CREATE TABLE game_history (
	game_id                         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	account_owner_id                INTEGER NOT NULL REFERENCES user_accounts(account_id) ON DELETE CASCADE,
	white_player_name               VARCHAR(50), 
	black_player_name               VARCHAR(50),
	game_result                     VARCHAR(50) CHECK (game_result IN ('white_win', 'black_win', 'stalemate')),
	white_time                      DOUBLE PRECISION,
	black_time                      DOUBLE PRECISION,
	moves                           TEXT NOT NULL,
	created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
*/

const createGameHistory = async ({ account_owner_id, white_player_name, black_player_name, game_result, white_time, black_time, moves }) => {
    const SQL = `
        INSERT INTO game_history (account_owner_id, white_player_name, black_player_name, game_result, white_time, black_time, moves) 
        WHERE account_owner_id = $1
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const params = [account_owner_id, white_player_name, black_player_name, game_result, white_time, black_time, moves];
    const result = await client.query(SQL, params);
    return result.rows[0];
}

const getGameHistoryByAccountId = async (account_owner_id) => {
    const SQL = `
        SELECT * 
        FROM game_history
        WHERE account_owner_id = $1
        ORDER BY created_at DESC;
    `;
    const params = [account_owner_id];
    const result = await client.query(SQL, params);
    return result.rows;
}

export{
    createGameHistory,
    getGameHistoryByAccountId
}