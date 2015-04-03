module.exports = function(app) {
	app.use('/search_artists', require('./routes/search_artists'));
	app.use('/get_collabs', require('./routes/get_collabs'));
};