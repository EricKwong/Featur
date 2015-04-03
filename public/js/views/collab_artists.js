console.log('Loaded: views/collab_artists.js');

App.Views.CollabArtists = Backbone.View.extend({
  initialize: function() {
    console.log('Created: CollabArtists Coll View');
    // Render collection when main artist model is removed
    this.listenTo(this.collection, 'remove', this.render);
  },

  el: '#collab-artist-container',

  render: function() {
    this.collection.each(this.renderOne, this);
  },

  renderOne: function(collabArtistModel) { 
    var collabArtist = new App.Views.CollabArtist({ model: collabArtistModel });
    console.log(this);
    this.$el.append(collabArtist.$el);
  },

  getCollabs: function(collabRoute, mainArtistId) {
    this.collection.url = collabRoute;
    this.collection.fetch({ reset: true });
    // Remove main artist model from collection
    var mainArtistModel = this.collection.where({ artistId: mainArtistId });
    this.collection.remove( mainArtistModel );
  }
  
});