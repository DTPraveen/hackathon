var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');

var routeUser = require('./api/index');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'twitter_db_username',
    password: 'PAss11@!word',
    database: 'twitter_db',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});
global.db = mysqlConnection;


var app = express();

// middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
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
app.listen(process.env.PORT || port, (err) => {
    if (err) console.log(err);
    else console.log('Listening to port: ' + port);
});