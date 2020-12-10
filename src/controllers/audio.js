const { ipcMain } = require('electron')
const md5 = require('md5');

let current_book = null
let current_chapter_index = 0

function controller(db) {

	ipcMain.on("player_read_new_book_request",function (event, arg) {
		current_book = arg
		if(current_book.chapters.length===0) return;

		event.sender.send("player_chapter_update", {
			book: current_book,
			chapter: current_book.chapters[current_chapter_index] !== undefined ? current_book.chapters[current_chapter_index] : null,
			next_chapter: current_book.chapters[current_chapter_index+1] !== undefined ? current_book.chapters[current_chapter_index+1] : null,
		})
	});

	ipcMain.on("player_control_request",function (event, arg) {
		if(current_book.chapters.length===0) return;

		switch (arg) {
			case "next":
				current_chapter_index += 2;
			// Fallthrough is normal here bit hack
			case "previous":
				current_chapter_index -= 1;

				current_chapter_index = Math.min(Math.max(current_chapter_index,0),current_book.chapters.length-1)
				event.sender.send("player_chapter_update", {
					book: current_book,
					chapter: current_book.chapters[current_chapter_index] !== undefined ? current_book.chapters[current_chapter_index] : null,
					next_chapter: current_book.chapters[current_chapter_index+1] !== undefined ? current_book.chapters[current_chapter_index+1] : null,
				})
				break;
			default:
				console.log("[ipc] player_control_request: uknown command: "+arg)
				break;
		}

	});

}

module.exports = {
	controller: controller
}