var Twit = require('twit')
const express = require('express')
const app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)
var util = require('./util');
var fs = require('fs');
var path = require('path');

server.listen(3000)


// Les clefs de COCO
/*var T = new Twit({
    consumer_key: 'dbW9gin3u3RhmLB4nBNW5KwgX',
    consumer_secret: 'DAKiwwVYQpnO0HVu7zqAHWMCW1YBzRbMFidEU65feNifGDakih',
    access_token: '331633912-6Foh09Ya3pE1hGboFE60O5ZFsd8SL1qyZds746lL',
    access_token_secret: 'JWHBvUUPFuB212LI6fYggkt36uK1LkPzd3lf9keXVHqSK',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
})*/

// Les clefs de VAL
var T = new Twit({
    consumer_key: 'U1uP0lEqMm0mqPlUj4WzQxeno',
    consumer_secret: 'UqHm8EyWeKof4mqela8KWBS6p12QrEeFzWOKBTUMmD2X73bIa7',
    access_token: '969912715-gGJK0HV736SltNHtXln1LiXwgrrIWShMGM4Sji2A',
    access_token_secret: '6BXiFoqL9gwYrXhi1ULTdvSBhHkxhnp0uTiQJa8EJ5iD8',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
})
var paramTweetVar = 'france';

var stream = T.stream('statuses/filter', { track: paramTweetVar })

var twee = io.of('tweet');

stream.on('tweet', function (tweet) {
    io.sockets.emit('tweet', {
        user: tweet.user.screen_name,
        tweet: tweet.text,
    });
})
////// Serveur web

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('pages/index');
})

app.get('/tweets', function (req, res) {
    res.render('pages/tweets');
})

app.get('/firetweets', function (req, res) {
    res.render('pages/firetweets');
})

app.get('/audio', function (req, res) {
    var files = fs.readdirSync('public');
    var filesFiltered = [];
    for (var i = 0; i < files.length; i++) {
        var filename = path.join('public', files[i]);
        var stat = fs.lstatSync(filename);
        if (filename.indexOf('.mp3') >= 0) {
            filesFiltered.push(filename);
        };
    };
    res.render('pages/audio', { files: filesFiltered });
})
