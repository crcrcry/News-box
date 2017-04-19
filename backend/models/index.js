var mysql = require('mysql');

var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'news_box',
    charset: "utf8"
});

pool.getConnection(function (err, connection) {
    if(err){
        console.log("Database connect error");
    }

})

module.exports = pool;