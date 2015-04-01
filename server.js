var express = require('express');
var SpotifyApi = require('spotify-web-api-node');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
var spotify = new SpotifyApi();

app.use(bodyParser());
app.use(logger('dev'));

app.get('/search', function(req, res) {
	spotify.searchArtists('beyonce')
		.then(function(data) {
			var artists = data.body.artists.items;
			var newArtists = artists.map(function(artist) {
				var imageUrl = artist.images[1];
				var undefinedCheck = function(image) {
					if (image !== undefined) {
						return image.url;
					} else {
						return "http://newton.physics.uiowa.edu/~sbaalrud/empty_profile.gif";
					}
				};
				var artistData = {
					name: artist.name,
					artist_id: artist.id,
					image: undefinedCheck(imageUrl)
				};
				return artistData;
			});
			res.send(newArtists);
		});
});

app.listen(3000, function () {
	console.log('Listening on 3000!');
});