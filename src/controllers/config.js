const { ipcMain } = require('electron')

function controller(db, config) {
	ipcMain.on("config_get",function (event, arg) {
		event.sender.send("config_update", config.get_all_mapped());
	});

	ipcMain.on("config_set",async function (event, arg) {
		await config.set(arg.key, arg.value)
		event.sender.send("config_update", config.get_all_mapped());
	});
}

module.exports = {
	controller: controller
}