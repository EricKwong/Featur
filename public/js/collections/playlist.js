App.Collections.Playlist = Backbone.Collection.extend({
	initialize: function() {
		console.log('Created: Playlist Collection');
	},

	model: App.Models.Playlist,

	url: '/playlists'
});