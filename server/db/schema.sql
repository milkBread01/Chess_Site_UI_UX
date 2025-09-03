
DROP TABLE IF EXISTS game_history CASCADE;
DROP TABLE IF EXISTS user_records CASCADE;
DROP TABLE IF EXISTS user_accounts CASCADE;

CREATE TABLE user_accounts (
	account_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name              TEXT NOT NULL,
	username          VARCHAR(150) NOT NULL,
	password_hash     TEXT NOT NULL,
	verified          BOOLEAN NOT NULL DEFAULT FALSE,
	created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
