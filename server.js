var express    = require('express'),
		app 			 = express(),
    SpotifyApi = require('spotify-web-api-node'),
    logger     = require('morgan'),
    router     = require('./router')(app);
    
var spotify = new SpotifyApi();

app.use(logger('dev'));
app.use(express.static(__dirname + "/public"));

app.listen( process.env.PORT || 3000, function () {
    console.log('Running on 3000!');
});

module.exports = app;