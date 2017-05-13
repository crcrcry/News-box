var express = require('express');
var superagent = require('superagent');

var Users = require('../models/users');
var News = require('../models/news');

var router = express.Router();
var newsType = ["top", "shehui", "guonei", "guoji", "yule", "tiyu", "junshi", "keji", "caijing", "shishang"];

router.get('/fresh', function(req, res, next) {
    var i;
    // 默认每种类型新闻请求一次
    for(i = 0; i < newsType.length; i++){
        superagent.get('http://v.juhe.cn/toutiao/index?type='+newsType[i]+'&key=293ed1ed7fbc7f612425b87414993e03').end(function(err, sres){
            if(err){
                //暂时不处理error
            }

            // if(sres.result.stat == "1"){
            //      暂时不处理状态码
            // }

            // 响应对象数据是一个json字符串，通过es5中JSON对象来转换
            var jsonData = JSON.parse(sres.text);

            News.add(jsonData.result.data, function (result) {

            });
        })
    }
    res.send("fresh success");
});

router.get('/', (req, res, next) => {
    res.render('index',{})
});

router.get('/init', (req, res, next) => {
    News.getAll((result) => {
        var code = 0
        if(result.length == 0){
            code = -1;
        }
        res.json({
            code: code,
            content: result
        });

    })
});

router.post('/getone', (req, res, next) => {
    News.getOneByTypeOrderByIdAndClick(Number.parseInt(req.body.index), req.body.type, (result) => {
        if(result){
            res.json({
                code: 0,
                msg: "success",
                news: result
            })
        }else{
            res.json({
                code: -1,
                msg: "fail",
            })
        }
    })
})

router.post('/register', (req, res, next) => {
    var promise = new Promise((resolve, reject) => {
        Users.getOneByEmail(req.body, (result) => {
            if(result.length != 0){
                // 用户名和邮箱重复
                res.json({
                    code: -1,
                    msg: "用户名和邮箱重复",
                });
            }else{
                resolve(true);
            }
        })
    });

    promise.then((unique) => {
        if(unique){
            Users.add(req.body, (result) => {
                if(result){
                    res.json({
                        code: 0,
                        msg: "注册成功"
                    })
                }else{
                    res.json({
                        code: -1,
                        msg: "注册失败，数据库错误"
                    })
                }
            })
        }
    })
});

router.post('/login', (req, res, next) => {
    Users.getOneByPassword(req.body, (result) => {
        if(result.length == 0){
            res.json({
                code: -1,
                msg: "用户名或密码错误"
            })
        }else{
            result[0].code = 0;
            result[0].msg = "登陆成功";
            res.json(result[0]);
        }
    })
});

router.post('/setting', (req, res, next) => {
    Users.updatePreference(req.body, (result) => {
        if(result.length > 0){
            result[0].code = 0;
            result[0].msg = "个人偏好设置更新成功";
            res.json(result[0]);
        }else{
            res.json({
                code: -1,
                msg: "个人偏好设置更新失败",
            })
        }
    })
})

router.post('/user_behaviour', (req, res, next) => {
    var data = {
        newsID: Number.parseInt(req.body.newsID),
        name: req.body.name,
        column: req.body.column
    };

    News.click(data.newsID, (newsResult) => {
        Users.visitColumn(data.name, data.column, (usersResult) => {
            if(newsResult && usersResult){
                res.json({
                    code: 0,
                    msg: "用户操作记录成功"
                })
            }else{
                if(newsResult || usersResult){
                    if(newsResult){
                        res.json({
                            code: -1,
                            msg: "新闻点击操作记录成功"
                        })
                    }else{
                        res.json({
                            code: -1,
                            msg: "栏目下新闻访问操作操作记录成功"
                        })
                    }
                }else{
                    res.json({
                        code: -1,
                        msg: "用户操作记录失败"
                    })
                }
            }
        })
    })
})

router.post('/update_cookie', (req, res, next) => {
    Users.getOneByEmail({
        name: req.body.name,
        email: req.body.email
    }, (result) => {
        if(result.length != 0){
            result[0].code = 0;
            result[0].msg = "获取用户信息成功";
            res.json(result[0]);
        }else{
            res.json({
                code: -1,
                msg: "获取用户信息失败"
            })
        }
    })
})


module.exports = router;