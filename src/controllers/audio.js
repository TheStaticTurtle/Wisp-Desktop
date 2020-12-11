const { ipcMain } = require('electron')
const md5 = require('md5');

let current_book = null
let current_chapter_index = 0

function findIndex(arr, cond) {
	let i, x;
	for (i in arr) {
		x = arr[i];
		if (cond(x)) return parseInt(i);
	}
}

function controller(db) {
	const t = this;

	ipcMain.on("player_read_new_book_request",function (event, arg) {
		current_book = arg
		if(current_book.chapters.length===0) return;

		event.sender.send("player_chapter_update", {
			book: current_book,
			chapter: current_book.chapters[current_chapter_index] !== undefined ? current_book.chapters[current_chapter_index] : null,
			next_chapter: current_book.chapters[current_chapter_index+1] !== undefined ? current_book.chapters[current_chapter_index+1] : null,
		})
	});

	ipcMain.on("player_read_new_chapter_request",function (event, arg) {
		db.models.Book.findOne({
			include: [{
				model: db.models.Chapter,
				as: 'chapters',
				where: { unique_hash: arg.unique_hash }
			}]
		}).then((tmp_book)=>{
			db.models.Book.findOne({
				where: { 'unique_hash': tmp_book.unique_hash },
				include: [{ model: db.models.Chapter, }]
			}).then((book)=> {
				// TODO: Check that book is actually present, should be if calld for ui tho
				// TODO: Find a better solution than nested queries.

				const safe_book = {
					unique_hash: book.unique_hash,
					name: book.name,
					picture_url: book.picture_url,
					border_color: book.border_color,
					chapters: book.chapters.map(chapter => {
						return {
							unique_hash: chapter.unique_hash,
							file_path: chapter.file_path,
							chapter_no: chapter.chapter_no,
							chapter_name: chapter.chapter_name,
							chapter_artist: chapter.chapter_artist,
						}
					}),
				}

				t.current_book = safe_book
				t.current_chapter_index = findIndex(t.current_book.chapters, (x) => {
					return x.unique_hash === arg.unique_hash
				})

				if (t.current_book.chapters.length === 0) return;
				event.sender.send("player_chapter_update", {
					book: t.current_book,
					chapter: t.current_book.chapters[t.current_chapter_index] !== undefined ? t.current_book.chapters[t.current_chapter_index] : null,
					next_chapter: t.current_book.chapters[t.current_chapter_index + 1] !== undefined ? t.current_book.chapters[t.current_chapter_index + 1] : null,
				});
			});
		})
	});

	ipcMain.on("player_control_request",function (event, arg) {
		if(current_book.chapters.length===0) return;

		switch (arg) {
			case "next":
				current_chapter_index += 2;
			// Fallthrough is normal here bit hacky
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