var pool = require('./index');

var Users = {};

const columnInDB = {
    头条: 'visit_top',
    社会: 'visit_shehui',
    国内: 'visit_guonei',
    国际: 'visit_guoji',
    娱乐: 'visit_yule',
    体育: 'visit_tiyu',
    军事: 'visit_junshi',
    科技: 'visit_keji',
    财经: 'visit_caijing',
    时尚: 'visit_shishang'
};

// 数据库 query 是异步的，等待操作结果的时候就进行了下一步。

// data: object about one user's info
Users.add = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
        }

        var query = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';
        connection.query(query, [data.name, data.password, data.email], (err, results, fields) => {
            if (err) {
                console.log("Insert Error: " + err);
            } else {
                if(results.affectedRows == 0){
                    callback(false);
                }else{
                    callback(true);
                }
            }

            connection.release();
        })

    })
};

// data: object about preference rank
Users.updatePreference = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
        }

        var query = 'UPDATE users SET like_top = ?, like_shehui = ?, like_guonei = ?, like_guoji = ?, like_yule = ?, like_tiyu = ?, like_junshi = ?, like_keji = ?, like_caijing = ?, like_shishang = ? WHERE name = ?';

        var queryParam = [];
        for(let i = 0; i < 10; i++){
            queryParam[i] = Number.parseInt(data.settingArr[2*i]);
        }
        queryParam.push(data.name);

        connection.query(query, queryParam, (err, results, fields) => {
            if (err) {
                console.log("Updata Error: " + err);
            } else {
                query = 'SELECT * FROM users WHERE name = ?';
                connection.query(query, [data.name], (err, results, fields) => {
                    if (err) {
                        console.log("Select Error: " + err);
                    }else{
                        callback(results);
                    }
                })

            }

            connection.release();
        })

    })
};

// data: object about one user's info
Users.getOneByPassword = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
        }

        var query = 'SELECT * FROM users WHERE name = ? AND password = ?';
        connection.query(query, [data.name, data.password], (err, results, fields) => {
            if (err) {
                console.log("Select Error: " + err);
            }else{
                callback(results);
            }

            connection.release();
        })

    })
};

// data: object about one user's info
Users.getOneByEmail = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
        }

        var query = 'SELECT * FROM users WHERE name = ? AND email = ?';
        connection.query(query, [data.name, data.email], (err, results, fields) => {
            if (err) {
                console.log("Select Error: " + err);
            }else{
                callback(results);
            }

            connection.release();
        })

    })
};

// name: username; column: column name in Chinese
Users.visitColumn = (name, column, callback) => {
    if(name == undefined){
        callback(true);
    }else{
        pool.getConnection((err, connection) => {
            if(err){
                console.log("Database connect error");
            }

            var query = 'UPDATE users SET ' + columnInDB[column] + ' = ' + columnInDB[column] + ' + 1 WHERE name = ?';
            connection.query(query, [name], (err, result, fields) => {
                if (err) {
                    console.log("Update Error: " + err);
                }else{
                    if(result.affectedRows == 0){
                        callback(false);
                    }else{
                        callback(true);
                    }
                }
                connection.release();
            })
        })
    }
}


module.exports = Users;