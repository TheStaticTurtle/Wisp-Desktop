var path = require('path');

module.exports = function(sequelize, DataTypes) {
	// Define resource
	var Book = sequelize.define('book', {
		name: {
			type: DataTypes.STRING
		},
		picture_url: {
			type: DataTypes.STRING
		},
	});

	Book.chapters = Book.hasMany(sequelize.models.chapter);


	return Book;
}