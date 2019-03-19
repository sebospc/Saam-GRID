const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const config = require('./config');
const { ipcMain } = require('electron');
const PY_DIST_FOLDER = config.distributionFolder;
const PY_FOLDER = config.scriptsFolder;
const PY_MODULE = config.executableMainName;// without .py suffix
const portscanner = require('portscanner');

var serverProcess = null;


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';





//setTimeout(loopPos, 2000);


let win
function createWindow() {

    win = new BrowserWindow({frame: false,
        webPreferences: {
            webSecurity: false
        } })
    app.commandLine.appendSwitch('ignore-certificate-errors');
    win.loadURL(url.format({
        pathname: path.join(__dirname, './app/engine/login/login.html'),
        protocol: 'file',
        webPreferences: {
            devTools: true
        }
    }))
    win.maximize();
    
    win.once('ready-to-show', () => win.show)

    //autoUpdater.checkForUpdates();
}


ipcMain.on('close-me', (evt, arg) => {
    app.quit()
})

function sendStatusToWindow(text) {
    log.info(text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});


app.on('ready',createWindow)




