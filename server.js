var express = require('express');
var app = express();
// var mongojs = require('mongojs');
// var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku:1234@ds163940.mlab.com:63940/herkoumongodb');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var user = new Schema({
    row:{
        td:{
            place: String,
            jockeycode: { type: String, uppercase: true, trim: true },
            trainercode: { type: String, uppercase: true, trim: true},
            actualwt: String,
            declarhorsewt: String,
            lbw: String,
            runningposition: String,
            finishtime: { type: String },
            winodds: String
        }
    }
});
//Global Variables
var place,
    jockeycode,
    trainercode,
    actualwt,
    declarhorsewt,
    lbw,
    runningposition,
    finishtime,
    winodds,
    user;


var User =  mongoose.model('horces', user);
app.get('/contactlist', function(req, res){
    request('http://www.hkjc.com/english/racing/horse.asp?horseno=N432', function(err,resp, html){
        var $ = cheerio.load(html);

        var rowCount = $('.bigborder ').children().length;

        for(var i = 2; i<= rowCount; i++) {
            place =  $('.bigborder').children().eq(i).children().eq(1).text();
            jockeycode = $('.bigborder').children().eq(i).children().eq(10).text();
            trainercode = $('.bigborder').children().eq(i).children().eq(9).text();
            actualwt = $('.bigborder').children().eq(i).children().eq(13).text();
            declarhorsewt = $('.bigborder').children().eq(i).children().eq(16).text();
            lbw = $('.bigborder').children().eq(i).children().eq(11).text();
            runningposition = $('.bigborder').children().eq(i).children().eq(14).text();
            finishtime = $('.bigborder').children().eq(i).children().eq(15).text();
            winodds = $('.bigborder').children().eq(i).children().eq(12).text();
            user = new User({
                row:{
                    td:{
                        place: place,
                        jockeycode: jockeycode,
                        trainercode: trainercode,
                        actualwt: actualwt,
                        declarhorsewt: declarhorsewt,
                        lbw: lbw,
                        runningposition: runningposition,
                        finishtime: finishtime,
                        winodds: winodds
                    }
                }
            });
            user.save(function (err, user, affected) {
                if(err) throw  err;

            });
        }
        // var page =  $('.bigborder').children().eq(1).text();


        //console.log(season);

        setTimeout(function() {
            User.find(function (err, users) {
                //console.log(users);
                res.json(users)
            })
        }, 6000);


    });






});


app.listen(process.env.PORT || 8000);
//console.log('sever running on port 8000');