'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
    img: DataTypes.STRING,
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
		models.Post.hasMany(models.User);
  };
  return Post;
};
