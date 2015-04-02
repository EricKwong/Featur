var express    = require('express'),
    router     = express.Router(),
    logger     = require('morgan');
    SpotifyApi = require('spotify-web-api-node'),

router.use(logger('dev'));
var spotify = new SpotifyApi();

router.get('/:album_id', function (req, res) {
  spotify.getAlbumTracks(req.params.album_id)
  .then( function (data){
    var tracks = data.body.items;
    console.log(tracks);
    res.send(tracks);
  });

});




module.exports = router;
