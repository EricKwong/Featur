console.log('Loaded: collections/collab_artists.js');

App.Collections.CollabArtists = Backbone.Collection.extend({
  initialize: function() {
    console.log('Created: CollabArtist collection');
  },
  model: App.Models.CollabArtist
});