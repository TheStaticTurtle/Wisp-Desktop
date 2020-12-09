'use strict'
import { app, protocol, BrowserWindow, ipcMain  } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const AudioPlayer = require("./controllers/AudioPlayer").AudioPlayer

const isDevelopment = process.env.NODE_ENV !== 'production'

const audio = new AudioPlayer();

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
    Chapter: require("./db_models/Chapter.js")(sequelize, Sequelize.DataTypes),
    Book:    require("./db_models/Book.js")(sequelize, Sequelize.DataTypes),
    Library: require("./db_models/Library.js")(sequelize, Sequelize.DataTypes),
  },
  sequelize: sequelize
}

sequelize.sync({ force: true })


require("./controllers/player").controller(db,audio)

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true, //process.env.ELECTRON_NODE_INTEGRATION
      webSecurity: false, //Allow file loading via file://
    }
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
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  const protocolName = 'safe-file-protocol'
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '')
    try {
      return callback(decodeURIComponent(url))
    }
    catch (error) {
      // Handle the error as needed
      console.error(error)
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
