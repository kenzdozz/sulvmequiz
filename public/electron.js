const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const url = require('url');
const path = require('path')
const isDev = require("electron-is-dev");

let mainWindow

if(!isDev) require('./server/app');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '/../build/public/img/logo.png'),
    backgroundColor: '#312450',
    show: false
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.setMenu(null);

  mainWindow.loadURL(
    "http://localhost:3030/index.html"
  );

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});
