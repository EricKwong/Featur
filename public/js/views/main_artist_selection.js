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

  className: 'main-artist-selection',

  tagName: 'div',

  render: function() {
  	this.$el.html(this.mainArtistTemplate(this.model.toJSON()));
  },

  showMainArtist: function() {
    var artistId = this.$el.data('artist-id');
  	var artistImg = this.$el.data('artist-img');
    var artistName = this.$el.text();
  	App.mainArtistsView.showMainArtist(artistId, artistImg, artistName);
    this.showCollabArtist(artistId);
  },

  showCollabArtist: function(artistId) {
    var getCollabRoute = '/get_collabs/' + artistId;
    App.collabArtistsView.getCollabs(getCollabRoute);
  }

});