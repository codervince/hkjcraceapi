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
        place: String,
        horseno: String,
        horsecode: { type: String, uppercase: true, trim: true },
        horsecodeurl: String,
        jockeycode: { type: String, uppercase: true, trim: true },
        jockeycodeurl: String,
        trainercode: { type: String, uppercase: true, trim: true },
        trainercodeurl: String,
        actualwt: String,
        declarhorsewt: String,
        draw: String,
        lbw: String,
        runningposition: String,
        finishtime: { type: String },
        winodds: String
    }
});
//Global Variables
var place,
    horseno,
    horsecode,
    horsecodeurl,
    jockeycode,
    draw,
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
    request('http://racing.hkjc.com/racing/Info/meeting/Results/english/Local/20170417/ST/5', function(err,resp, html){
        var $ = cheerio.load(html);

        var rowCount = $('.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody ').children().length;
        //console.log(rowCount);

        var tableName = '.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody';

        Horses.find(function (err, users) {
            if(users.length > 0){
                setTimeout(function() {
                    Horses.find(function (err, users) {
                        //console.log(users);
                        res.json(users)
                    })
                }, 2000);

            }else{
                for(var i = 0; i<= rowCount; i++) {
                    place = $(tableName).children().eq(i).children().eq(0).text();
                    horseno = $(tableName).children().eq(i).children().eq(1).text();
                    horsecode = $(tableName).children().eq(i).children().eq(2).text();
                    horsecodeurl =  $(tableName).children().eq(i).children().eq(2).children().attr('href');
                    jockeycode = $(tableName).children().eq(i).children().eq(3).text();
                    jockeycodeurl = $(tableName).children().eq(i).children().eq(3).children().attr('href');
                    trainercode = $(tableName).children().eq(i).children().eq(4).text();
                    trainercodeurl = $(tableName).children().eq(i).children().eq(4).children().attr('href');
                    actualwt = $(tableName).children().eq(i).children().eq(5).text();
                    declarhorsewt = $(tableName).children().eq(i).children().eq(6).text();
                    draw = $(tableName).children().eq(i).children().eq(7).text();
                    lbw = $(tableName).children().eq(i).children().eq(8).text();
                    runningposition = $(tableName).children().eq(i).children().eq(9).text();
                    finishtime = $(tableName).children().eq(i).children().eq(10).text();
                    winodds = $(tableName).children().eq(i).children().eq(11).text();
                    user = new Horses({
                        row:{
                            place: place,
                            horseno: horseno,
                            horsecode: horsecode,
                            horsecodeurl: horsecodeurl,
                            jockeycode: jockeycode,
                            jockeycodeurl: jockeycodeurl,
                            trainercode: trainercode,
                            trainercodeurl: trainercodeurl,
                            actualwt: actualwt,
                            declarhorsewt: declarhorsewt,
                            draw: draw,
                            lbw: lbw,
                            runningposition: runningposition,
                            finishtime: finishtime,
                            winodds: winodds
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
    });
});

app.post('/newrequest', function(req, res){
    var url =  req.body.url;
    //console.log(url);
    var newarray = [];
    request('' + url, function(err,resp, html){
        var $ = cheerio.load(html);

        var rowCount = $('.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody ').children().length;

        var tableName = '.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody';
        for(var i = 0; i<= rowCount; i++) {
            place = $(tableName).children().eq(i).children().eq(0).text();
            horseno = $(tableName).children().eq(i).children().eq(1).text();
            horsecode = $(tableName).children().eq(i).children().eq(2).text();
            horsecodeurl =  $(tableName).children().eq(i).children().eq(2).children().attr('href');
            jockeycode = $(tableName).children().eq(i).children().eq(3).text();
            jockeycodeurl = $(tableName).children().eq(i).children().eq(3).children().attr('href');
            trainercode = $(tableName).children().eq(i).children().eq(4).text();
            trainercodeurl = $(tableName).children().eq(i).children().eq(4).children().attr('href');
            actualwt = $(tableName).children().eq(i).children().eq(5).text();
            declarhorsewt = $(tableName).children().eq(i).children().eq(6).text();
            draw = $(tableName).children().eq(i).children().eq(7).text();
            lbw = $(tableName).children().eq(i).children().eq(8).text();
            runningposition = $(tableName).children().eq(i).children().eq(9).text();
            finishtime = $(tableName).children().eq(i).children().eq(10).text();
            winodds = $(tableName).children().eq(i).children().eq(11).text();

           var  newuser =   {
                    place: place,
                    horseno: horseno,
                    horsecode: horsecode,
                    horsecodeurl: horsecodeurl,
                    jockeycode: jockeycode,
                    jockeycodeurl: jockeycodeurl,
                    trainercode: trainercode,
                    trainercodeurl: trainercodeurl,
                    actualwt: actualwt,
                    declarhorsewt: declarhorsewt,
                    draw: draw,
                    lbw: lbw,
                    runningposition: runningposition,
                    finishtime: finishtime,
                    winodds: winodds

            };
            newarray.push(newuser);
        }

            res.json(newarray)

    });


});


app.listen(process.env.PORT || 8000);
console.log('sever running on port 8000');