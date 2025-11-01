import { Client } from "pg";

export const client = new Client({
    user: "arka",
    database: "ethIndexerdb",
    host: "localhost",
    port: 5432,
    password: "123456789"
})

async function connect(){
    await client.connect();
}

async function table(){
    await client.query(`
        CREATE TABLE userInfo(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            depositAddress VARCHAR(255) NOT NULL,
            privateKey VARCHAR(255) NOT NULL,
            balance INTEGER,
            createdAt TIMESTAMP DEFAULT NOW()
        );
    `)

    console.log("Table created");
    await client.end();
}

async function perform(){
    await connect();
    await table();
}

// perform();