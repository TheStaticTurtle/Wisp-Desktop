const { dialog, ipcMain } = require('electron')
const path = require('path');
const glob = require("glob");
const fs = require('fs');
const mm = require('music-metadata');
const dataurl = require('dataurl');
const md5 = require('md5');
const pathEqual = require("path-equal").pathEqual

const ALLOWED_EXTS = [".wav",".mp3",".ogg",".webm",".flac",".aac"];

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

function resyncLibraries(db, event, what_lib) {
	return new Promise(async function(resolve, reject) {
		const path_to_resync = what_lib === null ? null : (what_lib instanceof Object ? what_lib.path : what_lib)
		const search_promise = path_to_resync === undefined || path_to_resync === null ? db.models.Library.findAll() : db.models.Library.findAll({where: { path: path_to_resync }})

		let hidden_files = await getHiddenFiles(db,event)
		hidden_files = hidden_files.map(x => { return x.path })

		//Avoid spamming notifications for stupid reasons
		let notification_already_sent_for = []

		search_promise.then(async (libraries_results)=> {

			for (const libraries_result of libraries_results) {
				updateLoadingScreenText(event, "Deleting out-of-date data");

				//Remove existing entries for this library and re-search the unique ids
				await db.models.Book.destroy({ where: { libraryId: libraries_result.id } })
				let book_ids = (await db.models.Book.findAll()).map(x => {return x.unique_hash})
				let chapter_ids = (await db.models.Chapter.findAll()).map(x => {return x.unique_hash})

				let new_books = {}

				updateLoadingScreenText(event, "Listing files in " + libraries_result.path);
				let walk_results = await globPromise(libraries_result.path);

				walk_results = walk_results.filter(el => {
					for (const hidden_file of hidden_files) {
						if(pathEqual(hidden_file,el)) return false
					}
					return true
				})

				for (let i = 0; i < walk_results.length; i++) {
					let file_data = null;

					if (!ALLOWED_EXTS.includes(path.extname(walk_results[i]))) {
						console.log("Extention is not allowed for file: "+walk_results[i])
						continue;
					}

					try {
						file_data = await mm.parseFile(walk_results[i])
					} catch (e) {
						sendNotification(event,e,null);
						continue;
					}

					if (
						!file_data.common.hasOwnProperty("album") || file_data.common.album === "" || file_data.common.album === null ||
						!file_data.common.hasOwnProperty("title") || file_data.common.title === "" || file_data.common.title === null ||
						!file_data.common.hasOwnProperty("artist") || file_data.common.artist === "" || file_data.common.artist === null ||
						!file_data.common.track.hasOwnProperty("no")
					) {
						sendNotification(event,null,{
							type: "error",
							title: "Failed to parse a file:",
							text: walk_results[i] + " is missing on of those fileds in his tags: artist/album/title/track_no",
						});
						continue;
					}

					if(!new_books.hasOwnProperty(file_data.common.album)) {
						const unique_book_id = await md5(file_data.common.album)
						if(book_ids.includes(unique_book_id)) {
							if(!notification_already_sent_for.includes(unique_book_id)) sendNotification(event,null,{
								type: "warn",
								title:"Duplicate book found",
								text: "Found multiple entries for: "+file_data.common.album,
							});
							notification_already_sent_for.push(unique_book_id)
							continue
						}
						new_books[file_data.common.album] = {
							unique_hash: unique_book_id,
							name: file_data.common.album,
							picture: null,
							border_color: "#1f1f1f",
							chapters: [],
						}
					}

					const unique_chapter_id = await md5(file_data.common.album+"_"+file_data.common.title)
					if(chapter_ids.includes(unique_chapter_id)) {
						if(!notification_already_sent_for.includes(unique_chapter_id)) sendNotification(event,null,{
							type: "warn",
							title:"Duplicate chapter found",
							text: "Found multiple entries for: "+file_data.common.album+" / "+file_data.common.title,
							collapse_title: "Details:",
							collapse: "File path:" + walk_results[i]
						});
						notification_already_sent_for.push(unique_chapter_id)
						continue;
					}
					chapter_ids.push(unique_chapter_id)

					new_books[file_data.common.album].picture = file_data.common.picture !== null && file_data.common.hasOwnProperty("picture") ? (file_data.common.picture instanceof Object ? file_data.common.picture : file_data.common.picture[0]) : null;
					new_books[file_data.common.album].chapters.push({
						unique_hash: unique_chapter_id,
						file_path: walk_results[i],
						chapter_no: file_data.common.track.no,
						chapter_name: file_data.common.title,
						chapter_artist: file_data.common.artist,
						chapter_duration: file_data.format.duration ? file_data.format.duration : 0
					})

					updateLoadingScreenText(event, "Parsing file "+i+" out of "+walk_results.length);
				}


				const books_organized = []
				for (const booksKey in new_books) books_organized.push(new_books[booksKey])
				for (let i = 0; i < books_organized.length; i++) books_organized[i].chapters.sort(function (a, b) { return a.chapter_no - b.chapter_no; });


				for (let i = 0; i < books_organized.length; i++) {
					let b = books_organized[i]
					b.picture_url = b.picture === null ? "assets/no_picture.png" : "data:"+b.picture[0].format+";base64,"+b.picture[0].data.toString('base64');
					b.libraryId = libraries_result.id
					await db.models.Book.create(b, {
						include: [ db.models.Book.chapters ]
					}).catch((err)=>{
						sendNotification(event,err,null)
					});
					updateLoadingScreenText(event, "Saving book "+(i+1)+" out of "+books_organized.length);

				}
			}

			reloadLibraries(db, event).then((b)=>{
				resolve(b);
				console.log(b.map(x=>{return x.name}))
			})
		}).catch(reject);
	});
}
function reloadLibraries(db, event) {
	return new Promise(function(resolve, reject) {
		db.models.Book.findAll({ include: db.models.Chapter }).then(async (results)=> {

			// Remap it correctly
			results = results.map(book => {
				return {
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
							chapter_duration: chapter.chapter_duration,
						}
					}),
				}
			});

			for (let i = 0; i < results.length; i++) results[i].chapters.sort(function (a, b) { return a.chapter_no - b.chapter_no; });

			resolve(results);

		}).catch(reject);
	})
}
function getLibraries(db, event) {
	return new Promise(function(resolve, reject) {
		db.models.Library.findAll({ include: db.models.Book }).then(async (results)=> {

			// Remap it correctly
			results = results.map(lib => {
				return {
					id: lib.id,
					path: lib.path,
					books: lib.books,
				}
			});

			resolve(results);
		}).catch(reject);
	})
}

function getHiddenFiles(db, event) {
	return new Promise(function(resolve, reject) {
		db.models.HiddenFiles.findAll().then(async (results)=> {
			results = results.map(lib => {
				return {
					id: lib.id,
					path: lib.path,
				}
			});
			resolve(results);
		}).catch(reject);
	})
}
function addHiddenFiles(db, event ,paths) {
	return new Promise(function(resolve, reject) {
		let promiseArr = []
		for (const path of paths) {
			promiseArr.push(
				db.models.HiddenFiles.create({
					path: path,
				})
			)
			Promise.all(promiseArr).then(data => {
				getHiddenFiles(db,event).then(resolve).catch(reject)
			}).catch(reject)
		}
	});
}

function startLoadingScreen(event) {
	event.sender.send("loading");
}
function updateLoadingScreenText(event, txt) {
	event.sender.send("library_load_text", txt ? txt : "");
}
function endLoadingScreen(event, err, notification) {
	event.sender.send("end_loading");
	sendNotification(event,err,notification)
}
function sendNotification(event, err, notification) {
	if(err) {
		console.error(err)
		event.sender.send("ui_notify", {
			type: "error",
			title: "An unexpected error has occured:",
			text: "",
			collapse_title: "Stacktrace",
			collapse: err.stack || err.toString()
		});
	}
	if(notification) {
		event.sender.send("ui_notify",notification);
	}
}

function controller(db, config) {
	ipcMain.on("get_libraries",function (event, arg) {
		getLibraries(db, event).then(function (l) {
			event.sender.send("libraries_update", l);
		}).catch(function (err) {
			sendNotification(event,err,null);
		});
	});
	ipcMain.on("delete_library",async function (event, arg) {
		startLoadingScreen(event);
		await db.models.Library.destroy({ where: { path: arg.path } })

		getLibraries(db, event).then(function (l) {
			event.sender.send("libraries_update", l);

			//Null is used here cause if we have a duplicate it won't rescan it otherwise
			resyncLibraries(db, event, null).then(function (books) {
				endLoadingScreen(event,null,null);
			}).catch(function (err) {
				endLoadingScreen(event,err,null);
			});

		}).catch(function (err) {
			endLoadingScreen(event,err,null);
		});
	});

	ipcMain.on("force_reload",function (event, arg) {
		startLoadingScreen(event);
		reloadLibraries(db, event).then(function (books) {
			event.sender.send("library_update", books);
			endLoadingScreen(event)
		}).catch(function (err) {
			endLoadingScreen(event,err,null);
		});
	});
	ipcMain.on("force_resync",function (event, arg) {
		startLoadingScreen(event);
		resyncLibraries(db, event, arg).then(function (books) {
			event.sender.send("library_update", books);
			endLoadingScreen(event)
		}).catch(function (err) {
			endLoadingScreen(event,err,null);
		});
	});

	ipcMain.on("add_new_library",function (event, arg) {

		dialog.showOpenDialog({properties: ['openDirectory']}).then(r => {
			if(r.canceled === true) return;
			if(r.filePaths.length !== 1) return;

			startLoadingScreen(event);

			db.models.Library.sync().then(() => {
				db.models.Library.create({
					path: r.filePaths[0],
					books: []
				}).then(function (new_lib) {
					updateLoadingScreenText(event, "Starting to sync the new library");

					resyncLibraries(db, event, new_lib).then(function (books) {
						event.sender.send("library_update", books);
						endLoadingScreen(event)
					}).catch(function (err) {
						endLoadingScreen(event,err,null);
					})

					getLibraries(db, event).then(function (l) {
						event.sender.send("libraries_update", l);
					}).catch(function (err) {
						endLoadingScreen(event,err,null);
					});

				}).catch(function () {
					endLoadingScreen(event,null,{
						type: "warn",
						title:"This library already exist.",
						text: "You can go to the settings to reload it.",
					});
				});
			});

		})
	});

	ipcMain.on("get_hidden_files",function (event, arg) {
		getHiddenFiles(db, event).then(function (l) {
			event.sender.send("hidden_files_update", l);
		}).catch(function (err) {
			sendNotification(event,err,null);
		});
	});
	ipcMain.on("add_hidden_file",function (event, arg) {
		const f = arg instanceof Array ? arg : (arg instanceof Object ? [arg.path] : [arg])
		addHiddenFiles(db, event, f).then(function (new_hidden_files) {
			event.sender.send("hidden_files_update", new_hidden_files);

			startLoadingScreen(event);
			resyncLibraries(db, event, arg).then(function (books) {
				event.sender.send("library_update", books);
				endLoadingScreen(event)
			}).catch(function (err) {
				endLoadingScreen(event,err,null);
			});

		}).catch(function (err) {
			sendNotification(event,err,null);
		});
	});
}

module.exports = {
	controller: controller
}