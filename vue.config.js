module.exports = {
	configureWebpack: {
		target: 'electron-renderer',
	},
	pluginOptions: {
		electronBuilder: {
			// List native deps here if they don't work
			externals: ['vue-electron'],
		}
	}
}