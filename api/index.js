const express = require('express');

const app = express();

app.route('/ping')
    .get(routeCheck);

function routeCheck(req, res) {

    res.json({"Message": "successful hit"});
}

module.exports = app;