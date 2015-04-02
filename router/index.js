module.exports = function(app) {
	app.use('/search_artists', require('./routes/artists'));
<<<<<<< HEAD
	app.use('/get_tracks', require('./routes/tracks'));
=======
  app.use('/get_artist_albums', require('./routes/artist_albums'));
  app.use('/album_tracks', require('./routes/album_tracks'));
>>>>>>> 811d11f285beb66836a40ba51cce9d6a40c9651e
};