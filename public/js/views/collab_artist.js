console.log('Loaded: views/collab_artist.js');

App.Views.CollabArtist = Backbone.View.extend({
  initialize: function() {
    console.log('Created: CollabArtist View');
    this.collabArtistTemplate = Handlebars.compile($('#collab-artist-template').html());
    this.render();
  },

  events: {
  	'click .save-track' : 'saveSong'
  },

  render: function() {
  	this.$el.html(this.collabArtistTemplate(this.model.toJSON()));
  },

  saveSong: function(clicked) {
  	var clickedTrack = clicked.currentTarget;
  	var trackId = $(clickedTrack).data('track-id');
  	var trackUri = $(clickedTrack).data('track-uri');
  	var trackName = $(clickedTrack).data('track-name');
  	
    var songData = {
      trackName: trackName,
      trackId: trackId,
      trackUri: trackUri
    };

    var saveSong = new App.Models.SaveSongs(songData); 
    saveSong.save();
    var songToPlaylist = new App.Models.SongsToPlaylist
  }
});
