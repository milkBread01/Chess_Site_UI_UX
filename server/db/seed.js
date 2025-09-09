const client = require("./client");
const fs = require("@faker-js/faker");
const insertUser = require("./queries/insertUser");
const insertRecords = require("./queries/records");
const insertGames = require("./queries/history");

const seed = async () => {
}

const dataInit = async () => {
    client.connect();
    await seed();
    await client.end();
}
dataInit();