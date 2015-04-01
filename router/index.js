module.exports = function(app) {
	app.use('/search_artists', require('./routes/artists'));
	app.use('/get_tracks', require('./routes/tracks'));
};