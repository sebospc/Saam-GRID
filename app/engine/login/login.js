const swal = require("sweetalert2");


let logBool = false;
let login = function () {
    
    if (document.getElementById("inputName").value.length === 0 || document.getElementById("inputUser").value.length === 0 ||
        /\s/.test(document.getElementById("inputName").value) || /\s/.test(document.getElementById("inputUser").value)) {
        swal({
            title: 'Error!',
            text: "Modelers name and username must have at least 1 character and no white spaces",
            type: 'error',
            confirmButtonText: "I'm on it!"
        })
    } else {
        logBool = true;
        window.location.replace('../main/main.html?name=' + document.getElementById("inputName").value + "&user=" + document.getElementById("inputUser").value);
    }

}

window.onkeypress = function (event) {
    if (event.key === 'Enter') {
        if (logBool === false) {
            login();
            return false;
        } else {
            window.location.replace('../main/main.html?name=' + document.getElementById("inputName").value + "&user=" + document.getElementById("inputUser").value);
        }
    }
}






