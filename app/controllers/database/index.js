const PouchDB = require('pouchdb');
var db = new PouchDB('users');

//insert if doesn't exist
function insert(){

}

module.exports = {
    db
}