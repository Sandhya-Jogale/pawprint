import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function tryConnect(config) {
    const client = new Client(config);
    try {
        await client.connect();
        return client;
    } catch (e) {
        return null;
    }
}

async function run() {
    let client;
    let successfulConfig = null;
    
    // We parse the password from .env string just in case it had @ in it and broke URL parsing
    // Original string from env: postgres://user:Sandy@2126@localhost:5432/pawprint 
    const passwordMatch = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):(.+)@localhost:5432/);
    const providedUser = passwordMatch ? passwordMatch[1] : 'postgres';
    let providedPass = passwordMatch ? passwordMatch[2] : 'postgres';
    
    // The match could catch 'Sandy@2126'. Let's clean it up if it has a training '@'
    if (providedPass.includes('@localhost:5432')) {
        providedPass = providedPass.split('@localhost:5432')[0];
    }
    
    // Test configs using object to avoid @ character URL parsing issues
    const configsToTest = [
        { user: 'postgres', password: providedPass, host: 'localhost', port: 5432, database: 'postgres' }, // Most likely
        { user: providedUser, password: providedPass, host: 'localhost', port: 5432, database: 'postgres' },
        { user: 'postgres', password: 'password', host: 'localhost', port: 5432, database: 'postgres' },
        { user: 'postgres', password: 'postgres', host: 'localhost', port: 5432, database: 'postgres' },
    ];
    
    for (const config of configsToTest) {
        if (!config.password) continue;
        console.log(`Trying config with user: ${config.user}, password: ${config.password.substring(0, 3)}***...`);
        client = await tryConnect(config);
        if (client) {
            successfulConfig = config;
            break;
        }
    }

    if (!client) {
        console.error("Could not connect to Postgres. Please ensure Postgres service is running.");
        return;
    }
    
    console.log(`Connected to postgres successfully using user ${successfulConfig.user}!`);
    
    try {
        console.log("Checking for pawprint database...");
        const res = await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'pawprint'");
        if (res.rowCount === 0) {
            console.log("Creating database pawprint...");
            await client.query("CREATE DATABASE pawprint");
        } else {
            console.log("Database pawprint already exists.");
        }
    } catch (e) {
        console.error("Error creating database:", e.message);
    } finally {
        await client.end();
    }

    // Now connect to pawprint database and execute schema
    const targetConfig = { ...successfulConfig, database: 'pawprint' };
    console.log(`Connecting to pawprint database...`);
    
    const dbClient = new Client(targetConfig);
    
    try {
        await dbClient.connect();
        const schema = fs.readFileSync('schema.sql', 'utf8');
        console.log("Executing schema...");
        await dbClient.query(schema);
        console.log("Schema executed successfully!");
        
        // Let's also update the .env file with the proper URI encoded string
        console.log("Updating .env file with the working connection string...");
        const encodedPass = encodeURIComponent(targetConfig.password);
        const newUrl = `postgres://${targetConfig.user}:${encodedPass}@localhost:5432/pawprint`;
        const envContent = fs.readFileSync('.env', 'utf8');
        const newEnv = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL=${newUrl}`);
        fs.writeFileSync('.env', newEnv);
        
    } catch (e) {
         console.error("Execution failed. Error:", e.message);
    } finally {
         await dbClient.end();
    }
}

run();
