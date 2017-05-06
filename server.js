var express = require('express');
var app = express();
// var mongojs = require('mongojs');
// var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');
const querystring = require('querystring');
const _ = require('lodash');

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/localdb');
// mongoose.connect('mongodb://heroku:1234@ds163940.mlab.com:63940/herkoumongodb');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

/* 

1.
add meet and race info 
very important!
stats?

2.
input from file or from API of racedates  


*/


var user = new Schema({
    row: {
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


var Horses = mongoose.model('horses', user);
app.get('/horselist', function(req, res) {
    request('http://racing.hkjc.com/racing/Info/meeting/Results/english/Local/20170417/ST/5', function(err, resp, html) {
        var $ = cheerio.load(html);

        var rowCount = $('.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody ').children().length;
        //console.log(rowCount);

        var tableName = '.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody';

        Horses.find(function(err, users) {
            if (users.length > 0) {
                setTimeout(function() {
                    Horses.find(function(err, users) {
                        //console.log(users);
                        res.json(users)
                    })
                }, 2000);

            } else {
                for (var i = 0; i <= rowCount; i++) {
                    place = $(tableName).children().eq(i).children().eq(0).text();
                    horseno = $(tableName).children().eq(i).children().eq(1).text();
                    horsecode = $(tableName).children().eq(i).children().eq(2).text();
                    horsecodeurl = $(tableName).children().eq(i).children().eq(2).children().attr('href');
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
                        row: {
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
                    user.save(function(err, user, affected) {
                        if (err) throw err;

                    });
                }
                setTimeout(function() {
                    Horses.find(function(err, users) {
                        //console.log(users);
                        res.json(users)
                    })
                }, 2500);
            }

        });
    });
});

/**
 * 'foo=bar&abc=xyz&abc=123' --> 
 * {
  foo: 'bar',
  abc: ['xyz', '123']
}
 * 
 * 
 */

//adapt to get race info + race 
//http://127.0.0.1:8000/newrequest?racedate=20170420&racecourse=HV&raceno=5
app.post('/newrequest', function(req, res) {
    // feed a racedate= 
    var query = require('url').parse(req.url, true).query;
    var racedate = query.racedate;
    var racecourse = query.racecourse;
    var racenumber = query.raceno;
    // var racedate = _.get(qs, 'racedate', null);
    // var racenumber = _.get(qs, 'raceno', null);
    console.log(racedate, racenumber);
    if (!(racedate && racecourse && racenumber)) {
        console.log("invalid racedate/racenumber/racecourses");
        //bail out here
    }

    //construct urls
    var base_resulturl = "http://racing.hkjc.com/racing/Info/meeting/Results/english/Local/";
    // http://racing.hkjc.com/racing/Info/meeting/Results/english/Local/20170412/HV/2
    var results_url = base_resulturl + racedate.toString() + '/' + racecourse.toString() + '/' + racenumber.toString();
    console.log(results_url);
    //parse url to get race date 

    var newarray = [];
    var allodds = [];
    request(results_url, function(err, resp, html) {
        var $ = cheerio.load(html, { ignoreWhitespace: true });




        var rowCount = $('.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody ').children().length;
        console.log(rowCount);

        var tableName = '.tableBorder.trBgBlue.tdAlignC.number12.draggable tbody';
        for (var i = 0; i <= rowCount; i++) {


            place = $(tableName).children().eq(i).children().eq(0).text();
            horseno = $(tableName).children().eq(i).children().eq(1).text();
            horsecode = $(tableName).children().eq(i).children().eq(2).text();
            horsecodeurl = $(tableName).children().eq(i).children().eq(2).children().attr('href');
            //    /.*horseno=([a-z0-9]){4}$/)

            // horsecodeurl = _horsecodeurl.match(/.*horseno=([a-z0-9]){4}$/);
            // filter(function() {
            //     return 
            // });
            jockeyname = $(tableName).children().eq(i).children().eq(3).text();
            jockeycodeurl = $(tableName).children().eq(i).children().eq(3).children().attr('href');
            trainername = $(tableName).children().eq(i).children().eq(4).text();
            trainercodeurl = $(tableName).children().eq(i).children().eq(4).children().attr('href');
            actualwt = $(tableName).children().eq(i).children().eq(5).text();
            declarhorsewt = $(tableName).children().eq(i).children().eq(6).text();
            draw = $(tableName).children().eq(i).children().eq(7).text();
            lbw = $(tableName).children().eq(i).children().eq(8).text();
            runningposition = $(tableName).children().eq(i).children().eq(9).text();

            // each(function(i, elem) {
            //     fruits[i] = $(this).text();
            // });
            // runningposition = fruits.join(', ');

            //fix running position

            _finishtime = $(tableName).children().eq(i).children().eq(10).text(); //convert to seconds
            a = _finishtime.split('.');
            finishtime = (+a[0]) * 60 + (+a[1]) * 1 + (+a[2]);
            winodds = $(tableName).children().eq(i).children().eq(11).text();
            // console.log("horsecode: type" + typeof(horsecode) + horsecode);
            var horsename = "";
            var jockeycode = "";
            var trainercode = "";
            var winoddsrank = 0;
            nonRunner = true;
            s2 = "http://www.hkjc.com/english/racing/jockeyprofile.asp?jockeycode=PZ&season=Current"
            if ((/(^[A-Z\ss]*)\(([A-Z][0-9]{3})\)$/).test(horsecode)) {
                let pat = "/(^[A-Z\s]*)\(([A-Z][0-9]{3})\)$/)";
                horsename = horsecode.match(/(^[A-Z\s]*)\(([A-Z][0-9]{3})\)$/)[1]
                horsecode = horsecode.match(/(^[A-Z\s]*)\(([A-Z][0-9]{3})\)$/)[2]
            }
            //jockeycode
            if ((/.*\?jockeycode=([A-Z]*)&.*/).test(jockeycodeurl)) {
                let pat = "/(^[A-Z\s]*)\(([A-Z][0-9]{3})\)$/)";
                jockeycode = jockeycodeurl.match(/.*\?jockeycode=([A-Z]*)&.*/)[1];
            }
            if ((/.*\?trainercode=([A-Z]*)&.*/).test(trainercodeurl)) {
                let pat = "/(^[A-Z\s]*)\(([A-Z][0-9]{3})\)$/)";
                trainercode = trainercodeurl.match(/.*\?trainercode=([A-Z]*)&.*/)[1];
            }
            if (winodds != "---") {
                winodds = parseFloat(winodds);
                actualwt = parseInt(winodds);
                declarhorsewt = parseInt(declarhorsewt);
                horseno = parseInt(horseno);
                draw = parseInt(horseno);
                allodds.push(winodds);
                allodds.sort();
                nonRunner = false;
                //  "runningposition": "222",
            }

            /** 1. filter
             * "---"
             * "-"
             * nonRunner
             * winodds rank actualwt
             *   "lbw": "17-1/4 PYTHON FUNCTION
             */



            var newrunner = {
                place: place,
                horseno: horseno,
                horsename: horsename,
                horsecode: horsecode,
                jockeycode: jockeycode,
                trainercode: trainercode,
                actualwt: actualwt,
                declarhorsewt: declarhorsewt,
                draw: draw,
                lbw: lbw,
                runningposition: runningposition,
                finishtime: finishtime,
                winodds: winodds,
                winoddsrank: winoddsrank,
                nonRunner: nonRunner

            };
            if (rowCount == 0) {
                newarray.push({});
            } else {
                newarray.push(newrunner);
            }
        }
        newarray.forEach(function(e) {
            e['winoddsrank'] = allodds.indexOf(e['winodds']);
        });

        var newarray2 = newarray.filter(function(h) {
            return h['horsename'] != "";
        })
        res.json(newarray2)

    });


});


app.listen(process.env.PORT || 8000);
console.log('sever running on port 8000');