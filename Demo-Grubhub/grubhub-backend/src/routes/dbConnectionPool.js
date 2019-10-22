var mysql = require('promise-mysql');

var dbConfig = {
    connectionLimit: 500,
    host: 'database-1.cpfrzsv0v4ke.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'admin1234',
    database: 'grubHub',
    port: 3306,
    debug: false,
    multipleStatements: true
}

module.exports = async () => {
    var pool = await mysql.createPool(dbConfig)
    return new Promise(async (resolve, reject) => {
        pool.getConnection().then(function (con) {
            if (con) {
                console.log("Connection to DB Successful");
                resolve(con)
            }
        }).catch(function (err) {
            console.log("error " + err)
            reject(err)
        });
    })
}