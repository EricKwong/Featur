var express    = require('express'),
    router     = express.Router(),
    logger     = require('morgan');
    SpotifyApi = require('spotify-web-api-node'),

router.use(logger('dev'));
var spotify = new SpotifyApi();

router.get('/:artist_id', function (req, res) {
  spotify.getArtistAlbums(req.params.artist_id)
    .then(function (data) {
      // console.log(data.body.items)
      var albums = data.body.items;
      return albums.map(function (album) { 
        return album.id; 
      });
    })
    .then(function (albumIds) {
      console.log(albumIds);
      return spotify.getAlbums(albumIds)
    })
    .then(function (albumData) {
     
      var albums = albumData.body.albums;
      var tracks = albums.map(function (album) {
        return album.tracks.items;
      });

      var artistsPerTrack = tracks.map(function (album) {
        return album.map(function (track) {
          return track.artists;
        });
      });
           
      // Go through `artistsPerTrack` and create new simple array  
      // associating each track id with each artist id

      console.log(artistsPerTrack)       
  
      res.send(artistsPerTrack);
    })
   
});

module.exports = router;


// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {limit: 10})
//   .then(function(data) {
//     return data.albums.map(function(a) { return a.id; });
//   })
//   .then(function(albums) {
//     return spotifyApi.getAlbums(albums);
//   }).then(function(data) {
//     console.log(data);
//   });