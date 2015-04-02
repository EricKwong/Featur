console.log('Loaded: views/main_artist.js');

App.Views.MainArtist = Backbone.View.extend({
	initialize: function() {
		console.log('Created: MainArtist View');
		this.template = Handlebars.compile($('#main-artist-template').html());
		this.render();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}

});