App.Views.Playlist = Backbone.View.extend({
	initialize: function() {
		console.log('Created: Playlist View');
		this.allPlaylistTemplate = Handlebars.compile($('#playlist-dropdown-template').html());
		this.listenTo(this.collection, 'reset', this.render);
		this.listenTo(this.collection, 'add', this.render);
		this.collection.fetch({reset: true});
	},

	el: '#playlist',

	events: {
		'click #create-playlist' : 'createPlaylist',
		'change #playlist-dropdown' : 'showPlaylistSongs'
	},

	render: function() {
		this.$('#playlist-dropdown').empty();
		this.collection.each(this.renderSelectPlaylist, this);
	},

	renderSelectPlaylist: function(playlistModel) {
		this.$('#playlist-dropdown').append(this.allPlaylistTemplate(playlistModel.toJSON()));
	},

	createPlaylist: function() {
		var playlistName = this.$('#playlist-name-input').val();
		this.collection.create({name: playlistName});
		this.$('#playlist-name-input').val('');
	},

	showPlaylistSongs: function() {
		var playlistId = $('#playlist-dropdown option:selected').data('playlist-id');
		var songsViewCollection = App.playlistSongsView.collection;
		songsViewCollection.url = '/playlists/' + playlistId + '/songs';
		songsViewCollection.fetch({reset: true});
	}
});