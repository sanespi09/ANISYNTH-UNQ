class sinClass {

      sinObjStartX = 750;
      sinObjStartY = 50;

    constructor() {
      this.x = this.sinObjStartX;
      this.y = this.sinObjStartY;
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
        this.gain = map(mouseY,0,height - (this.size/2), 0.2, 0.01);

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
        this.gain = map(this.yConst,0,height - (this.size/2), 0.2, 0.01);

        this.sinGain = audioctx.createGain()
        this.sinOsc = audioctx.createOscillator()
        this.sinOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime)
        this.sinGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
        this.sinOsc.start()
        this.sinOsc.connect(this.sinGain)
        this.sinGain.connect(masterGain)
    }

    stop(){
        this.sinOsc.stop()
        this.sinOsc.disconnect()
        this.sinGain.disconnect()
    }
  }

class sawClass {

    sawObjStartX = 750;
    sawObjStartY = 150;

    constructor() {
      this.x = this.sawObjStartX;
      this.y = this.sawObjStartY;
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
        this.gain = map(this.y,0,height - (this.size/2), 0.2, 0.01);

        
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
        this.gain = map(this.y,0,height - (this.size/2), 0.2, 0.01);

        
        this.sawOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime)
        this.sawGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
       
        this.sawOsc.connect(this.sawGain)
        this.sawGain.connect(masterGain)
        this.sawOsc.start()
    }

    stop(){
        this.sawOsc.stop()
        this.sawOsc.disconnect()
        this.sawGain.disconnect()
    }
}

class triClass {

      triObjStartX = 750;
      triObjStartY = 250;

    constructor() {
      this.x = this.triObjStartX;
      this.y = this.triObjStartY;
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
        this.gain = map(this.y,0,height - (this.size/2), 0.2, 0.01);

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
        this.gain = map(this.y,0,height - (this.size/2), 0.2, 0.01);

        this.triGain = audioctx.createGain()
        this.triOsc = audioctx.createOscillator()
        this.triOsc.frequency.setValueAtTime(this.freq, audioctx.currentTime)
        this.triGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
        this.triOsc.type = 'triangle'
        this.triOsc.connect(this.triGain)
        this.triGain.connect(masterGain)
        this.triOsc.start()
    }

    stop(){
        this.triOsc.stop()
        this.triOsc.disconnect()
        this.triGain.disconnect()
    }
}

class noiseClass {

    noiseObjStartX = 750;
    noiseObjStartY = 350;

    constructor() {

      this.x = this.noiseObjStartX;
      this.y = this.noiseObjStartY;
      this.size = 50;

    }

    dragInit(){
        this.x = mouseX;
        this.y = mouseY;
    }

    dragActivo(){
        this.gain = map(this.y,0,height - (this.size/2), 0.1, 0.01);
        this.x = Math.max(25, Math.min(mouseX, 675));
        this.y = Math.max(25, Math.min(mouseY, 575));
        this.noiseGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
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
      
        this.gain = map(this.y,0,height - (this.size/2), 0.1, 0.01);

        this.noiseGain = audioctx.createGain()
        this.noiseOsc = audioctx.createBufferSource()
        this.noiseOsc.buffer = this.noiseBuffer;
        this.noiseOsc.loop = true;
        this.noiseGain.gain.setValueAtTime(this.gain, audioctx.currentTime)
        this.noiseOsc.connect(this.noiseGain)
        this.noiseGain.connect(masterGain)
        this.noiseOsc.start()
    }

    stop(){
        this.noiseOsc.stop()
        this.noiseOsc.disconnect()
        this.noiseGain.disconnect()
    }
}

  class binClass {
   
    binObjStart = [25, 575];
    tamaño = 20;

    constructor() {
      this.x = this.binObjStart[0];
      this.y = this.binObjStart[1];
      this.size = this.tamaño;
    }

    display() {
      stroke('white')
      strokeWeight(3)
      line(this.x - this.size/2 , this.y + this.size/2 , this.x + this.size/2 , this.y - this.size/2 );
      line(this.x - this.size/2 , this.y - this.size/2 , this.x + this.size/2 , this.y + this.size/2 );
    }
}

  class filterClass {

   titlePos = [700, 400];
   togglePos = [725, 400];
   sliderPos = [740, 450];
   toggleSize = { x: 50, y: 25 };
   sliderSize = { y: 130, x: 20 };
   sliderVal = {min: 1, max: 100};
   freqRange = {minF: Math.log(50), maxF: Math.log(18000)};

    constructor() {

      this.filterSwitch = createToggle("Filtro", this.togglePos[0], this.togglePos[1], this.toggleSize.x, this.toggleSize.y)
      this.filterSwitch.setStyle({
        strokeWeight: 1,
        rounding: 5,
        fillBgOff: color('rgb(194, 194, 194)'),
        fillBgOn: color('rgb(244, 244, 244)')
      })

      this.freqSlider = createSliderV("Cutoff", this.sliderPos[0], this.sliderPos[1], this.sliderSize.x, this.sliderSize.y, this.sliderVal.min, this.sliderVal.max)
      this.freqSlider.setStyle({
        strokeWeight: 1,
        rounding: 5,
        fillBg: color('rgb(194, 194, 194)'),
        fillBgHover: color('rgb(194, 194, 194)'),
        fillBgActive: color('rgb(194, 194, 194)'),
        fillHandleHover: color('rgb(244, 244, 244)')
      })

      this.freqSlider.isInteger = true
      this.step = (this.freqRange.maxF - this.freqRange.minF) / (this.sliderVal.max - this.sliderVal.min)
    }

    display() {
      drawGui()
    }

    switchFilter() {
  
      console.log(this.filterSwitch.val)
      
      if(this.filterSwitch.val){
        masterGain.disconnect()
        masterFilter.connect(audioctx.destination)
        masterGain.connect(masterFilter)
      }
      else if(!this.filterSwitch.val){
        masterFilter.disconnect()
        masterGain.disconnect()
        masterGain.connect(audioctx.destination)
      }
    }

    modFilter() {

      let pos = this.freqSlider.val
      let { minF } = this.freqRange
      let { min } = this.sliderVal


      let freq = parseInt(Math.exp( minF + (pos - min) * this.step ))
      console.log(freq)
      masterFilter.frequency.setValueAtTime(freq, audioctx.currentTime)
      
    }
}
