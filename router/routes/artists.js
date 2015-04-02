var express    = require('express'),
	router     = express.Router(),
	logger     = require('morgan'),
    SpotifyApi = require('spotify-web-api-node');

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
                artistName: artist.name,
                artistId: artist.id,
                artistImg: undefinedCheck(imageUrl)
            };

            return artistData;
        });

        res.send(newArtists);
    });
});

module.exports = router;