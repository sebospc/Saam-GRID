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

    win = new BrowserWindow({ show: false, frame: false })

    win.loadURL(url.format({
        pathname: path.join(__dirname, './app/engine/login/login.html'),
        protocol: 'file',
        webPreferences: {
            devTools: true
        }
    }))
    win.maximize();

    win.on('close', function () { //   <---- Catch close event
        app.quit();
    });

    process.on("SIGINT", function () {
        app.quit();
    });
    app.on('before-quit', () => {

        var request = require('request');

        request(config.directionBack + ":" + config.port + "/exit", function (error, response, body) {
            //console.log('error:', error); // Print the error if one occurred 
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            //console.log('body:', body); // Print the HTML for the Google homepage.

        });
        win = null;

    });
    win.once('ready-to-show', () => win.show)

    //autoUpdater.checkForUpdates();
}

ipcMain.on('close-me', (evt, arg) => {
    app.quit()
})

const guessPackaged = () => {
    const fullPath = path.join(__dirname, PY_DIST_FOLDER)
    return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
    if (!guessPackaged()) {
        return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
    }
    if (process.platform === 'win32') {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
    }
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const createPyProc = () => {

    let script = getScriptPath()
    let port = config.port;

    if (guessPackaged()) {
        serverProcess = require('child_process').execFile(script, [port, path.join(__dirname, config.genratedBackendFiles)],
            (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log(stdout);
                app.quit();
            })
    } else {
        serverProcess = require('child_process').spawn('python', [script, port, path.join(__dirname, config.generatedBackendFiles)])
        serverProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            app.quit();
        });
        serverProcess.stdout.on('data', function (data) {
            //console.log('stdout: ' + data);
            //Here is where the output goes
        });
        serverProcess.stderr.on('data', function (data) {
            //console.log('stderr: ' + data);
            //Here is where the error output goes
        });
    }

    if (serverProcess != null) {
        //console.log(pyProc)
        console.log('child process success on port ' + port)
        return port;
    } else {
        return null;
    }

}




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

if (createPyProc() == null) {
    console.log("error creating process");
} else {
    global.sharedObj = { url: config.directionBack + ":" + config.port };
}

controlVal = true;
function checkServerStatus() {

    portscanner.checkPortStatus(config.port, 'localhost', passWin)
    if (!controlVal) return;


}
function passWin(error, status) {
    if (status == 'open') {
        console.log("se abrio")
        controlVal = false;
        createWindow();
        return;
    } else {
        setTimeout(checkServerStatus, 200);
    }
}

app.on('ready', checkServerStatus)




