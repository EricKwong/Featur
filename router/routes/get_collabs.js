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
    uri: 'https://api.spotify.com/v1/artists/' + mainArtistId + 
          '/albums?limit=50&album_type=album,single', 
    method: 'GET',
    json: true
  }, function (error, response, body) {
    // Separate ids into sets of 20. Check if number of ids < 20
    var albumIds = body.items.map(function (album) { return album.id; });
      // If there are no albums, send error message as artist name & image
    if ( albumIds.length === 0 ) {
      var noAlbums = [{ artistName: 'SORRY! No data found! Try selecting a ' + 
                                    'name with only one main artist.',
                        artistImg: 'https://lh5.ggpht.com/xwwKuKeuc-9ly3Kxuiek_3GHf' +
                                   'XLl7ZDeCPLj4UVkiWtyk_koCv35_I96SVgaZNb-_HY=h900' }];
      res.send(noAlbums);
    } else {
      var first20Ids  = albumIds.slice(0,20).join();
      var second20Ids = albumIds.slice(20,40).join();
      // Request to get all album information for first 20 albums 
      request({
        uri: 'https://api.spotify.com/v1/albums?ids=' + first20Ids, 
        method: 'GET',
        json: true
      }, function (error, response, body) {
        var tracksOfFirst20 = tracksFromAlbums(body.albums);
        // If there are less than 20 albums, no further requests are needed
        if ( !second20Ids ) {
          // create final array of collab artist objects from array of all track objects    
          createCollabArtists(tracksOfFirst20, mainArtistId);
        } else {
          // Otherwise, request to grab data for second 20 albums 
          request({
            uri: 'https://api.spotify.com/v1/albums?ids=' + second20Ids, 
            method: 'GET',
            json: true
          }, function (error, response, body) { 
            var tracksOfSecond20 = tracksFromAlbums(body.albums);
            var allTracks = tracksOfFirst20.concat(tracksOfSecond20);
            createCollabArtists(allTracks, mainArtistId);
          });
        } 
      });
    } 
  }); 

  function createCollabArtists (allTracks, mainArtistId) {
    // Create objects linking each artist to each track they appear on
    var artistAndTrack = linkArtistsToTracks(allTracks);
    /* Transform linking object array into array with one object for each artist,
    collecting track objects for that artist. Limit number of collabs to 50 (max for API) */      
    var collabArtists = collectTracks(artistAndTrack).slice(0,50);
    var collabIds = collabArtists.map(function (a) { return a.artistId; });
    // Request to obtain artist image URLs
    request({
      uri: 'https://api.spotify.com/v1/artists?ids=' + collabIds.join(),
      method: 'GET',
      json: true
    }, function (error, response, body) {
      var artistArray = body.artists;
      for (var i = 0; i < artistArray.length; i++) {
        var imageToTest = artistArray[i].images[0];
        var imgUrl = (imageToTest !== undefined) ? imageToTest.url : "http://newton.physics.uiowa.edu/~sbaalrud/empty_profile.gif";
        collabArtists[i].artistImg = imgUrl;
      };
      // Sort collab artist array based on # of tracks
      collabArtists.sort(function(a,b) { return b.trackNum - a.trackNum; });
      // Remove main artist object from collab results
      collabArtists = collabArtists.filter(function (artist) {
        return artist.artistId !== mainArtistId;
      });
      // Send error if no collabs
      if ( collabArtists.length === 0 ) {
        var noCollab = [{ artistName: 'No featured artists were found...',
                           artistImg: 'https://lh5.ggpht.com/xwwKuKeuc-9ly3Kxuiek_3GHf' +
                                      'XLl7ZDeCPLj4UVkiWtyk_koCv35_I96SVgaZNb-_HY=h900' }];
        res.send(noCollab);
      } else {
        // Send collab artist info to Front End
        res.send(collabArtists); 
      }
    });
  }; 

}); // END ROUTER

/*-----------------------
    HELPER FUNCTIONS
-----------------------*/

function tracksFromAlbums (albums) {
  // Create nested object of [allAlbums] [allTracks] for main artist
  var albumDataAndTracksData = albums.map(function (album) { 
    return album.tracks.items;
  });
  // Create one dimensional array of all tracks from nested object
  var tracksData = [];
  albumDataAndTracksData.forEach(function (album) {
    album.forEach(function (track) {
      tracksData.push(track);
    });
  });

  return tracksData;
};

function collectTracks (artistAndTrack) {
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
      /* If collab artist is already in final object array, iterate through the track array and push each the track names into an array. Then check name of current temp data [i] against array to eliminate same tracks having different Ids */
      var tracksAlreadyThere = collabArtists[artIndex].track.map(function (t) {
        return t.trackName;
      });
      var trackToPush = currentTrack.trackName;
      var trackIndex = tracksAlreadyThere.indexOf(trackToPush);
      if ( trackIndex === -1 ) {
        collabArtists[artIndex].track.push(currentTrack);
        // Iterate number of tracks for later sorting
        collabArtists[artIndex].trackNum++;
      }
    }
  };

  return collabArtists;
};

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

module.exports = router;

