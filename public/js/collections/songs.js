App.Collections.Songs = Backbone.Collection.extend({
	initialize: function() {
		console.log('Created: Songs Collection');
	},

	model: App.Models.Song,

	url: '/songs'
});