require('dotenv').config();
const mysql= require('mysql2/promise');

async function testDbConnection(){
    try{
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });
        console.log('dakchi mzyan');
        await connection.end();
        process.exit(0);
    }
    catch(err){
        console.error('database connection failed:', err);
        process.exit(1);
    }
}

testDbConnection();