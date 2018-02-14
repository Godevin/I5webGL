var Twit = require('twit')
const express = require('express')
const app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)
var util = require('./util');

server.listen(3000)

var T = new Twit({
    consumer_key: 'dbW9gin3u3RhmLB4nBNW5KwgX',
    consumer_secret: 'DAKiwwVYQpnO0HVu7zqAHWMCW1YBzRbMFidEU65feNifGDakih',
    access_token: '331633912-6Foh09Ya3pE1hGboFE60O5ZFsd8SL1qyZds746lL',
    access_token_secret: 'JWHBvUUPFuB212LI6fYggkt36uK1LkPzd3lf9keXVHqSK',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
})


//
// filter the public stream by english tweets containing `#apple`
//
var stream = T.stream('statuses/filter', { track: '#SaintValentin', language: 'fr' })

var twee = io.of('tweet');

stream.on('tweet', function (tweet) {
    var coordinates = null
    if (tweet.coordinates) {
        coordinates = tweet.coordinates.coordinates.reverse();
    }
    else if (tweet.place) {
        coordinates = util.getBoundingBoxCenter(tweet.place.bounding_box.coordinates[0]);
    }

    io.sockets.emit('tweet', {
        user: tweet.user.screen_name,
        tweet: tweet.text,
        location: coordinates
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

app.get('/audio', function (req, res) {
    res.render('pages/audio');
})
