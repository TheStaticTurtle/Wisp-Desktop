module.exports = function(sequelize, DataTypes) {
	// Define resource
	var Config = sequelize.define('config', {
		key: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		value: {
			type: DataTypes.STRING,
			unique: true
		},
	});

	return Config;
}