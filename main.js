const electron = require('electron');
const exec = require("child_process").exec;
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const os = require('os');
const spawn = require('child_process').spawn;
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let win
function createWindow() {



    //var subpy = exec.spawn('python', ['./server/Server.py']);
    serverProcess = exec('python ./server/Server.py',
        function (error, stdout, stderr) {                    //callback function, receives script output            
            console.log(error);

        }
    )
    win = new BrowserWindow({ show: false, frame: false })

    win.loadURL(url.format({
        pathname: path.join(__dirname, './app/engine/login/login.html'),
        protocol: 'file',
        webPreferences: {
            devTools: true
        }
    }))
    win.maximize();
    win.once('ready-to-show', () => win.show)
    win.on('close', function () { //   <---- Catch close event

        if (os.platform() === 'win32') {
            spawn("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
        } else {
            serverProcess.kill('SIGTERM');
        }

        win = null;

    });
    autoUpdater.checkForUpdates();
}

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    console.log("checking for update")
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


app.on('ready', createWindow)

