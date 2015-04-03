"use strict";
module.exports = function(sequelize, DataTypes) {
  var playlists = sequelize.define("playlists", {
    name: DataTypes.STRING
  }, {

    timestamps: false,
    
    classMethods: {
      associate: function(models) {
        playlists.belongsToMany(models.songs, {
          through: 'playlists_songs',
          foreignKey: 'playlistsId'
        });
      }
    }
  });
  return playlists;
};