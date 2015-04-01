var express    = require('express'),
		app 			 = express(),
    SpotifyApi = require('spotify-web-api-node'),
    bodyParser = require('body-parser'),
    logger     = require('morgan'),
    router     = require('./router')(app);
    
var spotify = new SpotifyApi();

app.use(bodyParser());
app.use(logger('dev'));

app.listen(3000, function () {
    console.log('Running on 3000!');
});

module.exports = app;