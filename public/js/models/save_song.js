App.Models.SaveSong = Backbone.Model.extend({
	initialize: function() {
		console.log('Created: Save Song Model');
	},

	url: '/songs'
});