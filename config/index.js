var env = process.env.NODE_ENV || 'test';
const defaultPort = 3000;

var config = {
  development: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://saam-grid.tk"
  },
  test: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://saam-grid.tk",
    env: env
  },
  production: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://saam-grid.tk"
  }
};

module.exports = config[env];
