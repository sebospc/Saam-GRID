const swal = require("sweetalert2");
let logBool = false;
let login =  function(){
    if(document.getElementById("inputName").value.length === 0 || document.getElementById("inputUser").value.length === 0 || 
    /\s/.test(document.getElementById("inputName").value) || /\s/.test(document.getElementById("inputUser").value)){
        swal({
            title: 'Error!',
            text: "Modelers name and username must have at least 1 character and no white spaces",
            type: 'error',
            confirmButtonText: "I'm on it!"
          })
    }else{
  
        loadMongo(document.getElementById("inputUser").value,document.getElementById("inputName").value)
        logBool = true;
        swal(
            'Welcome ' +document.getElementById("inputName").value+'!',
            'Opening model...',
            'success'
          ).then((result) => {
            if (result.value) {
                window.location.replace('../main/main.html?name='+document.getElementById("inputName").value+"&user="+ document.getElementById("inputUser").value)
                
            }   
          })
    }
   
}

window.onkeypress = function(event){
    if(event.keyCode === 13){
        if(logBool === false){
            login();
            return false;    
        }else{
            window.location.replace('../main/main.html?name='+document.getElementById("inputName").value+"&user="+ document.getElementById("inputUser").value);
        }
    }
}

function loadMongo(username,name){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err){throw err; }
        var dbo = db.db("saamdb");
        dbo.collection("responsables").updateOne(
            {usuario: username},
            {$setOnInsert:{ usuario: username, name : name, collaborators:[] ,model: {nombreModelo:"Cooler"}}}, 
            {'upsert':true},
            function(err, res) {
                if (err){            
                      throw err;            
                } 
                
                db.close();
        });
        });
}


           
              


        