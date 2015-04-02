module.exports = function(app) {
	app.use('/search_artists', require('./routes/artists'));
  app.use('/get_artist_albums', require('./routes/artist_albums'));
  app.use('/album_tracks', require('./routes/album_tracks'));
};