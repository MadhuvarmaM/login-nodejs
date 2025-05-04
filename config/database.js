const { createPool } = require('mysql');


const pool = createPool({
    port: process.env.DB_PORT || 3306,     
    host: process.env.DB_HOST || 'db',      
    user: process.env.DB_USER || 'root',     
    password: process.env.DB_PASSWORD || 'example',  
    database: process.env.MYSQL_DB || 'myapp',     
    connectionLimit: 10
});

module.exports = pool;
