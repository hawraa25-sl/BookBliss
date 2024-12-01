const connection = require('./database');

module.exports.query = (sql, params) =>
    new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });