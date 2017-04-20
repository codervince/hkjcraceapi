var express = require('express');
var app = express();
// var mongojs = require('mongojs');
// var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/local');
mongoose.connect('mongodb://heroku:1234@ds163940.mlab.com:63940/herkoumongodb');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var user = new Schema({
    row:{
        td:{
            place: String,
            jockeycode: { type: String, uppercase: true, trim: true },
            jockeycodeurl: String,
            trainercode: { type: String, uppercase: true, trim: true},
            trainercodeurl: String,
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
    jockeycodeurl,
    trainercode,
    trainercodeurl,
    actualwt,
    declarhorsewt,
    lbw,
    runningposition,
    finishtime,
    winodds,
    user;


var Horses =  mongoose.model('horses', user);
app.get('/horselist', function(req, res){
    request('http://www.hkjc.com/english/racing/horse.asp?horseno=N432', function(err,resp, html){
        var $ = cheerio.load(html);

        var rowCount = $('.bigborder ').children().length;

        Horses.find(function (err, users) {
            if(users.length > 0){
                setTimeout(function() {
                    Horses.find(function (err, users) {
                        //console.log(users);
                        res.json(users)
                    })
                }, 2000);

            }else{
                for(var i = 2; i<= rowCount; i++) {
                    place =  $('.bigborder').children().eq(i).children().eq(1).text();
                    jockeycode = $('.bigborder').children().eq(i).children().eq(10).text();
                    jockeycodeurl = $('.bigborder').children().eq(i).children().eq(10).children().attr('href');
                    trainercode = $('.bigborder').children().eq(i).children().eq(9).text();
                    trainercodeurl = $('.bigborder').children().eq(i).children().eq(9).children().attr('href');
                    actualwt = $('.bigborder').children().eq(i).children().eq(13).text();
                    declarhorsewt = $('.bigborder').children().eq(i).children().eq(16).text();
                    lbw = $('.bigborder').children().eq(i).children().eq(11).text();
                    runningposition = $('.bigborder').children().eq(i).children().eq(14).text();
                    finishtime = $('.bigborder').children().eq(i).children().eq(15).text();
                    winodds = $('.bigborder').children().eq(i).children().eq(12).text();
                    user = new Horses({
                        row:{
                            td:{
                                place: place,
                                jockeycode: jockeycode,
                                jockeycodeurl: jockeycodeurl,
                                trainercode: trainercode,
                                trainercodeurl: trainercodeurl,
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
                setTimeout(function() {
                    Horses.find(function (err, users) {
                        //console.log(users);
                        res.json(users)
                    })
                }, 2500);
            }

        });

        // var page =  $('.bigborder').children().eq(1).text();

        //console.log(season);

    });

});


app.listen(process.env.PORT || 8000);
//console.log('sever running on port 8000');