
const AudioContext = window.AudioContext || window.webkitAudioContext;
var masterGain, masterFilter;
let audioctx;
var bg;
var gui;
const width = 800;
const height = 600;
var objDragActivo = false;
let objDrag = false;
var objActivos = [];
let objCaja = [];
let objActivo;
var audioInit = false;
var initDialog;



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
    
    initDialog = new dialog('Esta aplicación hace uso de un motor de audio, debe aceptar o declinar', [ 'aceptar' , 'cancelar' ], width/2 , height/3, 40, initDialogClick)

    console.log(initDialog)

}

function draw(){


 
    //actualiza el fondo en cada frame
    background(bg);

    
    //Dibuja Caja de herramientas
    cajaHerramientas();

    //llama a la funcion que muestra los objetos activos en escena

    if (initDialog){
    initDialog.display()
    }
    

    if (audioInit){
    
    mostrarActivos();

    handleFilter(false);

    //Llama a la funcion que chequea hovers sobre objetos activos
    if (!objDragActivo && objActivos.length > 0 && !mouseIsPressed){
     objActivo = checkMouseActivos()
    }

    //Llama a función que mueve objetos activos
    if(mouseIsPressed && objActivo != null && mouseX < 700 && !objDrag ){
        moverActivos(objActivos[objActivo])
    }
    //Llama a función que maneja la eliminación de los objetos activos
    if(!objDrag && !objDragActivo){
        eliminarObj();
    }

    if(objDrag){
        moverActivos(objActivos[objActivos.length-1]);
    }
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
 
   objActivos.forEach((v, i) => {
       let d = parseInt(dist(mouseX, mouseY, v.x, v.y))
       if(d < v.size/2){
           o = i;
        }
    })

   console.log(o)
   return o;

}

function moverActivos (o){

    xConsInit = Math.max(25, Math.min(mouseX, width - 25))
    xCons = Math.max(25, Math.min(mouseX, width - 125))
    yCons =  Math.max(25, Math.min(mouseY, height - 25))

    if (!objDrag){
        objDragActivo = true;
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
    rect(700, 0, 100, 600);

    for (var i = 0; i < objCaja.length - 1 ; i++) {
        objCaja[i].display();
    }
}


function mousePressed(){

    if(audioInit){

    if (mouseX > 700){
        clickObjCaja();   
    }
}
}

function mouseReleased(){

if (audioInit){    

if(mouseX < 675){

    if(objDrag){
        objDrag = false;
        suenaObj();
        handleFilter(true);
    }

    if(objDragActivo){
        objDragActivo = false
    }
    
}else{

    if(objDrag){
        objDrag = false;
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
        objDrag = true;
        
    }else if (dsaw < (objCaja[1].size / 2)){
        objActivos.push(new sawClass())
        objDrag = true;
        
    }else if (dtri < (objCaja[2].size / 2)){
        objActivos.push(new triClass())
        objDrag = true;
    }else if (dnoise < (objCaja[2].size / 2)){
        objActivos.push(new noiseClass())
        objDrag = true;

    }
    else {
        objDrag = false;
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

    let brightness = f.freqSlider.val

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

    if( mouseX > 700 || objDrag || objDragActivo || objActivo != null ){
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
    initDialog = null;

    console.log(gui)
    
}