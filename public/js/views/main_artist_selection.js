console.log('Loaded: views/main_artist_selection.js');

App.Views.MainArtistSelection = Backbone.View.extend({

  initialize: function() {
    console.log('Created: MainArtistSelection View');
  	this.mainArtistTemplate = Handlebars.compile($('#main-artist-selection-template').html());
  	this.render();
  },

  events: {
  	'click' : 'showMainArtist'
  },

  render: function() {
  	this.$el.html(this.mainArtistTemplate(this.model.toJSON()));
  },

  showMainArtist: function() {
    var artistId = this.$('.main-artist-selection').data('artist-id');
  	var artistImg = this.$('.main-artist-selection').data('artist-img');
    var artistName = this.$('.main-artist-selection').text();
  	App.mainArtistsView.showMainArtist(artistId, artistImg, artistName);
  }

});