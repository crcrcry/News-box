var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var router = express.Router();

router.get('/', function(req, res, next){
    superagent.get('https://cnodejs.org/')
        .end(function(err, sres){
            if(err){
                res.send("Get Request Error!");
            }

            var $ = cheerio.load(sres.text);
            var items = [];

            $('#topic_list .topic_title').each(function(idx, element){
                var $element = $(element);
                items.push({
                    title: $element.attr('title'),
                    href: $element.attr('href')
                })
            })

            res.render('index', {
                news: items
            })
        })
})

module.exports = router;