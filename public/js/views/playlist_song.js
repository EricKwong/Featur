App.Views.PlaylistSong = Backbone.View.extend({
	initialize: function() {
		console.log('Created: Playlist Song View');
		this.songTemplate = Handlebars.compile($('#song-template').html());
		this.render();
	},

	events: {
		
	},

	render: function() {
		this.$el.html(this.songTemplate(this.model.toJSON()));
	}
});