console.log('Loaded: views/main_artist_selection.js');

App.Views.MainArtistSelection = Backbone.View.extend({

  initialize: function() {
    console.log('Created: MainArtistSelection View');
  	this.mainArtistTemplate = Handlebars.compile($('#main-artist-selection-template').html());
  	this.render();
  },

  render: function() {
  	this.$el.html(this.mainArtistTemplate(this.model.toJSON()));
  }

});