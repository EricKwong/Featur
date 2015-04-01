module.exports = function(app) {
	app.use('/search_artists', require('./routes/artists'));
};