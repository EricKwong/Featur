var express    = require('express'),
		app 			 = express(),
    SpotifyApi = require('spotify-web-api-node'),
    logger     = require('morgan'),
    router     = require('./router')(app);
    
var spotify = new SpotifyApi();

app.use(logger('dev'));

app.listen(3000, function () {
    console.log('Running on 3000!');
});

module.exports = app;