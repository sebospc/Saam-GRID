

const swal = require("sweetalert2");

var collaborators  = [];
var userName = getQueryVariable("user");
var name = getQueryVariable("name");
var modelName = "Cooler";

var names = {}

function saveModel() {
    
}
  

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
