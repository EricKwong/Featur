var express    = require('express'),
	router     = express.Router(),
<<<<<<< HEAD
	logger     = require('morgan'),
    SpotifyApi = require('spotify-web-api-node');
=======
	logger     = require('morgan');
    SpotifyApi = require('spotify-web-api-node'),
>>>>>>> 811d11f285beb66836a40ba51cce9d6a40c9651e

router.use(logger('dev'));
var spotify = new SpotifyApi();

router.get('/:artist', function (req, res) {
  spotify.searchArtists(req.params.artist)
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

module.exports = router;