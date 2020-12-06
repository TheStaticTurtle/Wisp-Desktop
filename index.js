'use strict';
const { app, BrowserWindow, dialog, ipcMain  } = require('electron')

const firstStartupController = require("./controllers/first_startup")
const playerController = require("./controllers/player")

const fs = require('fs');
const path = require('path');
const os = require('os');
const Sequelize = require("sequelize");


const libraryPath = path.join(os.homedir(), "Music/WhisperBook/")
if (!fs.existsSync(libraryPath)) fs.mkdirSync(libraryPath);

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(libraryPath,'WhisperBook.sqlite')
});
sequelize.authenticate()
	.then(() => { console.log('Connection successfully made.'); })
	.catch(console.error);

const db = {
	models: {
		Library: require(path.join(__dirname, "./db_models/Library.js"))(sequelize, Sequelize.DataTypes),
		Book: require(path.join(__dirname, "./db_models/Book.js"))(sequelize, Sequelize.DataTypes)
	},
	sequelize: sequelize
}


/*
db.models.Book.sync().then(() => {
	return db.models.Book.create({
		name: 'Test 001',
	});
});
db.models.Book.findAll().then(products => {
	console.log(products)
})*/

function create_first_load_window() {
	const main_window = new BrowserWindow({
		width: 1600,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		}
	});

	main_window.webContents.openDevTools();
	main_window.loadFile('views/player.html');
	return main_window
}


app.on('ready', function () {
	const win = create_first_load_window()
	//firstStartupController.controller(win, db)
	playerController.controller(win, db)
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

/*
app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		create_first_load_window()
	}
})
*/