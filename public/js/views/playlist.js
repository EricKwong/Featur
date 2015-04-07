App.Views.Playlist = Backbone.View.extend({
	initialize: function() {
		console.log('Created: Playlist View');
		this.allPlaylistTemplate = Handlebars.compile($('#playlist-dropdown-template').html());
		this.listenTo(this.collection, 'reset', this.render);
		this.listenTo(this.collection, 'add', this.render);
		var thisView = this; 
		this.collection.fetch({reset: true, success: function() {
			thisView.showPlaylistSongs();
		}});
	},

	el: '#playlist',

	events: {
		'click #create-playlist' : 'createPlaylist',
		'change #playlist-dropdown' : 'showPlaylistSongs',
		'click #expand-down' : 'showPlaylist',
		'click #collapse-up' : 'hidePlaylist'
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
		if (playlistName === "") {
			return
		};
		this.collection.create({name: playlistName});
		this.collection.fetch();
		this.$('#playlist-name-input').val('');
	},

	showPlaylistSongs: function() {
		var playlistId = this.$('#playlist-dropdown option:selected').data('playlist-id');
		App.playlistSongsView.showPlaylist(playlistId);
	},

	showPlaylist: function(clicked) {
		var expandTriangle = clicked.currentTarget;
		this.$('#listed-songs').show();
		$(expandTriangle).attr('id', 'collapse-up');
	},

	hidePlaylist: function(clicked) {
		var expandTriangle = clicked.currentTarget;
		this.$('#listed-songs').hide();
		$(expandTriangle).attr('id', 'expand-down');
	}
});