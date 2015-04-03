// console.log('Loaded: views/collab_artists.js');

App.Views.CollabArtists = Backbone.View.extend({
  initialize: function() {
    console.log('Created: CollabArtists Coll View');
    this.listenTo(this.collection, 'reset', this.render);
    // this.listenTo(this.collection, 'remove', this.render);
    this.render();
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

  getCollabs: function(collabRoute) {
    // console.log(mainArtistId);
    this.collection.url = collabRoute;
    this.collection.fetch({ reset: true });

    // var mainArtistModel = this.collection.where({ artistId: mainArtistId });
    // this.collection.remove( mainArtistModel );
    // this.render();
  }
  
});