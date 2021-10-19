const mysql = require('mysql');
const dbConfig = require('../config/config.js');

// Create connection to database
const conn = mysql.createConnection({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB    
});

// Connect to database
conn.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database");
});

module.exports = conn;