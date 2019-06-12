

var modal = document.getElementById('simpleModal');
var slider = document.getElementById("rangeSlider");
var output = document.getElementById("rangeLine");
var setBttn = document.getElementById("setBttn");
var getEqBttn = document.getElementById("getEqBttn");
var expected = document.getElementById("expected");
var eqName = document.getElementById('actualChar');
var actualVal = document.getElementById('actual');
var lineSVG = document.getElementById('svgSliderLine');
var pixX;
var gap;
var start;
var end;
var maxLineRangex;
var minLineRangex;
gap = (screen.width/2 * 0.382) * 0.023
output.setAttributeNS(null, "y1", 0)
output.setAttributeNS(null, "y2", 1200)
pixX = ((screen.width * 0.382) - gap) / 100
output.setAttributeNS(null, "x1", 0 )
output.setAttributeNS(null, "x2", 0 )
// Listen for outside click
window.addEventListener('click', outsideClick);





// Function to open modal
async function openModal(name) {
    
    var aux = await requestCall( 'GET', '/getEqualiser',{"username": localStorage.getItem("username"),"folder": actualModel}, {} );
    var names = aux["values"];
    if(newEq){
        eqValues = names;
        console.log("reset names")
        newEq = false;
    }
    var auxData = aux[name];
    
    if (auxData == null) {
        modal.style.display = 'none';
        return false;
    }
    

    document.getElementById('actualChar').innerText = name;
    var data = transpose(auxData)
    end = data[0][0]
    start = data[0][data[0].length - 1]
    var range = (end - start).toFixed(2);
    var fixArr = []
    for (i = 0; i < data.length; i++) {
        fixArr[i] = start;
    }
    var actualValue = eqValues[name];
    
    data.splice(0, 1);
    //for names 
    keys = Object.keys(data)

    const chroma = require("chroma-js")
    var bez = chroma.scale(['black', 'red', 'yellow', 'yellowgreen', 'green']).classes(15);
    var arr = new Array(data[keys[0]].length);
    
    var color = new Array(data[keys[0]].length);

    for (j = 0; j < arr.length; j++) {
        arr[j] = new Array()
        color[j] = new Array()
    }

    keys.forEach(function (key, index) {
        var length = data[key].length
        var val = range / length

        for (i = 0; i < length; i++) {
            arr[i][index] = val
            auxC = bez(data[key][i]).hex().toString()
            color[length - 1 - i][index] = auxC
        }
    });

    var dataSets = [];
    for (j = 0; j < arr.length; j++) {
        dataSets[j] = { "data": arr[j], "backgroundColor": color[j], "borderWitdth": 1 }
    }
    dataSets.unshift({ "data": fixArr, "backgroundColor": color[0], "borderWitdth": 1 })
    modal.style.display = 'block';
    makeGraph(keysArr, dataSets, start, end);
    max = 0;
    for(i = 0; i < keysArr.length; i++){
        if(keysArr[i].length > max){
            max = keysArr[i].length
        }
    }
    
    offset = 50*max/11 + 5;
    
    slider.style.width = "calc(100%)";
    maxLineRangex = slider.offsetWidth;
    slider.style.width = "calc(100% - "+offset+"px)";
    
    minLineRangex = maxLineRangex - slider.offsetWidth+gap*2+gap/2;
    maxLineRangex = maxLineRangex- gap/2 ;
    console.log("max: "+maxLineRangex);
    console.log("min: "+minLineRangex);
    slider.style.marginLeft = (offset)+gap+'px';
    console.log("max: "+max);
    console.log("offset: "+offset)
    setSliderOnce(actualValue)
    
    
    return true;
}

// Function to close modal if outside click
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) { return r[c]; });
    });
}





slider.oninput = function () {
    
    
    actualVal.innerText = mapRange([0, 100], [start, end], this.value);
    var lineX = mapRange( [0, 100], [minLineRangex, maxLineRangex], this.value)
    output.setAttributeNS(null, "x1", lineX)
    output.setAttributeNS(null, "x2", lineX)
}

var mapRange = function (from, to, s) {
    return parseFloat(to[0]) + parseFloat((s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]));
};

setBttn.onclick = function () {
    if (expected.value > 1 || expected.value < 0 || !Number.isInteger(parseInt(expected.value))) {

        swal({
            title: 'Error!',
            text: "The Equalizer only accepts values between Min and Max, please correct your input",
            type: 'error',
            confirmButtonText: "I'm on it!"
        })

        return null;
    }


    setSlider(mapRange([start, end], [0, 100], expected.value))
}

expected.onkeypress = function (event) {
    if (event.keyCode === 13) {
        setBttn.onclick();
        return false;
    }

}


function setSliderOnce(auxValue) {
    var value = mapRange([start, end], [0, 100], auxValue)
    var lineX = mapRange( [0, 100], [minLineRangex, maxLineRangex], value)
    slider.value = value;
    output.setAttributeNS(null, "x1", lineX);//(value) * pixX + gap)
    output.setAttributeNS(null, "x2", lineX);//(value) * pixX + gap)
    actualVal.innerText = auxValue;
}

function setSlider(value) {
    slider.value = value;
    var lineX = mapRange( [0, 100], [minLineRangex, maxLineRangex], value)
    output.setAttributeNS(null, "x1", lineX)
    output.setAttributeNS(null, "x2", lineX)
    actualVal.innerText = mapRange([0, 100], [start, end], value);
}





getEqBttn.onclick = function () {
    swal({
        title: 'Are you sure? this may change your actual work',
        text: "You're asking for equalizer of property : " + eqName.innerText + " with value : " + actualVal.innerText,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, get new equalizer!'
    }).then(async (result) => {
        if (result.value) {
            swal(
                'Petition Send',
                'The petition for a new equalizer was sent',
                'success'
            )
            
            console.log("eqvalues pre "+JSON.stringify(eqValues))
            eqValues[eqName.innerText] = actualVal.innerText;
            console.log("eqvalues post "+JSON.stringify(eqValues))
            var result = await requestCall( 'POST', '/updateEqualiser',{}, {name: eqName.innerText, value: actualVal.innerText, folder: actualModel} );
            
            console.log("result: "+result)
            console.log("eqName: " + eqName.innerText);
            console.log("actualVal: " + actualVal.innerText)
            names[eqName.innerText] = actualVal.innerText;
            modal.style.display = 'none';
            
        }
    })

}
