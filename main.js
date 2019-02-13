const electron = require('electron')
const exec = require("child_process").exec;
const { app, BrowserWindow } = electron
const path = require('path')
const url = require('url')
const os = require('os');
const spawn = require('child_process').spawn;

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

    });
}
app.on('ready', createWindow)

