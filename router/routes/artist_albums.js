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
      return spotify.getAlbums(albumIds)
      // res.send(albumIds);
    })
    .then(function (albumData) {

      var albums = albumData.body.albums;
      var albumsWithTracks = albums.map(function (album) {
        return album.tracks.items;
      });


      var trackArray = [];
      albumsWithTracks.forEach(function (album) {
        album.forEach(function (track){
          trackArray.push(track);
        });
      });


      var artistAndTrack = [];

      trackArray.forEach(function(track) {
        track.artists.forEach(function(artist) {

          var artistInfo = {
              artistName: artist.name,
              artistId: artist.id,
              track: [{ 
                trackName: track.name,
                trackId: track.id,
                trackUri: track.uri
              }],
          };

          artistAndTrack.push(artistInfo);
        });
      });


      var collabArtists = [artistAndTrack[0]];

      

      for (var i = 1; i < artistAndTrack.length; i++) {
        var artId = artistAndTrack[i].artistId;
        var currentTrack = artistAndTrack[i].track[0];
        var collabIds = collabArtists.map(function (a) {return a.artistId});
        var artIndex = collabIds.indexOf(artId);
        console.log('\n');
        console.log('collabIds: ', collabIds);
        console.log('artId: ', artId, 'artIndex', artIndex, '\n', currentTrack);

        if ( artIndex === -1 ) {
          collabArtists.push( artistAndTrack[i] );
        } else {
          console.log('collabArtists:', collabArtists );
          collabArtists[artIndex].track.push(currentTrack);
        }
      
      };

      res.send(collabArtists);

    });
      
      
      // }
        // spotify.getArtist(track.artistId)
          // var imageUrl = artist.images[1];
          
          // var undefinedCheck = function(image) {
          //   if (image !== undefined) {
          //     return image.url;
          //   } else {
          //     return "http://newton.physics.uiowa.edu/~sbaalrud/empty_profile.gif";
          //   }
          // };
          


});

module.exports = router;

