console.log('Loaded: models/main_artist.js');

App.Models.MainArtist = Backbone.Model.extract({
  initialize: function() {
    console.log('Created: MainArtist Model');
  }
});