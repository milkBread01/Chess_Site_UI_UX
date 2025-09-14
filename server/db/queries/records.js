import client from "#db/client";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const secret = process.env.SECRET;

/* 
CREATE TABLE user_records (
	record_id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	account_id               INTEGER NOT NULL REFERENCES user_accounts(account_id) ON DELETE CASCADE,
	num_matches_played       INTEGER DEFAULT 0,
	wins                     INTEGER DEFAULT 0,
	losses                   INTEGER DEFAULT 0,
	stalemates               INTEGER DEFAULT 0,
	best_time                DOUBLE PRECISION,
	fewest_num_moves_win     INTEGER
);
*/

const updateRecord = async ({account_id, matchResults, matchTime, numMoves}) =>{
    const SQL = `
        UPDATE user_records
        SET num_matches_played = num_matches_played + 1,
            wins = wins + CASE WHEN $2 = 'win' THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN $2 = 'loss' THEN 1 ELSE 0 END,
            stalemates = stalemates + CASE WHEN $2 = 'stalemate' THEN 1 ELSE 0 END,
            best_time = CASE 
                            WHEN best_time IS NULL OR $3 < best_time THEN $3
                            ELSE best_time
                        END,
            fewest_num_moves_win = CASE 
                                        WHEN $2 = 'win' AND (fewest_num_moves_win IS NULL OR $4 < fewest_num_moves_win) THEN $4
                                        ELSE fewest_num_moves_win
                                    END
        WHERE account_id = $1
        RETURNING *;
    `;
    const params = [account_id, matchResults, matchTime, numMoves];
    const result = await client.query(SQL, params);
    return result.rows[0];
}

const getRecordByAccountId = async (account_id) => {
    const SQL = `
        SELECT * WHERE account_id = $1;
    `;
    const params = [account_id];
    const result = await client.query(SQL, params);
    return result.rows[0];
}


export {
    updateRecord,
    getRecordByAccountId
}