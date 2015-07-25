var express    = require('express'),
	  router     = express.Router(),
	  logger     = require('morgan'),
    request    = require('request');

router.use(logger('dev'));

router.get('/:artist', function (req, res) {
  request({
    uri: 'https://api.spotify.com/v1/search?type=artist&q=' + req.params.artist,
    method: 'GET',
    json: true
  }, function (error, response, body) {

    var undefinedCheck = function(image) {
      return (image !== undefined) ? image.url : "http://newton.physics.uiowa.edu" + 
                                                 "/~sbaalrud/empty_profile.gif";
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
    newArtists.sort(function(a,b) { b.artistPop - a.artistPop; });
    res.send(newArtists);
  });
});

module.exports = router;