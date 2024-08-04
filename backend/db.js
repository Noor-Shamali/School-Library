const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',  // your MySQL username
    password: '408325934',  // your MySQL password
    database: 'school_library'
});

module.exports = pool.promise();
