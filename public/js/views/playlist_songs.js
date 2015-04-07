App.Views.PlaylistSongs = Backbone.View.extend({
	initialize: function() {
		console.log('Created: Playlist Songs Collection View');
		this.listenTo(this.collection, 'reset', this.render);
		this.listenTo(this.collection, 'add', this.renderOne);
		this.$el.hide();
	},

	el: '#listed-songs',

	render: function() {
		this.$el.empty();
		this.collection.each(this.renderOne, this);
	},

	renderOne: function(songModel) {
		var songView = new App.Views.PlaylistSong({model: songModel});
		this.$el.append(songView.$el);
	},

	showPlaylist: function(playlistId) {
		this.collection.url = '/playlists/' + playlistId + '/songs';
		this.collection.fetch({reset: true, success: function() {
			// Take track ids from shown playlist and show spotify plugin
			var songIds       = [],
				  songElArray   = this.$('.playlist-song'),
				  pluginRootUrl =	'https://embed.spotify.com/?uri=spotify:trackset:FeaturPlaylist:';

			for (var i = 0; i < songElArray.length; i++) {
				songIds.push( $(songElArray[i]).data('track-id') );
			};
			
			if ( songIds.length !== 0 ) {
				$('iframe').attr('src', pluginRootUrl + songIds.join());
			};
		}});		
	},

	updatePlaylist: function() {
		this.collection.fetch();
	}
});