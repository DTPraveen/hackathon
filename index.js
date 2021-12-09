var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');

var routeUser = require('./api/index');

var app = express();

// middlewares
app.use(bodyparser.json({useNewUrlParser: true}));
app.use(cors());

//getting routes
app.use('/', routeUser);

app.use('/', function (req, res) {
    res.json({msg: "This is root"});
})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, if-none-match, auth_key");
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {

        next();
    }
});

// port to listen
const port = 4000;
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log('Listening to port: ' + port);
});