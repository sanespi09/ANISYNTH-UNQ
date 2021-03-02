
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioctx;
let bg;
const width = 800;
const height = 600;
var objDragActivo = false;
let objDrag = false;
var objActivos = [];
let objCaja = [];
let objActivo;


function setup(){


    //inicializo el canvas y lo asocio a un elemento del DOM
    var canvas = createCanvas(width, height);
    canvas.parent('cont_canvas');

    bg = loadImage('../Recursos/grilla.png')

    //inicializo los objetos de la caja de herramientas
    objCaja.push(new sinClass());
    objCaja.push(new sawClass());
    objCaja.push(new triClass());
    objCaja.push(new noiseClass());
    objCaja.push(new binClass());

    
}

function draw(){
 
    //actualiza el fondo en cada frame
    background(bg);
    cajaHerramientas();

    if (!objDragActivo && objActivos.length > 0){
     objActivo = checkMouseActivos()
    }

    if(mouseIsPressed && objActivo != null && mouseX < 700){
        moverActivos(objActivo)
    }

    //llama a la funcion que muestra los objetos activos en escena
    mostrarActivos();
    if(!objDrag && !objDragActivo){
    eliminarObj();
    }

    if(objDrag){
        objActivos[objActivos.length-1].dragInit();
    }


  console.log(objDrag)
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

    if (!objDrag){
        objDragActivo = true;
        objActivos[o].dragActivo()
  }

}

function eliminarObj (){

    objActivos.forEach((v, i) =>{
        let d = parseInt(dist(v.x, v.y , binObjStart[0], binObjStart[1]))

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

    for (var i = 0; i < objCaja.length; i++) {
        objCaja[i].display();
    }
}


function mousePressed(){

    audioctx = new AudioContext();

    if (mouseX > 700){
        clickObjCaja();   
    }
}

function mouseReleased(){

if(mouseX < 675){

    if(objDrag){
        objDrag = false;
        suenaObj();
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
    }else{
        objDrag = false;
    }
}

function mouseMoved (){

    if(mouseX > 700 || objDrag || objDragActivo || objActivo != null){
        cursor('pointer');
    }
    else 
        cursor('default');
}