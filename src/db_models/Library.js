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

	//var Chapter = sequelize.import(path.join(__dirname, 'course'));
	//Book.hasMany(Chapter);

	return Library;
}