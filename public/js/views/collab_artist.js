console.log('Loaded: views/collab_artist.js');

App.Views.CollabArtist = Backbone.View.extend({
  initialize: function() {
    console.log('Created: CollabArtist View');
    this.collabArtistTemplate = Handlebars.compile($('#collab-artist-template').html());
    this.render();
  },

  events: {
  	'click .save-track' : 'saveSong',
    'click .make-main'  : 'makeMain'
  },

  render: function() {
  	this.$el.html(this.collabArtistTemplate(this.model.toJSON()));
  },

  makeMain: function() {
    var clickedCollab = this.$el.find('div.collab-artist');
    var artistId = clickedCollab.data('artist-id');
    var artistName = clickedCollab.data('artist-name');
    var artistImg = clickedCollab.data('artist-img');
    $('#main-artist-container').empty();
    $('#collab-artist-container').empty();
    App.collabArtistsView.getCollabs('/get_collabs/' + artistId);
    App.mainArtistsView.showMainArtist(artistId, artistImg, artistName);
  },


  saveSong: function(clicked) {
  	var clickedTrack = clicked.currentTarget;
  	var trackId = $(clickedTrack).data('track-id');
  	var trackUri = $(clickedTrack).data('track-uri');
  	var trackName = $(clickedTrack).data('track-name');
    var collabArtist = $(clickedTrack).parents('.collab-artist').data('artist-name');
    var mainArtist = $('.main-artist .name').text();
  	
    var songData = {
      trackName: trackName,
      trackId: trackId,
      trackUri: trackUri,
      collabArtist: collabArtist,
      mainArtist: mainArtist
    };
    
    var songsCollection = new App.Collections.Songs();
    songsCollection.create(songData, {success: function() {
      songsCollection.fetch({success: function() {

        var playlistId = $('#playlist-dropdown option:selected').data('playlist-id');
        var selectedSong = songsCollection.findWhere({'trackId' : trackId});
        var songId = selectedSong.id;
        var songToPlaylistUrl = '/playlists/' + playlistId + '/add_song';

        $.ajax({
          url: songToPlaylistUrl,
          method: 'PUT',
          data: {songId: songId}
        }).done(function() {
          App.playlistSongsView.updatePlaylist();
        });

      }});

    }});
  }
});
