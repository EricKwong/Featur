App.Collections.Songs = Backbone.Collection.extend({
	intialize: function() {
		console.log('Created: Songs Collection');
	},

	model: App.Models.Song,

	url: '/songs'
});