"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
  	migration.createTable("playlists_songs", {
  		playlistsId: {
  			type: DataTypes.INTEGER
  		},

  		songsId: {
  			type: DataTypes.INTEGER
  		}
  	}).done(done);
  },

  down: function(migration, DataTypes, done) {
  	migration.dropTable("playlists_songs").done(done);
  }
};
