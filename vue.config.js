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
				appId: "fr.thestaticturtle.wisp_desktop",
				productName: "Wisp",
				win: {
					icon: "public/icons/icon.png"
				},
				nsis: {
					oneClick: false,
					createDesktopShortcut: true,
					createStartMenuShortcut: true,
					allowToChangeInstallationDirectory: true,
					installerIcon: "public/icons/icon.ico",
					license: "LICENSE"
				}
			}
		}
	}
}