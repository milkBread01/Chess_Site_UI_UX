
import client from './client.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Helper function to generate chess board state as JSON
const generateInitialBoard = () => {
    const board = {};
    
    // White pieces
    board["a1"] = { id: "wr-1", type: "rook", color: "white", img: "/chess/assets/white-rook.png", moves: 0, location: "a1" };
    board["b1"] = { id: "wn-1", type: "knight", color: "white", img: "/chess/assets/white-knight.png", moves: 0, location: "b1" };
    board["c1"] = { id: "wb-1", type: "bishop", color: "white", img: "/chess/assets/white-bishop.png", moves: 0, location: "c1" };
    board["d1"] = { id: "wq-1", type: "queen", color: "white", img: "/chess/assets/white-queen.png", moves: 0, location: "d1" };
    board["e1"] = { id: "wk-1", type: "king", color: "white", img: "/chess/assets/white-king.png", moves: 0, location: "e1" };
    board["f1"] = { id: "wb-2", type: "bishop", color: "white", img: "/chess/assets/white-bishop.png", moves: 0, location: "f1" };
    board["g1"] = { id: "wn-2", type: "knight", color: "white", img: "/chess/assets/white-knight.png", moves: 0, location: "g1" };
    board["h1"] = { id: "wr-2", type: "rook", color: "white", img: "/chess/assets/white-rook.png", moves: 0, location: "h1" };
    
    // White pawns
    for (let i = 0; i < 8; i++) {
        const file = String.fromCharCode(97 + i); // 'a' through 'h'
        board[`${file}2`] = { 
            id: `wp-${i + 1}`, 
            type: "pawn", 
            color: "white", 
            img: "/chess/assets/white-pawn.png", 
            moves: 0, 
            location: `${file}2` 
        };
    }
    
    // Black pieces
    board["a8"] = { id: "br-1", type: "rook", color: "black", img: "/chess/assets/black-rook.png", moves: 0, location: "a8" };
    board["b8"] = { id: "bn-1", type: "knight", color: "black", img: "/chess/assets/black-knight.png", moves: 0, location: "b8" };
    board["c8"] = { id: "bb-1", type: "bishop", color: "black", img: "/chess/assets/black-bishop.png", moves: 0, location: "c8" };
    board["d8"] = { id: "bq-1", type: "queen", color: "black", img: "/chess/assets/black-queen.png", moves: 0, location: "d8" };
    board["e8"] = { id: "bk-1", type: "king", color: "black", img: "/chess/assets/black-king.png", moves: 0, location: "e8" };
    board["f8"] = { id: "bb-2", type: "bishop", color: "black", img: "/chess/assets/black-bishop.png", moves: 0, location: "f8" };
    board["g8"] = { id: "bn-2", type: "knight", color: "black", img: "/chess/assets/black-knight.png", moves: 0, location: "g8" };
    board["h8"] = { id: "br-2", type: "rook", color: "black", img: "/chess/assets/black-rook.png", moves: 0, location: "h8" };
    
    // Black pawns
    for (let i = 0; i < 8; i++) {
        const file = String.fromCharCode(97 + i); // 'a' through 'h'
        board[`${file}7`] = { 
            id: `bp-${i + 1}`, 
            type: "pawn", 
            color: "black", 
            img: "/chess/assets/black-pawn.png", 
            moves: 0, 
            location: `${file}7` 
        };
    }
    
    return board;
};

// Helper function to simulate a chess game by making random moves
const generateChessGameMoves = (numMoves) => {
    const board = generateInitialBoard();
    const moves = [JSON.parse(JSON.stringify(board))]; // Save initial position
    
    // Get all possible squares
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const allSquares = [];
    files.forEach(file => ranks.forEach(rank => allSquares.push(file + rank)));
    
    // Simulate moves by randomly moving pieces
    for (let i = 0; i < numMoves && i < 100; i++) {
        const occupiedSquares = Object.keys(board);
        if (occupiedSquares.length === 0) break;
        
        // Pick a random piece to move
        const fromSquare = faker.helpers.arrayElement(occupiedSquares);
        const piece = board[fromSquare];
        
        // Pick a random destination (simulate move)
        const toSquare = faker.helpers.arrayElement(allSquares);
        
        // Don't move to same square or to a square with same color piece
        if (toSquare === fromSquare || 
            (board[toSquare] && board[toSquare].color === piece.color)) {
            continue;
        }
        
        // Make the move
        delete board[fromSquare];
        board[toSquare] = {
            ...piece,
            location: toSquare,
            moves: piece.moves + 1
        };
        
        // Save this position
        moves.push(JSON.parse(JSON.stringify(board)));
    }
    
    return JSON.stringify(moves);
};

// Helper function to generate usernames that match the regex
const generateUsername = () => {
    const username = faker.person.firstName().toLowerCase() + faker.number.int({ min: 100, max: 999 }).toString();
    return username.length >= 5 ? username.substring(0, 24) : username.padEnd(5, '0');
};

// Helper function to generate names that match the regex
const generateName = () => {
    return faker.person.firstName().replace(/[^A-Za-z]/g, '');
};

// Helper function to generate passwords that match the regex
const generatePassword = () => {
    const basePassword = faker.internet.password(12, false);
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    return basePassword + specialChar;
};

const seed = async () => {
    try {
        console.log("Starting database seeding...");

        // Clear existing data (optional - comment out if you want to keep existing data)
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
                faker.datatype.boolean(0.7) // 70% chance of being verified
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
                const moves = generateChessGameMoves(numMoves);

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