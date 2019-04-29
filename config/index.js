var env = process.env.NODE_ENV || 'test';
const defaultPort = 3000;

var config = {
  development: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost:3000"
  },
  test: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost:3000",
    env: env
  },
  production: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost:3000"
  }
};

module.exports = config[env];
