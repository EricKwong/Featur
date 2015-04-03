"use strict";
module.exports = function(sequelize, DataTypes) {
  var songs = sequelize.define("songs", {
    trackName: DataTypes.STRING,
    trackId: DataTypes.STRING,
    trackUri: DataTypes.STRING
  }, {

    timestamps: false,
    
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return songs;
};