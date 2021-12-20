const express = require('express');
const http = require('http');
const rp = require('request-promise');

const app = express();

app.route('/ping')
    .get(routeCheck);

function routeCheck(req, res) {

    res.json({"Message": "successful hit"});
}

app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ik5EeDZfNldqVE9pek5tWGRCeTRsaVEiLCJleHAiOjE2NDA4MDI2MDAsImlhdCI6MTYzOTY3MjU3Nn0.r8RkE1Js6bK6gCveSdr8GGQ1zvac36fKMv111LR3r2I"

app.get('/user', function (request, response) {

    var options = {
        uri: 'https://api.zoom.us/v2/users/02so6ITLTQSmVez8ileuDQ',
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json',
        }
    }
    rp(options)
        .then(function (res) {
            response.send(res);
        })
        .catch(function (err) {
            console.log("API call failed, reason ", err);
        });

});

app.route('/user/create-meeting')
    .post(createMeeting);

function createMeeting(request, response) {

    var participantsName = request.body.participants
    var participantFilter = ""
    for (var i = 0; i < participantsName.length; i++) {
        var pattern = "'%" + participantsName[i] + "%'"
        participantFilter += " name LIKE " + pattern + " OR alias LIKE " + pattern
        if (i < participantsName.length - 1) {
            participantFilter += " OR "
        }
    }
    query = 'SELECT email FROM user WHERE ' + participantFilter

    db.query(query, (err, rows, fields) => {
        console.log(query)
        if (!err) {
            var results = JSON.parse(JSON.stringify(rows));

            var requestBody = request.body.data

            meetingInvitees = []
            for (var i = 0; i < results.length; i++) {
                meetingInvitees.push({
                        email: results[i].email
                    }
                )
            }
            requestBody.settings.meeting_invitees = meetingInvitees

            console.log(requestBody)

            var options = {
                uri: 'https://api.zoom.us/v2/users/02so6ITLTQSmVez8ileuDQ/meetings',
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json',
                },
                json: true,
                body: requestBody,
            }

            rp(options)
                .then(function (res) {
                    response.send(res);
                })
                .catch(function (err) {
                    console.log("API call failed, reason ", err);
                });
        } else
            response.send({"error": err});
    })
}

function getUsers(req, res) {

    res.json({"Message": "successful hit"});
}

const UserModel = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
    const User = sequelize.define('User', {
        UserId: {type: INTEGER, primaryKey: true, autoIncrement: true},
        Email: {type: STRING, primaryKey: false, allowNull: false},
        Name: {type: STRING, primaryKey: false, allowNull: false},
        Alias: {type: STRING, primaryKey: false, allowNull: true},
        Address: {type: STRING, primaryKey: false, allowNull: true},
    })
    return User
}


module.exports = app;
