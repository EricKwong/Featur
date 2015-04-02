module.exports = function(app) {
	app.use('/search_artists', require('./routes/artists'));
	app.use('/get_collabs', require('./routes/artist_albums'));
};