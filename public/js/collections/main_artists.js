console.log('Loaded: collections/main_artists.js');

App.Collections.MainArtists = Backbone.Collection.extend({
  initialize: function() {
    console.log('Created: MainArtist Collection');
  },
  model: App.Models.MainArtist
});