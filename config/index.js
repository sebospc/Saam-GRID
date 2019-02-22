var env = process.env.NODE_ENV || 'test';
const defaultPort = 3030;

var config = {
  development: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost",
    distributionFolder: 'generatedExecutableFolder',
    generatedBackendFiles: 'Matlab/DemoCooler2',//from matlab
    scriptsFolder: 'trayPy',
    executableMainName: 'middleConnect'
  },
  test: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost",
    distributionFolder: 'generatedExecutableFolder',
    generatedBackendFiles: 'Matlab/DemoCooler2',//from matlab
    scriptsFolder: 'trayPy',
    executableMainName: 'middleConnect'
  },
  production: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost",
    distributionFolder: 'generatedExecutableFolder',
    generatedBackendFiles: 'Matlab/DemoCooler2',//from matlab
    scriptsFolder: 'trayPy',
    executableMainName: 'middleConnect'
  }
};

module.exports = config[env];
