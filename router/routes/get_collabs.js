var express    = require('express'),
    router     = express.Router(),
    logger     = require('morgan'),
    SpotifyApi = require('spotify-web-api-node'),
    request    = require('request');

router.use(logger('dev'));
var spotify = new SpotifyApi();

// Router to get all tracks for collaborating artists, based on main artist ID
router.get('/:artist_id', function (req, res) {

  // Request to get albumIds from artistID
  request({
    uri: 'https://api.spotify.com/v1/artists/'+ req.params.artist_id + '/albums?market=US&limit=50&album_type=album,single', 
    method: 'GET',
    json: true
  }, function (error, response, body) {

    var albumIds = body.items.map( function (album) { return album.id } );
    var first20  = albumIds.slice(0,20).join();
    var second20 = albumIds.slice(20,40).join();
    // var third20  = albumIds.slice(40,50);

    if ( albumIds.length === 0 ) {
      console.log("THERE ARE NO ALBUMS");
      var noCollabs = [{
        artistName: 'SORRY! This artist has declined to include their album data on this service. * Womp Womp *',
        artistImg: 'https://lh5.ggpht.com/xwwKuKeuc-9ly3Kxuiek_3GHfXLl7ZDeCPLj4UVkiWtyk_koCv35_I96SVgaZNb-_HY=h900'
      }];
      // Send Error message to front end
      res.send(noCollabs);

    } else {

      // Request to get all album information for first 20 albums
      request({
        uri: 'https://api.spotify.com/v1/albums?ids=' + first20, 
        method: 'GET',
        json: true
        }, function (error, response, body) {

          // ADD CONDITIONAL TO DETERMINE NUMBER OF ALBUM IDs ???

          // request({
          //   uri: 'https://api.spotify.com/v1/albums?ids=' + second20, 
          //   method: 'GET',
          //   json: true
          //   }, 
          //   function (error, response, body) { 

              var albumsWithTracks = body.albums.map(function (album) { return album.tracks.items });
              // var secondList = albumGroup2.map(function (album) { return album.tracks.items });
              // var albumsWithTracks = firstList.concat(secondList);
              // var albumsWithTracks = firstList;

              // Create one dimensional array of all tracks
              var trackArray = [];
              albumsWithTracks.forEach(function (album) {
                album.forEach(function (track) {
                  trackArray.push(track);
                });
              
              });


              // Create nested object of all tracks for all albums of main artist
              // Create objects linking each artist and each track for each track that artists collaborated on
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

              // Transform linking object array into array with one object for each object, containing array of all track objects for that artist 
              var collabArtists = [artistAndTrack[0]];

              for (var i = 1; i < artistAndTrack.length; i++) {
                var artId = artistAndTrack[i].artistId;
                var currentTrack = artistAndTrack[i].track[0];
                
                // Retrieve ids of all artist objects already created        
                var collabIds = collabArtists.map(function (a) {return a.artistId});
                var artIndex = collabIds.indexOf(artId);

  // console.log('\n');
  // console.log('collabIds: ', collabIds);
  // console.log('artId: ', artId, 'artIndex', artIndex, '\n', currentTrack);

                // Push collab artist to final object array if not already there
                if ( artIndex === -1 ) {
                  collabArtists.push( artistAndTrack[i] );
                } else {
                  // If collab artist is already in final object array
                  // Iterate through the track array and push each the track names into an array. Then, check name of current temp data [i] against array to eliminate same tracks having different Ids
                  var tracksAlreadyThere = collabArtists[artIndex].track.map(function (t) {return t.trackName});
                  var trackToPush = currentTrack.trackName;
                  var trackIndex = tracksAlreadyThere.indexOf(trackToPush);
                  if ( trackIndex === -1 ) {
                    collabArtists[artIndex].track.push(currentTrack);

                  }
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

              // Request to obtain artist image URLs
              request({
                uri: 'https://api.spotify.com/v1/artists?ids=' + collabIds.join(),
                method: 'GET',
                json: true
              }, function (error, response, body) {

                var artistArray = body.artists;
                for (var i = 0; i < artistArray.length; i++) {
                  var imgUrl = undefinedCheck(artistArray[i].images[0]);
                  collabArtists[i].artistImg = imgUrl;

                };
                // Remove first object corresponding to mainArtist
                collabArtists.shift();
                // Send response
                res.send(collabArtists); 

              });

          // });   // END REQUEST FOR DATA OF SECOND 20 ALBUMS 

      }); // END REQUEST FOR DATA OF FIRST 20 ALBUMS
      
    } // END IF ... ELSE

  }); // END REQUEST FOR ARTIST'S ALBUMS
}); // END ROUTER
      

module.exports = router;

