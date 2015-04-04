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
  App.playlistCollection = new App.Collections.Playlist();
  App.playlistSongsCollection = new App.Collections.PlaylistSongs();
  
  App.mainArtistsView = new App.Views.MainArtists({collection: App.mainArtistsCollection});
  App.collabArtistsView = new App.Views.CollabArtists({collection: App.collabArtistsCollection});
  App.playlistView = new App.Views.Playlist({collection: App.playlistCollection});
  App.playlistSongsView = new App.Views.PlaylistSongs({collection: App.playlistSongsCollection});
});