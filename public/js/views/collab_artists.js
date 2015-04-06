// console.log('Loaded: views/collab_artists.js');

App.Views.CollabArtists = Backbone.View.extend({
  el: '#collab-artist-container',
 
  initialize: function() {
    console.log('Created: CollabArtists Coll View');
    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.collection.each(this.renderOne, this);
  },

  renderOne: function(collabArtistModel) { 
    var collabArtist = new App.Views.CollabArtist({ model: collabArtistModel });
    this.$el.append(collabArtist.$el);
  },

  getCollabs: function(collabRoute) {
    this.collection.url = collabRoute;
    this.collection.fetch({ reset: true });
  }
  
});