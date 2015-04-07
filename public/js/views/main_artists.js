console.log('Loaded: views/main_artists.js');

App.Views.MainArtists = Backbone.View.extend({

	el: '#main-container',

  initialize: function() {
    console.log('Created: MainArtists Coll View');
    this.listenTo(this.collection, 'reset', this.render);
  },

  events: {
    'click #search-button' : 'searchArtist',
    'keypress #search-input' : 'searchByEnter'
  },

  render: function() {
    this.$('#main-artist-search-results').empty();
    this.$('#main-artist-container').empty();
    this.$('#collab-artist-container').empty();
    this.collection.each(this.renderOne, this);
  },

  renderOne: function(artistModel) {
    var artistData = {
      'data-artist-id' : artistModel.get('artistId'),
      'data-artist-img' : artistModel.get('artistImg')
    };
    var artistSelection = new App.Views.MainArtistSelection({ model: artistModel, attributes: artistData });
    this.$('#main-artist-search-results').append(artistSelection.$el);
  },

  searchByEnter: function(e) {
    if (e.which === 13) {
      this.searchArtist();
    }
  },

  searchArtist: function() {
    var searchInput = this.$('#search-input').val();
    this.$('#search-input').val("");
    this.collection.url = '/search_artists/' + encodeURI(searchInput);
    this.collection.fetch({reset: true});
  },

  showMainArtist: function(artistId, artistImg, artistName) {
    this.$('#main-artist-search-results').empty();
    var mainArtistModel = new App.Models.MainArtist({artistName: artistName, artistImg: artistImg, artistId: artistId});
    var mainArtistView = new App.Views.MainArtist({model: mainArtistModel});
    mainArtistView.$el.appendTo('#main-artist-container');
  }
});
