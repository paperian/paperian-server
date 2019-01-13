'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
			type: DataTypes.STRING(40),
			unique: true,
		},
    nick: { 
			type: DataTypes.STRING,
			allowNull: false,
		},
    password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
    provider: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'local',
		},
    snsId: DataTypes.STRING,
		profileImage: {
			type: DataTypes.STRING,
		}
  }, {
		/* how to put paranoid option using migrations? 
		 is that a sequelize's function?*/
  });
  User.associate = function(models) {
		// associations can be defined here
		models.User.hasMany(models.Post);
  };
  return User;
};
