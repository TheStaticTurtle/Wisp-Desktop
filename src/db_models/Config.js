module.exports = function(sequelize, DataTypes) {
	// Define resource
	var Config = sequelize.define('config', {
		key: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		value: {
			type: DataTypes.JSON,
			unique: true
		},
	});

	return Config;
}