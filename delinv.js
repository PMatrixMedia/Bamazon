// JavaScript source code

const mysql = require('mysql2');

var config =
    {
        host: 'webapp-mysqldbserver-abfbb289-34681.mysql.database.azure.com',
        user: 'pmatrixmedia@webapp-mysqldbserver-abfbb289-34681',
        password: 'N@mkc0r1',
        database: 'bamazon',
        port: 3306,
        ssl: true
    };

const conn = new mysql.createConnection(config);


conn.connect(
    function (err) {
        if (err) {
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
            deleteData();
        }
    });

function deleteData() {
    conn.query('DELETE FROM inventory WHERE name = ?', ['orange'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Deleted ' + results.affectedRows + ' row(s).');
        })
    conn.end(
        function (err) {
            if (err) throw err;
            else console.log('Done.')
        });
};

export default delinv;