App.Views.PlaylistSongs = Backbone.View.extend({
	initialize: function() {
		console.log('Created: Playlist Songs Collection View');
		this.listenTo(this.collection, 'reset', this.render);
	},

	el: '#listed-songs',

	render: function() {
		this.$el.empty();
		this.collection.each(this.renderOne, this);
	},

	renderOne: function(songModel) {
		var songView = new App.Views.Song({model: songModel});
		this.$el.append(songView.$el);
	}
});