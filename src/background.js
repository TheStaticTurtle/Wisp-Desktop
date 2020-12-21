'use strict'
import { app, protocol, BrowserWindow, ipcMain  } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const debugSequelize = require('debug')('wisp:sequelize')
const debugElectron = require('debug')('wisp:electron')

const isDevelopment = process.env.NODE_ENV !== 'production'

const path = require('path');
const fs = require('fs');
const os = require('os');

const Sequelize = require("sequelize");

const libraryPath = path.join(os.homedir(), "Music/Wisp/")
if (!fs.existsSync(libraryPath)) fs.mkdirSync(libraryPath);

const sequelize = new Sequelize({
	dialect: 'sqlite',
	//logging: (msg) => {debugSequelize(msg)},
	logging: false,
	storage: path.join(libraryPath,'WhisperBook.sqlite')
});
sequelize.authenticate()
	.then(() => { debugSequelize('Connection successfully made.'); })
	.catch(debugSequelize);

const db = {
	models: {
		Chapter: require("./db_models/Chapter.js")(sequelize, Sequelize.DataTypes),
		Book:    require("./db_models/Book.js")(sequelize, Sequelize.DataTypes),
		Library: require("./db_models/Library.js")(sequelize, Sequelize.DataTypes),
		Config:  require("./db_models/Config.js")(sequelize, Sequelize.DataTypes),
		HiddenFiles: require("./db_models/HiddenFiles.js")(sequelize, Sequelize.DataTypes),
	},
	sequelize: sequelize
}

const {Config} = require("./config")

const config = new Config(db);
(async () => {
	await sequelize.sync({ force: true })
	await config.init()

	require("./controllers/library").controller(db,config)
	require("./controllers/audio").controller(db,config)
	require("./controllers/config").controller(db,config)
})();



protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		show: isDevelopment,
		backgroundColor: '#252525',
		darkTheme: true,
		icon: path.join(__static, "icons/256x256.png"),
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			enableRemoteModule: true
		}
	})
	win.once('ready-to-show', async () => {
		win.show()
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app')
		win.loadURL('app://./index.html')
	}
}




app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		try {
			await installExtension(VUEJS_DEVTOOLS)
		} catch (e) {
			debugElectron('Vue Devtools failed to install:', e.toString())
		}
	}

	const protocolNameFS = 'safe-file-protocol'
	protocol.registerFileProtocol(protocolNameFS, (request, callback) => {
		const url = request.url.replace(`${protocolNameFS}://`, '')
		try {
			return callback(decodeURIComponent(url))
		}
		catch (error) {
			// Handle the error as needed
			debugElectron(error)
		}
	});

	createWindow()
})

if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}
