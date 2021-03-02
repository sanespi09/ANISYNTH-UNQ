var sinObjStartX = 750;
var sinObjStartY = 50;
var sawObjStartX = 750;
var sawObjStartY = 150;
var triObjStartX = 750;
var triObjStartY = 250;
var noiseObjStartX = 750;
var noiseObjStartY = 350;
var binObjStart = [25, 575];


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
