App.Collections.PlaylistSongs = Backbone.Collection.extend({
	initialize: function() {
		console.log('Created: Playlist Songs Collection');
	},

	model: App.Models.PlaylistSong
});