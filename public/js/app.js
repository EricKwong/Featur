var App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

$(function() {
  console.log('Loaded: app.js');

  var App.mainArtistsCollection = new App.Collections.MainArtists();
  var App.collabArtistsCollection = new App.Collections.CollabArtists();
  var App.mainArtistsView = new App.Views.MainArtists({collection: App.mainArtistsCollection});
});