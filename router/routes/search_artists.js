var express    = require('express'),
	router     = express.Router(),
	logger     = require('morgan'),
    SpotifyApi = require('spotify-web-api-node'),
    request    = require('request');

router.use(logger('dev'));
var spotify = new SpotifyApi();

router.get('/:artist', function (req, res) {

console.log(req.params.artist)
//https://api.spotify.com/v1/search?type=artist&q=buckwheat%20zydeco

  request({
    uri: 'https://api.spotify.com/v1/search?type=artist&q=' + req.params.artist,
    method: 'GET',
    json: true
  }, function (error, response, body) {

    var undefinedCheck = function(image) {
      if (image !== undefined) {
        return image.url;
      } else {
        return "http://newton.physics.uiowa.edu/~sbaalrud/empty_profile.gif";
      }
    }; 

    var artists = body.artists.items;
    var newArtists = artists.map(function(artist) {
      var imageUrl = artist.images[0];

      var artistData = {
          artistName: artist.name,
          artistId: artist.id,
          artistPop: artist.popularity,
          artistImg: undefinedCheck(imageUrl)
      };

      return artistData;
    });

    // Sort results based on artist popularity
    //
    //
    // End sort

    res.send(newArtists);
  });
});

module.exports = router;