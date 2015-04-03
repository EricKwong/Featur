var express    = require('express'),
    router     = express.Router(),
    logger     = require('morgan'),
    bodyParser = require('body-parser'),
    models		 = require('../../models');

var Playlist = models.playlists;
var Song = models.songs;

router.use(logger('dev'));
router.use(bodyParser());

// Index
router.get('/', function (req, res) {
	Playlist 
		.findAll()
		.then(function(playlists) {
			res.send(playlists);
		});
});

// Show
router.get('/:id/songs', function (req, res) {
	Playlist
		.findOne({
			where: { id: req.params.id },
			include: [Song]
		})
		.then(function(playlist) {
			res.send(playlist);
		});
});

// Create
router.post('/', function (req, res) {
	Playlist
		.create(req.body)
		.then(function(newPlaylist) {
			res.send(newPlaylist);
		});
});

// Update
router.put('/:id', function (req, res) {
	Playlist
		.findOne(req.params.id)
		.then(function (playlist) {
			playlist
				.update(req.body)
				.then(function(updatedPlaylist) {
					res.send(updatedPlaylist);
				});
		});
});

// Destroy
router.delete('/:id', function (req,res) {
	Playlist
		.findOne(req.params.id)
		.then(function(playlist) {
			playlist
				.destroy()
					res.send(playlist);
		});
});

// Add Relationship
router.put('/:id/add_song', function (req, res) {
	Playlist
		.findOne(req.params.id)
		.then(function (playlist) {
			Song
				.findOne(req.body.songId)
				.then(function (song) {
					playlist.addSong(song);
					res.send(song);	
				});
		});
});

// Remove Relationship
router.put('/:id/remove_song', function (req, res) {
	Playlist
		.findOne(req.params.id)
		.then(function (playlist) {
			Song
				.findOne(req.body.songId)
				.then(function(song) {
					playlist.removeSong(song);
					res.send(song);
				});
		});
});

module.exports = router;
