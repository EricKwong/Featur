console.log('Loaded: views/main_artists.js');

App.Views.MainArtists = Backbone.View.extend({

	el: '#main-artist-search-results',

  initialize: function() {
    console.log('Created: MainArtists Coll View');
  },

  render: function() {
  	this.collection.each(this.renderOne.bind(this));
  },

  renderOne: function(artist) {
  	var artistSelection = new App.Views.MainArtistSelection({ model: artist });
  	this.$el.append(artistSelection.$el);
  }  
});
