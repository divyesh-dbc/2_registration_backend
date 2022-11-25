'use strict';
const mysql = require('mysql');

var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_api',
    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 1000000,
    multipleStatements: true

};
var dbConn;
function handleDisconnect() {
    dbConn = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    dbConn.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
        console.log(`Database Connected!!!`);
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    dbConn.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            console.log('err======================================================================', err);
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

module.exports = dbConn;