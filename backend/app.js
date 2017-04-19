var express =  require('express');
var session =  require('express-session');
var pug =  require('pug');
var bodyParser =  require('body-parser');
var helmet =  require('helmet');

var index = require('./routes/index');

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.set('trust proxy', 1);

app.use(helmet());
app.use(express.static('public'));

app.use('/', index);
app.use('*', function(req, res){
    res.status(404).send('404 Not Found by Express');
})

app.listen(3000, function(){
    console.log("Server runs on port 3000.");
});
