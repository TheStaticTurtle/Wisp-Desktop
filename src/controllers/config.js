const { ipcMain } = require('electron')

function controller(db, config) {
	ipcMain.on("config_get",function (event, arg) {
		event.sender.send("config_update", config.get_all_mapped());
	});

	ipcMain.on("config_set",async function (event, arg) {
		await config.set(arg.key, arg.value)
		event.sender.send("config_update", config.get_all_mapped());
	});

	ipcMain.on("player_update",async function (event, arg) {
		await config.set("status_playing", arg.playing)
		await config.set("status_book_unique_hash", arg.book.unique_hash)
		await config.set("status_chapter_unique_hash", arg.chapter.unique_hash)
		await config.set("status_current_file_position", arg.current_file_position)

		await config.set("player_current_volume", arg.current_volume)
		await config.set("player_current_speed", arg.current_speed)
	});
}

module.exports = {
	controller: controller
}