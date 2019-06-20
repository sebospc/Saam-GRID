const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const { autoUpdater } = require("electron-updater");
const { ipcMain } = require('electron');







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
    win.setFullScreen(true)
    
    win.once('ready-to-show', () => win.show)


    //if(config.env != 'test')
        //autoUpdater.checkForUpdates();
}


ipcMain.on('close-me', (evt, arg) => {
    app.quit()
})


app.on('ready',createWindow)




