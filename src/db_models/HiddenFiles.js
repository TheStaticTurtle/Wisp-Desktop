var path = require('path');

module.exports = function(sequelize, DataTypes) {
	// Define resource
	var HiddenFiles = sequelize.define('hidden_files', {
		path: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
	});

	return HiddenFiles;
}