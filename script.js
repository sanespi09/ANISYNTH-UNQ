const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioctx;
let bg;
const width = 800;
const height = 600;
var sinObjStartX = 750;
var sinObjStartY = 50;
var sawObjStartX = 750;
var sawObjStartY = 150;
var triObjStartX = 750;
var triObjStartY = 250;
var noiseObjStartX = 750;
var noiseObjStartY = 350;
var binObjStart = [25, 575];
var objDragActivo = false;
let objDrag = false;
var objActivos = [];
let objCaja = [];
let objActivo;


function setup (){


    //inicializo el canvas y lo asocio a un elemento del DOM
    var canvas = createCanvas(width, height);
    canvas.parent('cont_canvas');

    bg = loadImage('Recursos/grilla.png')

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



class sinClass {

    constructor() {
      this.x = sinObjStartX;
      this.y = sinObjStartY;
      this.size = 50;
      this.freq;
      this.gain;
            
    }

    dragInit(){
        this.x = mouseX;
        this.y = mouseY;
    }

    dragActivo(){

        this.x = Math.max(25, Math.min(mouseX, 675));
        this.y = Math.max(25, Math.min(mouseY, 575));

        this.freq = parseInt(map(this.x,25,675, 130, 262));
        this.gain = map(mouseY,0,height - (this.size/2), 1, 0.01);

        this.sinOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime);
        this.sinGain.gain.setValueAtTime(this.gain, audioctx.currentTime) 
    }
  
    display() {
      fill('white');
      strokeWeight(1);
      ellipse(this.x, this.y, this.size, this.size);
    }

    play(){

        this.xConst = Math.max(25, Math.min(this.x, 675));
        this.yConst = Math.max(25, Math.min(this.y, 575));
        this.freq = parseInt(map(this.xConst,25,675, 130, 262));
        this.gain = map(this.yConst,0,height - (this.size/2), 1, 0.01);

        this.sinGain = audioctx.createGain()
        this.sinOsc = audioctx.createOscillator()
        this.sinOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime)
        this.sinGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
        this.sinOsc.start()
        this.sinOsc.connect(this.sinGain)
        this.sinGain.connect(audioctx.destination)
    }

    stop(){
        this.sinOsc.stop()
        this.sinOsc.disconnect()
        this.sinGain.disconnect()
    }
  }

class sawClass {

    constructor() {
      this.x = sawObjStartX;
      this.y = sawObjStartY;
      this.size = 50;
      
    }

    dragInit(){
        this.x = mouseX;
        this.y = mouseY;
    }

    dragActivo(){

        this.x = Math.max(25, Math.min(mouseX, 675));
        this.y = Math.max(25, Math.min(mouseY, 575));

        this.freq = parseInt(map(this.x,25,675, 130, 262));
        this.gain = map(this.y,0,height - (this.size/2), 1, 0.01);

        
        this.sawOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime);
        this.sawGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
    }
  
    display() {

      fill('red');
      strokeWeight(1);
      rectMode(CENTER);
      rect(this.x, this.y, this.size, this.size);
    }

    play(){
        this.sawGain = audioctx.createGain()
        this.sawOsc = audioctx.createOscillator()
        this.sawOsc.type = 'sawtooth'

        this.freq = parseInt(map(this.x,25,675, 130, 262));
        this.gain = map(this.y,0,height - (this.size/2), 1, 0.01);

        
        this.sawOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime)
        this.sawGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
       
        this.sawOsc.connect(this.sawGain)
        this.sawGain.connect(audioctx.destination)
        this.sawOsc.start()
    }

    stop(){
        this.sawOsc.stop()
        this.sawOsc.disconnect()
        this.sawGain.disconnect()
    }
}

class triClass {

    constructor() {
      this.x = triObjStartX;
      this.y = triObjStartY;
      this.size = 50;
    }

    dragInit(){
        this.x = mouseX;
        this.y = mouseY;
    }

    dragActivo(){

        this.x = Math.max(25, Math.min(mouseX, 675));
        this.y = Math.max(25, Math.min(mouseY, 575));

        this.freq = parseInt(map(this.x,25,675, 130, 262));
        this.gain = map(this.y,0,height - (this.size/2), 1, 0.01);

        this.triOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime);
        this.triGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
    }
  
    display() {

      fill('green');
      strokeWeight(1);
      triangle(this.x - this.size/2, this.y + this.size/2, this.x, this.y - this.size/2, this.x + this.size/2, this.y + this.size/2);
    }

    play(){

        this.freq = parseInt(map(this.x,25, 675, 130, 262));
        this.gain = map(this.y,0,height - (this.size/2), 1, 0.01);

        this.triGain = audioctx.createGain()
        this.triOsc = audioctx.createOscillator()
        this.triOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime)
        this.triGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
        this.triOsc.type = 'triangle'
        this.triOsc.connect(this.triGain)
        this.triGain.connect(audioctx.destination)
        this.triOsc.start()
    }

    stop(){
        this.triOsc.stop()
        this.triOsc.disconnect()
        this.triGain.disconnect()
    }
}

class noiseClass {

    constructor() {
      this.x = noiseObjStartX;
      this.y = noiseObjStartY;
      this.size = 50;

    }

    dragInit(){
        this.x = mouseX;
        this.y = mouseY;
    }

    dragActivo(){
        this.gain = map(this.y,0,height - (this.size/2), 0.7, 0.01);

        this.y = Math.max(25, Math.min(mouseY, 575));
        this.noiseGain.gain.setValueAtTime(map(mouseY,0,height - (this.size/2), 0.4, 0.01), audioctx.currentTime)
    }
  
    display() {

      fill('pink');
      strokeWeight(1);
      ellipse(this.x, this.y, this.size, this.size);
    }

    play(){

      this.noiseBuffer = audioctx.createBuffer(1, audioctx.sampleRate * 2, audioctx.sampleRate)
      this.noiseChannel = this.noiseBuffer.getChannelData(0);

      for (var i = 0; i < audioctx.sampleRate * 2; i++){
         this.noiseChannel[i] = Math.random() * 2 - 1
      }
      
        this.gain = map(this.y,0,height - (this.size/2), 0.4, 0.01);

        this.noiseGain = audioctx.createGain()
        this.noiseOsc = audioctx.createBufferSource()
        this.noiseOsc.buffer = this.noiseBuffer;
        this.noiseOsc.loop = true;
        this.noiseGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
        this.noiseOsc.connect(this.noiseGain)
        this.noiseGain.connect(audioctx.destination)
        this.noiseOsc.start()
    }

    stop(){
        this.noiseOsc.stop()
        this.noiseOsc.disconnect()
        this.noiseGain.disconnect()
    }
}

  class binClass {

   tamaño = 20;

    constructor() {
      this.x = binObjStart[0];
      this.y = binObjStart[1];
      this.size = this.tamaño;
    }

    display() {
      stroke('white')
      strokeWeight(3)
      line(this.x - this.size/2 , this.y + this.size/2 , this.x + this.size/2 , this.y - this.size/2 );
      line(this.x - this.size/2 , this.y - this.size/2 , this.x + this.size/2 , this.y + this.size/2 );
    }
}