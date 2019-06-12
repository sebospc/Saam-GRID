
const config = require('../../../config');


if(localStorage.getItem("server") == undefined){
    localStorage.setItem("server",config.directionBack);
}



function defaultRequest(typeRequest, methodName, headers, body, callback) {
    var url = localStorage.getItem("server");
    
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
    http.send(JSON.stringify(body))
}

function xhrOwn(methodRequest, methodName, headers, values) {
    return new Promise(resolve => {
        defaultRequest(methodRequest, methodName, headers, values, http => resolve(http.response))
    });
}
module.exports = xhrOwn