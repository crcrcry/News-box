var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index', {
        name: 'crcrcry',
        msg: 'start'
    });
})

module.exports = router;