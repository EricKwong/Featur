"use strict";
module.exports = function(sequelize, DataTypes) {
  var playlists = sequelize.define("playlists", {
    name: DataTypes.STRING
  }, {

    timestamps: false,
    
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return playlists;
};