var express    = require('express'),
    router     = express.Router(),
    logger     = require('morgan'),
    request    = require('request');

router.use(logger('dev'));

// Router to get all tracks for collaborating artists, based on main artist ID
router.get('/:artist_id', function (req, res) {
  var mainArtistId = req.params.artist_id;
  // Request to get albumIds from artistID 
  request({
    uri: 'https://api.spotify.com/v1/artists/' + 
          mainArtistId + 
          '/albums?limit=50&album_type=album,single', 
    method: 'GET',
    json: true
  }, function (error, response, body) {
    /*
    *   FUNCTION DECLARATIONS  
    */

    /*
    Large Function to eliminate redundant code for nested calls
    Creates final array of collab artist objects based on array of all track objects
    */    
    var createCollabArtists = function(allTracks, mainArtistId) {

      // Create objects linking each artist to each track they appear on
      var artistAndTrack = linkArtistsToTracks(allTracks);

      function linkArtistsToTracks (allTracks) {
        var artistAndTrack = [];
        allTracks.forEach(function(track) {
          track.artists.forEach(function(artist) {
            // Format for final object to output to front end
            var artistInfo = {
              artistName: artist.name,
              artistId: artist.id,
              track: [{ trackName: track.name,
                        trackId: track.id,
                        trackUri: track.uri }],
              trackNum: 1
            };

            artistAndTrack.push(artistInfo);
          });
        });

        return artistAndTrack;
      };




      /*
      Transform linking object array into array with one object for each artist
      Each artist object contains an array of all track objects for that artist 
      */     
      var collabArtists = [artistAndTrack[0]];
      for (var i = 1; i < artistAndTrack.length; i++) {
        var artId = artistAndTrack[i].artistId;
        var currentTrack = artistAndTrack[i].track[0];

        // Retrieve ids of all artist objects already created        
        var collabIds = collabArtists.map(function (a) {return a.artistId});

        // Push collab artist to final object array if not already there
        var artIndex = collabIds.indexOf(artId);
        if ( artIndex === -1 ) {
          collabArtists.push(artistAndTrack[i]);
        } else {
          /*
          If collab artist is already in final object array, iterate through the track array and push each the track names into an array. Then, check name of current temp data [i] against array to eliminate same tracks having different Ids
          */
          var tracksAlreadyThere = collabArtists[artIndex].track.map(function (t) {return t.trackName});
          var trackToPush = currentTrack.trackName;
          var trackIndex = tracksAlreadyThere.indexOf(trackToPush);
          if ( trackIndex === -1 ) {
            collabArtists[artIndex].track.push(currentTrack);
            // Iterate number of tracks for later sorting
            collabArtists[artIndex].trackNum++;
          }
        }
      };


      /*      
      Request to obtain artist image URLs; Limit number of collaborators to 50 (maximum for acquiring artist data from Spotify API)
      */      
      var collabArtists = collabArtists.slice(0,50);
      var collabIds = collabArtists.map(function (a) {return a.artistId});
      request({
        uri: 'https://api.spotify.com/v1/artists?ids=' + collabIds.join(),
        method: 'GET',
        json: true
      }, function (error, response, body) {

        var artistArray = body.artists;
        for (var i = 0; i < artistArray.length; i++) {
          // call to helper fxn to test for undefined urls in API
          var imgUrl = undefinedCheck(artistArray[i].images[0]);
          collabArtists[i].artistImg = imgUrl;

        };
        // Sort collab artist array based on # of tracks
        var compare = function(a,b) { return b.trackNum - a.trackNum; };
        collabArtists.sort(compare);
        // Remove main artist object corresponding to mainArtist
        collabArtists = collabArtists.filter(function (artist) {
          return artist.artistId !== mainArtistId;
        });

        if ( collabArtists.length === 0 ) {
          console.log("THERE ARE NO COLLABS");
          var noCollabs = [{
            artistName: 'No featured artists were found...',
            artistImg: 'https://lh5.ggpht.com/xwwKuKeuc-9ly3Kxuiek_3GHfXLl7ZDeCPLj4UVkiWtyk_koCv35_I96SVgaZNb-_HY=h900'
          }];
          res.send(noCollabs);

        } else {
          // SEND RESPONSE TO FRONT END (FINALLY!!!)
          res.send(collabArtists); 
        }
      });
    }; // END FUNCTION DECLARATION

    /*
    ############################################
    #         BEGIN MAIN ROUTER LOGIC 
    ############################################
    */
    var albumIds = body.items.map( function (album) { return album.id } );
    var first20  = albumIds.slice(0,20).join();
    var second20 = albumIds.slice(20,40).join();

    if ( albumIds.length === 0 ) {
      console.log("THERE ARE NO ALBUMS");
      // If there are no albums, send error message as artist name & image
      var noAlbums = [{
        artistName: 'SORRY! No data found! Try selecting a name with only one main artist.',
        artistImg: 'https://lh5.ggpht.com/xwwKuKeuc-9ly3Kxuiek_3GHfXLl7ZDeCPLj4UVkiWtyk_koCv35_I96SVgaZNb-_HY=h900'
      }];
      // Send Error message to front end
      res.send(noAlbums);

    } else {
      // #######  Request to get all album information for first 20 albums 
      request({
        uri: 'https://api.spotify.com/v1/albums?ids=' + first20, 
        method: 'GET',
        json: true
        }, function (error, response, body) {
          // Create nested object of [allAlbums] [allTracks] for main artist
          var first20Albums = body.albums.map(function (album) { 
            return album.tracks.items 
          });
          // Create one dimensional array of all tracks from nested object
          var trackOfFirst20 = [];
          first20Albums.forEach(function (album) {
            album.forEach(function (track) {
              trackOfFirst20.push(track);
            });
          });
          // If there are less than 20 albums, no further requests are needed
          if ( albumIds.length <= 20 ) {
            // Call function to create Final Output and send to Front End
            createCollabArtists(trackOfFirst20, mainArtistId);

          } else {
            // ####### Otherwise, request to grab data for next 20 albums 
            request({
              uri: 'https://api.spotify.com/v1/albums?ids=' + second20, 
              method: 'GET',
              json: true
              }, function (error, response, body) { 

                var second20Albums = body.albums.map(function (album) { 
                  return album.tracks.items;
                });
                var trackOfSecond20 = [];
                second20Albums.forEach(function (album) {
                  album.forEach(function (track) { trackOfSecond20.push(track); });
                });
                var allTracks = trackOfFirst20.concat(trackOfSecond20);
                createCollabArtists(allTracks, mainArtistId);

              });
          } // END ELSE
        }); // END Request
    } // END IF ... ELSE for # of albums
  }); // END Request for albums's artists
}); // END ROUTER







      
// Helper function for dealing with undefined image urls
function undefinedCheck (image) {
  if (image !== undefined) {
    return image.url;
  } else {
    return "http://newton.physics.uiowa.edu/~sbaalrud/empty_profile.gif";
  }
};


module.exports = router;

