var express    = require('express'),
    router     = express.Router(),
    logger     = require('morgan');
    SpotifyApi = require('spotify-web-api-node'),

router.use(logger('dev'));
var spotify = new SpotifyApi();

// Router to get all tracks for collaborating artists, based on main artist ID
router.get('/:artist_id', function (req, res) {
  spotify.getArtistAlbums(req.params.artist_id)
    .then(function (data) {
      var albums = data.body.items;
      return albums.map(function (album) { 
        return album.id; 
      });
    })
    .then(function (albumIds) {
      return spotify.getAlbums(albumIds)
    })
    .then(function (albumData) {
      
      // Create nested object of all tracks for all albums of main artist
      var albums = albumData.body.albums;
      var albumsWithTracks = albums.map(function (album) {
        return album.tracks.items;
      });

      // Create one dimensional array of all tracks
      var trackArray = [];
      albumsWithTracks.forEach(function (album) {
        album.forEach(function (track){
          trackArray.push(track);
        });
      });

      // Create objects linking each artist and each track for each track that artists
      // collaborated on
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

      // Transform linking object array into array with one object for each object,
      // containing array of all track objects for that artist 
      var collabArtists = [artistAndTrack[0]];
      for (var i = 1; i < artistAndTrack.length; i++) {
        var artId = artistAndTrack[i].artistId;
        var currentTrack = artistAndTrack[i].track[0];
        var collabIds = collabArtists.map(function (a) {return a.artistId});
        var artIndex = collabIds.indexOf(artId);
        // console.log('\n');
        // console.log('collabIds: ', collabIds);
        // console.log('artId: ', artId, 'artIndex', artIndex, '\n', currentTrack);

        if ( artIndex === -1 ) {
          collabArtists.push( artistAndTrack[i] );
        } else {
          collabArtists[artIndex].track.push(currentTrack);
        }
      
      };

      // Helper function for dealing with undefined image urls
      var undefinedCheck = function(image) {
        if (image !== undefined) {
          return image.url;
        } else {
          return "http://newton.physics.uiowa.edu/~sbaalrud/empty_profile.gif";
        }
      };

      // Call to Spotify API to get Artist Url
      spotify.getArtists(collabIds)
              .then(function (artists) {
                var artistArray = artists.body.artists;
                for (var i = 0; i < artistArray.length; i++) {
                  var imgUrl = undefinedCheck(artistArray[i].images[1]);
                  collabArtists[i].artistImg = imgUrl;

                };
      
              // Send response
              res.send(collabArtists); 
              }); // END .then()

    }); // END FINAL .then()
      
}); // END ROUTER

module.exports = router;

