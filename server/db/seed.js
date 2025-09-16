
import client from './client.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Helper function to generate chess board state as JSON
function generateChessGameMoves () {
    const moves = {
        "a7": {
            "id": "bp-2",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "a7"
        },
        "a1": {
            "id": "wr-3",
            "type": "rook",
            "color": "white",
            "img": "/chess/assets/white-rook.png",
            "moves": 0,
            "location": "a1"
        },
        "a8": {
            "id": "br-4",
            "type": "rook",
            "color": "black",
            "img": "/chess/assets/black-rook.png",
            "moves": 0,
            "location": "a8"
        },
        "b2": {
            "id": "wp-5",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "b2"
        },
        "c2": {
            "id": "wp-9",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "c2"
        },
        "c1": {
            "id": "wb-11",
            "type": "bishop",
            "color": "white",
            "img": "/chess/assets/white-bishop.png",
            "moves": 0,
            "location": "c1"
        },
        "c8": {
            "id": "bb-12",
            "type": "bishop",
            "color": "black",
            "img": "/chess/assets/black-bishop.png",
            "moves": 0,
            "location": "c8"
        },
        "d2": {
            "id": "wp-13",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "d2"
        },
        "d1": {
            "id": "wq-15",
            "type": "queen",
            "color": "white",
            "img": "/chess/assets/white-queen.png",
            "moves": 0,
            "location": "d1"
        },
        "d8": {
            "id": "bq-16",
            "type": "queen",
            "color": "black",
            "img": "/chess/assets/black-queen.png",
            "moves": 0,
            "location": "d8"
        },
        "e7": {
            "id": "bp-18",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "e7"
        },
        "e1": {
            "id": "wk-19",
            "type": "king",
            "color": "white",
            "img": "/chess/assets/white-king.png",
            "moves": 0,
            "location": "e1"
        },
        "e8": {
            "id": "bk-20",
            "type": "king",
            "color": "black",
            "img": "/chess/assets/black-king.png",
            "moves": 0,
            "location": "e8"
        },
        "f2": {
            "id": "wp-21",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "f2"
        },
        "f7": {
            "id": "bp-22",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "f7"
        },
        "f1": {
            "id": "wb-23",
            "type": "bishop",
            "color": "white",
            "img": "/chess/assets/white-bishop.png",
            "moves": 0,
            "location": "f1"
        },
        "f8": {
            "id": "bb-24",
            "type": "bishop",
            "color": "black",
            "img": "/chess/assets/black-bishop.png",
            "moves": 0,
            "location": "f8"
        },
        "g2": {
            "id": "wp-25",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "g2"
        },
        "g7": {
            "id": "bp-26",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "g7"
        },
        "g1": {
            "id": "wk-27",
            "type": "knight",
            "color": "white",
            "img": "/chess/assets/white-knight.png",
            "moves": 0,
            "location": "g1"
        },
        "g8": {
            "id": "bk-28",
            "type": "knight",
            "color": "black",
            "img": "/chess/assets/black-knight.png",
            "moves": 0,
            "location": "g8"
        },
        "h2": {
            "id": "wp-29",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 0,
            "location": "h2"
        },
        "h7": {
            "id": "bp-30",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 0,
            "location": "h7"
        },
        "h1": {
            "id": "wr-31",
            "type": "rook",
            "color": "white",
            "img": "/chess/assets/white-rook.png",
            "moves": 0,
            "location": "h1"
        },
        "h8": {
            "id": "br-32",
            "type": "rook",
            "color": "black",
            "img": "/chess/assets/black-rook.png",
            "moves": 0,
            "location": "h8"
        },
        "e4": {
            "id": "wp-17",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 1,
            "location": "e4"
        },
        "d5": {
            "id": "bp-14",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 1,
            "location": "d5"
        },
        "c3": {
            "id": "wk-7",
            "type": "knight",
            "color": "white",
            "img": "/chess/assets/white-knight.png",
            "moves": 1,
            "location": "c3"
        },
        "c6": {
            "id": "bp-10",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 1,
            "location": "c6"
        },
        "b5": {
            "id": "bp-6",
            "type": "pawn",
            "color": "black",
            "img": "/chess/assets/black-pawn.png",
            "moves": 1,
            "location": "b5"
        },
        "a5": {
            "id": "wp-1",
            "type": "pawn",
            "color": "white",
            "img": "/chess/assets/white-pawn.png",
            "moves": 2,
            "location": "a5"
        },
        "a6": {
            "id": "bk-8",
            "type": "knight",
            "color": "black",
            "img": "/chess/assets/black-knight.png",
            "moves": 1,
            "location": "a6"
        }
    }
    
    return JSON.stringify(moves);
};

// generate usernames that match the regex
function generateUsername () {
    const username = faker.person.firstName().toLowerCase() + faker.number.int({ min: 100, max: 999 }).toString();
    return username.length >= 5 ? username.substring(0, 24) : username.padEnd(5, '0');
};

// generate names that match the regex
function generateName () {
    return faker.person.firstName().replace(/[^A-Za-z]/g, '');
};

// generate passwords that match the regex
function generatePassword() {
    const basePassword = faker.internet.password(12, false);
    const specialChar = "$";
    return basePassword + specialChar;
};

const seed = async () => {
    try {
        console.log("Starting database seeding...");

        await client.query("DELETE FROM game_history");
        await client.query("DELETE FROM user_records");
        await client.query("DELETE FROM user_accounts");
        console.log("Cleared existing data");

        // Create test users
        const users = [];
        const numUsers = 10;

        console.log(`Creating ${numUsers} test users...`);
        for (let i = 0; i < numUsers; i++) {
            const name = generateName();
            const username = generateUsername();
            const email = faker.internet.email().toLowerCase();
            const password = generatePassword();
            console.log("Generated username:", username);
            console.log("Generated password:", password);
            const password_hash = await bcrypt.hash(password, 10);

            const userSQL = `
                INSERT INTO user_accounts (name, username, email, password_hash, verified)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING account_id, name, username, email;
            `;
            
            const userResult = await client.query(userSQL, [
                name,
                username,
                email,
                password_hash,
                faker.datatype.boolean(0.5)
            ]);

            const user = userResult.rows[0];
            users.push({ ...user, plainPassword: password });
            console.log(`Created user: ${user.username} (${user.email}) - Password: ${password}`);
        }

        // Create user records for each user
        console.log("Creating user records...");
        for (const user of users) {
            const wins = faker.number.int({ min: 0, max: 50 });
            const losses = faker.number.int({ min: 0, max: 50 });
            const stalemates = faker.number.int({ min: 0, max: 10 });
            const num_matches_played = wins + losses + stalemates;
            const best_time = faker.number.float({ min: 30.5, max: 1800.0, precision: 0.1 });
            const fewest_num_moves_win = wins > 0 ? faker.number.int({ min: 10, max: 40 }) : null;

            const recordSQL = `
                INSERT INTO user_records (account_id, num_matches_played, wins, losses, stalemates, best_time, fewest_num_moves_win)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `;

            await client.query(recordSQL, [
                user.account_id,
                num_matches_played,
                wins,
                losses,
                stalemates,
                best_time,
                fewest_num_moves_win
            ]);

            console.log(`Created record for ${user.username}: ${wins}W-${losses}L-${stalemates}D`);
        }

        // Create game history for each user
        console.log("Creating game history...");
        const gameResults = ['white_win', 'black_win', 'stalemate'];
        
        for (const user of users) {
            const numGames = faker.number.int({ min: 5, max: 25 });
            
            for (let i = 0; i < numGames; i++) {
                const white_player_name = faker.datatype.boolean(0.5) ? user.username : faker.person.firstName();
                const black_player_name = white_player_name === user.username ? faker.person.firstName() : user.username;
                const game_result = faker.helpers.arrayElement(gameResults);
                const numMoves = faker.number.int({ min: 10, max: 50 });
                const moves = numMoves;

                const gameSQL = `
                    INSERT INTO game_history (account_owner_id, white_player_name, black_player_name, game_result, moves)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `;

                await client.query(gameSQL, [
                    user.account_id,
                    white_player_name,
                    black_player_name,
                    game_result,
                    white_time,
                    black_time,
                    moves
                ]);
            }
            
            console.log(`Created ${numGames} games for ${user.username}`);
        }

        console.log("\n=== SEEDING COMPLETE ===");
        console.log(`Created ${users.length} users with records and game history`);
        console.log("\nTest user credentials:");
        users.forEach(user => {
            console.log(`Username: ${user.username} | Email: ${user.email} | Password: ${user.plainPassword}`);
        });

    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};

const dataInit = async () => {
    try {
        await client.connect();
        console.log("Connected to database");
        await seed();
    } catch (error) {
        console.error("Database initialization failed:", error);
    } finally {
        await client.end();
        console.log("Database connection closed");
    }
};

dataInit();