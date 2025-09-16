
import client from './client.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
// Helper function to generate chess board state as JSON

// generate usernames
function generateUsername () {
    const username = faker.person.firstName().toLowerCase() + faker.number.int({ min: 100, max: 999 }).toString();
    return username.length >= 5 ? username.substring(0, 24) : username.padEnd(5, '0');
};

// generate names 
function generateName () {
    return faker.person.firstName()
};

// generate passwords
function generatePassword() {
    const basePassword = faker.internet.password({ length: 8, memorable: true, pattern: /[A-Za-z0-9]/ });
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
                    VALUES ($1, $2, $3, $4, $5);
                `;

                await client.query(gameSQL, [
                    user.account_id,
                    white_player_name,
                    black_player_name,
                    game_result,
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