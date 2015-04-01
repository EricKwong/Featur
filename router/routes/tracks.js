var express    = require('express'),
		router     = express.Router(),
		logger     = require('morgan'),
    SpotifyApi = require('spotify-web-api-node');

router.use(logger('dev'));
var spotify = new SpotifyApi();

router.get('/:artist_id', function(req, res) {
	spotify.getArtistAlbums(req.params.artist_id)
				 .then(function(albums) {
				 		var albumsArray = albums.body.items;

				 		var albumsIds = albumsArray.map(function(album) {
				 			return album.id;
				 		});

//tracks with artists

				 	// var tracks = albumsIds.map(function(albumId) {
				 	// 	spotify.getAlbum(albumId)
				 	// 				 .then(function(data) {
				 	// 				 	var trackStuff = data.body.tracks.items.map(function(track) {
				 	// 				 		var trackArtists = track.artists.map(function(artist) {
				 	// 				 			var artistInfo = {
				 	// 				 				artistName: artist.name,
				 	// 				 				artistId: artist.id
				 	// 				 			};

				 	// 				 			return artistInfo
				 	// 				 		});

				 	// 				 		var trackData = {
				 	// 				 			trackName: track.name,
				 	// 				 			trackId: track.id,
				 	// 				 			artists: {}
				 	// 				 		};

				 	// 				 		return trackData;
				 	// 				 	});
				 	// 				 	console.log(trackStuff);
				 	// 				 });
				 	// });


// artist with tracks

				 		var collabs = [];

					 	albumsIds.forEach(function(albumId) {

					 		spotify.getAlbum(albumId)
					 					 .then(function(data) {
						 					 	var artistStuff = [];

						 					 	data.body.tracks.items.forEach(function(track) {
						 					 		track.artists.forEach(function(artist) {

						 					 			var artistInfo = {
						 					 				artistName: artist.name,
						 					 				artistId: artist.id,
						 					 				trackName: track.name,
						 					 				trackId: track.id
						 					 			}

						 					 			artistStuff.push(artistInfo);
						 					 		});
						 					 	});

						 					 	console.log(artistStuff);
						 					 	collabs.push(artistStuff);
					 					 });
					 	});

				 		res.send(collabs);

				 });
});

module.exports = router;