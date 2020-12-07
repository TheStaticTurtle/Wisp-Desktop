const { dialog, ipcMain } = require('electron')
const path = require('path');
const glob = require("glob");
const fs = require('fs');
const mm = require('music-metadata');

/*
const walk = function(dir, done) {
	let results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		let i = 0;
		(function next() {
			let file = list[i++];
			if (!file) return done(null, results);
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})();
	});
};*/

function globPromise (dir, asObject = false) {
	return new Promise ((resolve, reject) => {
		glob(path.resolve(`${dir}/**/*`), {strict: false, silent: true, nodir: true}, (err, files) => {
			if (err) {
				reject(err);
			} else {
				if (asObject) {
					let filesObject = files.map(file => {
						let regexp = /^(.*[\\\/])(.*)$/;
						let match = regexp.exec(file);
						return {
							fullpath: file,
							filepath: match[1],
							filename: match[2],
							dirname: regexp.exec(match[1].substring(0, match[1].length -1))[2],
						};
					})
					resolve(filesObject);
				} else {
					resolve(files);
				}
			}
		})
	})
}


function resyncLibraries(db, event) {

	return new Promise(function(resolve, reject) {

		db.models.Library.findAll().then(async (results)=> {
			event.sender.send("library_load", "start");

			let books = {}

			for (const result of results) {

				const walk_results = await globPromise(result.path);

				for (let i = 0; i < walk_results.length; i++) {
					const file_data = await mm.parseFile(walk_results[i])

					if(file_data.common.album === null) file_data.common.album = "Unknown book"

					if(!books.hasOwnProperty(file_data.common.album)) {
						books[file_data.common.album] = {
							name: file_data.common.album,
							picture: null,
							chapters: [],
						}
					}

					books[file_data.common.album].picture = file_data.common.picture !== null && file_data.common.hasOwnProperty("picture") ? (file_data.common.picture instanceof Object ? file_data.common.picture : file_data.common.picture[0]) : null;

					books[file_data.common.album].chapters.push({
						file_path: walk_results[i],
						chapter_no: file_data.common.track.no,
						chapter_name: file_data.common.title,
						chapter_artist: file_data.common.artist
					})

					event.sender.send("library_load_text", "Parsing file "+i+" out of "+walk_results.length);
				}
			}



			const books_organized = []
			for (const booksKey in books) books_organized.push(books[booksKey])
			for (let i = 0; i < books_organized.length; i++) books_organized[i].chapters.sort(function (a, b) { return a.chapter_no - b.chapter_no; });


			console.log(books_organized[0].picture)

			await db.models.Chapter.destroy({
				truncate: true
			});
			await db.models.Book.destroy({
				truncate: true
			});

			console.log(books_organized)



			for (let i = 0; i < books_organized.length; i++) {
				let b = books_organized[i]
				b.picture_url = b.picture === null ? "assets/no_picture.png" : "data:"+b.picture[0].format+";base64,"+b.picture[0].data.toString('base64');
				db.models.Book.create(b, {
					include: [ db.models.Book.chapters ]
				});
				event.sender.send("library_load_text", "Saving book "+i+" out of "+books_organized.length);
			}

			event.sender.send("library_load", "stop");

			event.sender.send("library_update", books_organized);
			resolve();
		}).catch(reject);

	})

}

function controller(db) {
	ipcMain.on("add_new_library",function (event, arg) {

		dialog.showOpenDialog({properties: ['openDirectory']}).then(r => {
			if(r.canceled === true) return;
			if(r.filePaths.length !== 1) return;

			event.sender.send("loading", "loading");

			db.models.Library.sync().then(() => {
				db.models.Library.create({
					path: r.filePaths[0],
				}).then(function () {
					event.sender.send("end_loading", "Starting to sync the new library");
					resyncLibraries(db, event).then(function () {
						event.sender.send("end_loading", "Sync finished");
					}).catch(function (err) {
						event.sender.send("end_loading", "Error while syncing");
					})
				}).catch(function () {
					event.sender.send("end_loading", "This library already exist. It will resync it tho");
					resyncLibraries(db, event).then(function () {
						event.sender.send("end_loading", "Sync finished");
					}).catch(function (err) {
						event.sender.send("end_loading", "Error while syncing");
					})
				});
			});

		})
	});
}

module.exports = {
	controller: controller
}