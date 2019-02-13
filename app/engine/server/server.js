var wsEqualizer = new WebSocket("ws://127.0.0.1:30002");
async function getNodes(){
    var wsNodes = new WebSocket("ws://127.0.0.1:30000");
    return new Promise(function(resolve,reject){
        wsNodes.onmessage = function (event) {
            resolve(event.data);
        };     
    });
};

async function getEdges(){
    var wsEdges = new WebSocket("ws://127.0.0.1:30001");
    return new Promise(function(resolve,reject){
        wsEdges.onmessage = function (event) {
            resolve(event.data);
        };       
    });
};

var equalizer = {}

wsEqualizer.onmessage = function (event) {
        equalizer = JSON.parse(event.data)
        console.log(equalizer)
};       

function setEqualizer(property,value){
    
    console.log(property+" "+value)
    return null;
};

function getEqualizer(name){
    return equalizer[name]
};


exports.getEqualizer = getEqualizer;
exports.getNodes = getNodes;
exports.getEdges = getEdges;
exports.setEqualizer = setEqualizer;