
const server = require("../server/server.js");
const swal = require("sweetalert2");

var collaborators  = [];
var userName = getQueryVariable("user");
var name = getQueryVariable("name");
var modelName = "Cooler";

var names = {}

function saveModel() {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url,{useNewUrlParser: true} ,function (err, db) {
      if (err) {
        swal({
          title: 'Error!',
          text: "There was an error saving the model, please verify you have MongoDB installed",
          type: 'error',
          confirmButtonText: "I'm on it!"
        })
        throw err;
      }
      var dbo = db.db("saamdb");
      dbo.collection("responsables").updateOne(
        { usuario: userName },
        { $set: {model: { nombreModelo: modelName ,equalizerLastChange: names } } },
        { 'upsert': true },
        function (err, res) {
          if (err) {
            swal({
              title: 'Error!',
              text: "There was an error saving the model, please verify you have MongoDB installed",
              type: 'error',
              confirmButtonText: "I'm on it!"
            })
            throw err;
          }
          swal(
            'Insertion successfull',
            '1 Document has been inserted into DataBase',
            'success'
          )
          db.close();
        });
    });
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
