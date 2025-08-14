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
            connectTimeout: 5000
        });
        console.log('dakchi mzyan');
        return connection;
    }
    catch(err){
        console.error('database connection failed:', err);
        throw err;
    }
}

module.exports = testDbConnection;