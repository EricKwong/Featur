console.log('Loaded: views/main_artists.js');

App.Views.MainArtists = Backbone.View.extend({

	el: '#main-container',

  initialize: function() {
    console.log('Created: MainArtists Coll View');
  },

  render: function() {
  	this.collection.each(this.renderOne.bind(this));
  },

  renderOne: function(artist) {
  	var artistSelection = new App.Views.MainArtistSelection({ model: artist });
  	this.$('#main-artist-search-results').append(artistSelection.$el);
  }  
});
