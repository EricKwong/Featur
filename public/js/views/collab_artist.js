console.log('Loaded: views/collab_artist.js');

App.Views.CollabArtist = Backbone.View.extend({
  initialize: function() {
    console.log('Created: CollabArtist View');
    this.collabArtistTemplate = Handlebars.compile($('#collab-artist-template').html());
    this.render();
  },

  render: function() {
  	this.$el.html(this.collabArtistTemplate(this.model.toJSON()));
  }
});
