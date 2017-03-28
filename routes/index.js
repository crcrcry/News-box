var express = require('express');
var superagent = require('superagent');
// var cheerio = require('cheerio');

var News = require('../models/news');

var router = express.Router();

router.get('/', function(req, res, next) {
    superagent.get('http://v.juhe.cn/toutiao/index?type=top&key=293ed1ed7fbc7f612425b87414993e03')
        .end(function(err, sres){
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

            res.render('index');
        })
})

module.exports = router;