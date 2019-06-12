const requestCall = require("../../controllers/request");
let logBool = false;
var serverText = document.getElementById("server");
serverText.placeholder = "Server: "+localStorage.getItem("server");
let login = async function () {
    
    //if (document.getElementById("inputName").value.length === 0 || document.getElementById("inputUser").value.length === 0 ||
    //    /\s/.test(document.getElementById("inputName").value) || /\s/.test(document.getElementById("inputUser").value)) {
    //    swal({
    //        title: 'Error!',
    //        text: "Modelers name and username must have at least 1 character and no white spaces",
    //        type: 'error',
    //        confirmButtonText: "I'm on it!"
    //    })
    //} else {
    //    logBool = true;
    //    window.location.replace('../main/main.html?name=' + document.getElementById("inputName").value + "&user=" + document.getElementById("inputUser").value);
    //}
    
    await requestCall( 'POST', '/login',{}, {username: document.getElementById("inputUser").value} );
    localStorage.setItem("username",document.getElementById("inputUser").value);
    window.location.replace('../main/main.html');

}

let changeServerLogin = function(){
    if(serverText.value != "")
        localStorage.setItem("server", (serverText.value));
        serverText.placeholder = "Server: "+localStorage.getItem("server");
}

window.onkeypress = function (event) {
    if (event.key === 'Enter') {
        if (logBool === false) {
            console.log("enter")
            login();
            return false;
        } else {
            window.location.replace('../main/main.html' );
        }
    }
}




