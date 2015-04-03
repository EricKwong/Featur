"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("songs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      trackName: {
        type: DataTypes.STRING
      },
      trackId: {
        type: DataTypes.STRING
      },
      trackUri: {
        type: DataTypes.STRING
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("songs").done(done);
  }
};