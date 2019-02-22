const sharedObj = require('electron').remote.getGlobal('sharedObj');

const url = sharedObj.url;

function defaultRequest(typeRequest, methodName, headers, values, callback) {
    var http = new XMLHttpRequest();
    http.responseType = 'json';
    http.open(typeRequest, url + methodName, true);
    http.setRequestHeader("Content-type", "application/json"); //default
    for (let key in headers) {
        http.setRequestHeader(key, headers[key])
    }
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            callback(http);
        }
    }
    http.send(JSON.stringify(values))
}

function xhrOwn(methodRequest, methodName, headers, values) {
    return new Promise(resolve => {
        defaultRequest(methodRequest, methodName, headers, values, http => resolve(http.response))
    });
}
module.exports = xhrOwn