var App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

$(function() {
  console.log('Loaded: app.js');

  App.mainArtistsCollection = new App.Collections.MainArtists();
  App.collabArtistsCollection = new App.Collections.CollabArtists();
  App.mainArtistsView = new App.Views.MainArtists({collection: App.mainArtistsCollection});
});