var pool = require('./index');

var News = {};

News.add = function (data, callback) {
    pool.getConnection(function (err, connection) {
        if(err){
            console.log("Database connect error");
        }

        var query = 'INSERT INTO news (title, time, author, url, image, type) VALUES (?, ?, ?, ?, ?, ?)';
        for(var i = 0; i < data.length; i++){
            connection.query(query, [data[i].title, data[i].date, data[i].author_name, data[i].url, data[i].thumbnail_pic_s, data[i].category], function (err, results, fields) {
                if (err) {
                    console.log("Insert Error: " + err);
                }


            })
        }

        // callback(results);
        connection.release();
    })
}

module.exports = News;