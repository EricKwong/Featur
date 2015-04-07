App.Views.PlaylistSong = Backbone.View.extend({
	initialize: function() {
		console.log('Created: Playlist Song View');
		this.songTemplate = Handlebars.compile($('#song-template').html());
		this.render();
	},

	events: {
		'click .delete-song' : 'deleteSong'
	},

	render: function() {
		this.$el.html(this.songTemplate(this.model.toJSON()));
	},

	deleteSong: function(clicked) {
		var clickedButton = clicked.currentTarget;
		var songId = $(clickedButton).parent().data('db-id');
		var playlistId = $('#playlist-dropdown option:selected').data('playlist-id');

		$.ajax({
			url: '/playlists/' + playlistId + '/remove_song',
			method: 'PUT',
			data: {
				songId : songId
			}
		}).done(function() {
			App.playlistSongsView.showPlaylist(playlistId);
		});
	}
}); 