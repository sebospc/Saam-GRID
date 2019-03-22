var env = process.env.NODE_ENV || 'test';
const defaultPort = 3000;

var config = {
  development: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost"
  },
  test: {
    port: process.env.PORT || defaultPort,
    directionBack: "https://sospin26.dis.eafit.edu.co",
    env: env
  },
  production: {
    port: process.env.PORT || defaultPort,
    directionBack: "http://localhost"
  }
};

module.exports = config[env];
