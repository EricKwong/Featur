console.log('Loaded: views/collab_artists.js');

App.Views.CollabArtists = Backbone.View.extend({
  initialize: function() {
    console.log('Created: CollabArtists Coll View');
    this.listenTo(this.collection, 'reset', this.render);
  },

  el: '#collab-artist-container',

  render: function() {
  	this.collection.each(this.renderOne);
  },

  renderOne: function(collabArtistModel) {
  	var collabArtist = new App.Views.CollabArtist({model: collabArtistModel});
  	this.$el.append(collabArtist);
  }
});