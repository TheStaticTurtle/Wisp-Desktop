var path = require('path');

module.exports = function(sequelize, DataTypes) {
	// Define resource
	var Chapter = sequelize.define('chapter', {
		chapter_no: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: false
		},
		chapter_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		chapter_artist: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		file_path: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
	});


	return Chapter;
}