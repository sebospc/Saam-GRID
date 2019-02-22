const requestCall = require("../../controllers/request");
const { ipcRenderer } = require('electron');

let toggleNavStatus = false;
//nombre ,model{name,equalizerStatus:{}}
let toggleNav = function () {
  let getSidebar = document.querySelector(".nav-sidebar");
  let getSidebarUl = document.querySelector(".nav-sidebar ul");
  let getSidebarTitle = document.querySelector(".nav-sidebar span");
  let getSidebarLink = document.querySelectorAll(".nav-sidebar a");

  // Check if sidebar is closed
  if (toggleNavStatus === false) {
    getSidebarUl.style.visibility = "visible";
    getSidebar.style.width = "272px";
    getSidebarTitle.style.opacity = "0.5";

    let arrayLength = getSidebarLink.length;
    for (let i = 0; i < arrayLength; i++) {
      getSidebarLink[i].style.opacity = "1";
    }

    toggleNavStatus = true;

  } else if (toggleNavStatus === true) {
    getSidebar.style.width = "0px";
    getSidebarTitle.style.opacity = "0";

    let arrayLength = getSidebarLink.length;
    for (let i = 0; i < arrayLength; i++) {
      getSidebarLink[i].style.opacity = "0";
    }

    getSidebarUl.style.visibility = "hidden";
    toggleNavStatus = false;

  }
}

let addModificators = function () {
  var collaborator;
  swal({
    title: 'Write collaborator name',
    text: "Remember, collaborators can't be removed later, and their name have no white spaces",
    input: 'text',
    inputValue: "",
    showCancelButton: true,
    inputValidator: (value) => {
      collaborator = value;
      return !value && 'You need to write something!'
    }
  }).then((result) => {
    if (result.value) {


      if (collaborator != undefined || collaborator != "" || /\s/.test(collaborator) && result.value) {
        collaborators.push(collaborator);
      }
    }
  })
}


let aboutUs = function () {
  swal({

    title: 'Project made by : ',
    html: "David Rios, Julian Sanchez, Sebastian Ospina and Esteban Echavarría <br />  Integrator Project I  <br />EAFIT University 2018-2",
    width: 600,
    padding: '3em',
    background: ' rgba(255,255,255,0.9)',
    backdrop: `
      rgba(0,0,123,0.4)
      url("../../../resources/images/giphy.gif")
      center center
      repeat
    `
  })
}


let undo = function () {
  //server.undo();
  swal(
    'Undo successfull',
    'Equalizer was returned to previous values',
    'success')
}
let redo = function () {
  //server.undo();
  swal(
    'Undo successfull',
    'Equalizer was returned to previous values',
    'success')
}

let exitOfModel = function () {
  swal({
    title: 'Are you sure?',
    text: "You may want to change something else",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, exit!'
  }).then((result) => {
    if (result.value) {
      swal(
        'Good Bye!',
        'We hope you will come back soon.',
      ).then(async (result) => {
        await requestCall('GET', '/exit', {}, {})
        ipcRenderer.send('close-me')
      })
    }
  })

}

let logOut = function () {
  swal({
    title: 'Are you sure?',
    text: "You may want to change something else",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, back to login!'
  }).then((result) => {
    if (result.value) {
      window.location.replace("../login/login.html")
    }
  })


}

let getInfo = function () {

}
  
