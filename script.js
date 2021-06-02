const AudioContext = window.AudioContext || window.webkitAudioContext;
var masterGain, masterFilter;
let audioctx;
var bg;
var gui;
const width = 1280;
const height = 720;
const cajaWidth = 100;
var objActivoDrag = false;
let objCajaDrag = false;
var objActivos = [];
let objCaja = [];
let objActivo;
var audioInit = false;
var initDialog;
var appState = { dialogActive: false };



function setup(){

    colorMode(HSB, 360, 100, 100)

    //inicializo el canvas y lo asocio a un elemento del DOM
    var canvas = createCanvas(width, height);
    canvas.parent('cont_canvas');

    bg = loadImage('../Recursos/grilla.png')
    gui = createGui();
    console.log(gui)
    
    //inicializo los objetos de la caja de herramientas
    objCaja.push(new sinClass());
    objCaja.push(new sawClass());
    objCaja.push(new triClass());
    objCaja.push(new noiseClass());
    objCaja.push(new binClass());
    objCaja.push(new filterClass());
    
    initDialog = new dialog('Esta aplicación hace uso de un motor de audio, debe aceptar o declinar', [ 'aceptar' , 'cancelar' ], 40, initDialogClick)

    console.log(dialog)

}

function draw(){


   console.log(objActivo);

    //actualiza el fondo en cada frame
    background(bg);

    
    //Dibuja Caja de herramientas
    cajaHerramientas();

    //llama a la funcion que muestra los objetos activos en escena
 

    if (audioInit){
    
    mostrarActivos();

    handleFilter(false);

    //Llama a la funcion que chequea hovers sobre objetos activos
    if (!objActivoDrag && !mouseIsPressed){
     objActivo = checkMouseActivos()
    }

    //Llama a función que mueve objetos activos
    if(mouseIsPressed && objActivo != null && mouseX < width - cajaWidth){
        if(objCajaDrag)
            moverActivos(objActivos[objActivos.length - 1]);
        else{
            moverActivos(objActivos[objActivo]);
        }
    }
    //Llama a función que maneja la eliminación de los objetos activos
    if(!objCajaDrag && !objActivoDrag){
        eliminarObj();
    }

    if(objCajaDrag){
        moverActivos(objActivos[objActivos.length-1]);
    }
    }


    if(initDialog){
        gui.objects[0].visible = false;
        gui.objects[1].visible = false;
        oscurecer();
        initDialog.display();
    }

    drawGui()
}

function mostrarActivos() {

    for (var i = 0; i < objActivos.length; i++) {
        objActivos[i].display();
    }
}

function checkMouseActivos(){

    let o;
    
    // if(mouseX < width - cajaWidth){

   objActivos.forEach((v, i) => {
       let d = parseInt(dist(mouseX, mouseY, v.x, v.y))
       if(d < v.size/2){
           o = i;
        }
    })
    // else {
    //     objCaja.forEach((v, i) => {
    //         let d = parseInt(dist(mouseX, mouseY, v.x, v.y))
    //         if(d < v.size/2){
    //             o = v;
    //          }
    //      })
    // }

   console.log(o)
   return o;

}

function oscurecer (){
    fill('rgba(0,0,0,0.9)')
    rect(width/2, height/2, width, height);
}

function moverActivos (o){

    xConsInit = Math.max(o.size/2, Math.min(mouseX, width - o.size/2))
    xCons = Math.max(o.size/2, Math.min(mouseX, width - cajaWidth - o.size/2))
    yCons =  Math.max(o.size/2, Math.min(mouseY, height - o.size/2))

    console.log(xCons)

    if (!objCajaDrag){
        objActivoDrag = true;
        o.x = xCons
        o.y = yCons
        o.size = map(yCons, 25, 675, 80, 20)
        o.modOsc()

  } else {
        o.x = xConsInit
        o.y = yCons
        o.size = map(yCons, 25, 675, 80, 20)
  }

}

function eliminarObj (){
    let bin = objCaja.find( e => e.constructor.name == 'binClass' )

    objActivos.forEach((v, i) => {
        let d = parseInt(dist(v.x, v.y , bin.x, bin.y))

        if(d < v.size / 2){
            objActivos[i].stop()
            objActivos.splice(i , 1)
        }
    })

}

function cajaHerramientas(){

    fill('grey');
    rectMode(CORNER);
    rect(width - cajaWidth, 0, cajaWidth, height);

    for (var i = 0; i < objCaja.length - 1 ; i++) {
        objCaja[i].display();
    }
}


function mousePressed(){

    if(audioInit){

    if (mouseX > width - cajaWidth){
        clickObjCaja();   
    }
}
}

function mouseReleased(){

if (audioInit){    

if(mouseX < width - cajaWidth - 25){

    if(objCajaDrag){
        objCajaDrag = false;
        suenaObj();
        handleFilter(true);
    }

    if(objActivoDrag){
        objActivoDrag = false
    }
    
}else{

    if(objCajaDrag){
        objCajaDrag = false;
        objActivos.pop();
    }
  }
 }
}

function iniciarAudio (){

    audioctx = new AudioContext();
    audioInit = true;

    masterGain = audioctx.createGain();
    masterGain.connect(audioctx.destination)

    masterFilter = audioctx.createBiquadFilter();
    masterFilter.type = 'lowpass'
    masterFilter.frequency.setValueAtTime(18000, audioctx.currentTime)

    console.log('Audio iniciado : ' + audioInit)

}

function suenaObj(){

    objActivos[objActivos.length-1].play()
    
}

function clickObjCaja(){
    
    let dsin = parseInt(dist(mouseX, mouseY, objCaja[0].x, objCaja[0].y));
    let dsaw = parseInt(dist(mouseX, mouseY, objCaja[1].x, objCaja[1].y));
    let dtri = parseInt(dist(mouseX, mouseY, objCaja[2].x, objCaja[2].y));
    let dnoise = parseInt(dist(mouseX, mouseY, objCaja[3].x, objCaja[3].y));

    if (dsin < (objCaja[0].size / 2)){
        objActivos.push(new sinClass());
        objCajaDrag = true;
        
    }else if (dsaw < (objCaja[1].size / 2)){
        objActivos.push(new sawClass())
        objCajaDrag = true;
        
    }else if (dtri < (objCaja[2].size / 2)){
        objActivos.push(new triClass())
        objCajaDrag = true;
    }else if (dnoise < (objCaja[2].size / 2)){
        objActivos.push(new noiseClass())
        objCajaDrag = true;

    }
    else {
        objCajaDrag = false;
    }
}

function handleFilter(newObj) {

    let filter = objCaja.find( e =>  e.constructor.name == 'filterClass' )

    if (filter.freqSlider.isChanged){
        filter.modFilter()
        modOpacity(filter)
        
    }else if (filter.filterSwitch.isChanged){
        
        filter.switchFilter()
        modOpacity(filter)
    }
    else if (newObj){
        modOpacity(filter, newObj)
    }

}

function modOpacity (f, newObj) {

    let brightness = Math.max(20, min(f.freqSlider.val, 100))

    if (f.filterSwitch.val){
        objActivos.forEach( e => {
            e.bright = brightness
            console.log(e.color)
        })
    } else if(!f.filterSwitch.val){
        objActivos.forEach( e => {
            e.bright = 100;
        })
    }else if(newObj){
        objActivos[objActivos.length-1].bright = brightness
    }
}

function mouseMoved (){

    if( mouseX > width - cajaWidth || objCajaDrag || objActivoDrag || objActivo != null ){
        cursor('pointer');
    }
    else 
        cursor('default');
}

function initDialogClick (val){

    if (val){
        console.log('se inicio el audio')
        audioInit = true
        iniciarAudio()
    } else {
        audioInit = false
    }

    initDialog.remove()
    gui.objects[0].visible = true;
    gui.objects[1].visible = true;
    initDialog = null;

    console.log(gui)
    
}