module.exports = {
	configureWebpack: {
		target: 'electron-renderer',
		externals: {
			sqlite3: 'commonjs sqlite3',
		},
	},
	pluginOptions: {
		electronBuilder: {
			// List native deps here if they don't work
			externals: ['vue-electron','sequelize','sqlite3'],
			files: [
				"**/*"
			],
			builderOptions: {
				win: {
					icon: "public/icons/icon.png"
				},
				nsis: {
					oneClick: false,
					installerIcon : "public/icons/icon.ico",
				}
			}
		}
	}
}