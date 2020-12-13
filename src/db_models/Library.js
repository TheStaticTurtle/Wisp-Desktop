var path = require('path');

module.exports = function(sequelize, DataTypes) {
	// Define resource
	var Library = sequelize.define('library', {
		path: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
	});

	Library.books = Library.hasMany(sequelize.models.book);

	return Library;
}