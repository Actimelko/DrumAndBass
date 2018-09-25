import heater from './heater.json';
import piano from './piano.json';

function DrumMachine(options){
  const elem = this._elem = options.elem;
  this._isActive = true;
  this._instrument = elem.querySelector('select[name="instruments"]').value;
  this._volume = elem.querySelector('.drum__controls__volume input').value;
  this._infoTimer = null;
  elem.addEventListener('change', this._changeInstrument.bind(this));
  elem.addEventListener('click', this._turn.bind(this));
  elem.addEventListener('change', this._changeVolume.bind(this));
  elem.addEventListener('click', this._playClick.bind(this));
  document.addEventListener('keydown', this._playBtn.bind(this));
}

DrumMachine.prototype._printInfo = function(info) {
    clearTimeout(this._infoTimer);
    const infoDisplay = this._elem.querySelector('.drum__controls__output__display');
    infoDisplay.innerHTML = info;
    this._infoTimer = setTimeout(() => {
      infoDisplay.innerHTML = '...';
    }, 500);
}

DrumMachine.prototype._changeVolume = function(e){
  const target = e.target;
  if (!target.closest('.drum__controls__volume__input')) return;
  this._volume = target.value;
  this._printInfo("Volume: " + Math.round(this._volume * 100) + "%");
  const audioElements = document.querySelectorAll('.drum__pad__button audio');
  for (let i = 0; i < audioElements.length; i++) {
    const audio = audioElements[i];
    audio.volume = +this._volume;
  }
}

DrumMachine.prototype._activeAudioContainer = function(audioCont) {
  audioCont.classList.add('drum__pad__button_active');
  setTimeout(() => {
    audioCont.classList.remove('drum__pad__button_active');
  }, 10);
}

DrumMachine.prototype._playAudio = function(char, audio) {
  if (char) {
    const audio = this._elem.querySelector(`#${char} audio`);
    if (audio) {
      audio.play();
      this._activeAudioContainer(audio.parentNode);
      this._printInfo(audio.getAttribute('data-info'));
    }
  } else if (audio){
      audio.play();
      this._activeAudioContainer(audio.parentNode);
      this._printInfo(audio.getAttribute('data-info'));
  }
}

DrumMachine.prototype._playClick = function(e) {
  const target = e.target;
  if (!target.closest('.drum__pad__button')) return;
  if (this._isActive){
    const audio = target.closest('.drum__pad__button').querySelector('audio');
    this._playAudio(null, audio);
  }
}

DrumMachine.prototype._playBtn = function(e) {
  console.log(e.keyCode);
  if (this._isActive){
    const char = String.fromCharCode(e.keyCode);
    this._playAudio(char);
  }
}

DrumMachine.prototype._activeButton = function(btn){
  btn.classList.add('.drum__pad__button_active');
}

DrumMachine.prototype._clearItems = function() {
  const items = this._elem.querySelectorAll('.drum__pad__button');
  for (let i = 0; i < items.length; i++){
     items[i].remove();
  }
}

DrumMachine.prototype._changeInstrument = function(e) {
  const target = e.target;
  if (!target.closest('select[name="instruments"]')) return;
  this._instrument = target.value;
  this._clearItems();
  this.renderItems();
  this._printInfo("Instr: " + this._instrument.toUpperCase());
}

DrumMachine.prototype._turnOn = function(btn) {
  if (!this._isActive){
    const offBtn = this._elem.querySelector('.drum__controls__turn__off');
    this._isActive = !this._isActive;
    btn.classList.add('drum__controls__turn__on_active');
    offBtn.classList.remove('drum__controls__turn__off_active');
  }
}

DrumMachine.prototype._turnOff = function(btn) {
  if (this._isActive){
    const onBtn = this._elem.querySelector('.drum__controls__turn__on');
    this._isActive = !this._isActive;
    btn.classList.add('drum__controls__turn__off_active');
    onBtn.classList.remove('drum__controls__turn__on_active');
  }
}

DrumMachine.prototype._turn = function(e) {
  const target = e.target;
  if (target.closest('.drum__controls__turn__on')) {
    this._turnOn(target);
    this._printInfo("Turn ON");
  }
  
  if (target.closest('.drum__controls__turn__off')) {
    this._turnOff(target);
    this._printInfo("Turn OFF");
  }
}


DrumMachine.prototype.renderItems = function(){
  const instrument = this._instrument === 'heater' ? heater : piano;
  const pad = this._elem.querySelector('.drum__pad')
  instrument.forEach( el => {
    const div = document.createElement('div');
    div.classList.add('drum__pad__button');
    div.id = el.id;
    div.innerHTML = el.id;
    const audio = document.createElement('audio');
    audio.src = el.src;
    const dataInfo = audio.src.slice(audio.src.lastIndexOf('/') + 1, audio.src.lastIndexOf('.'));
    audio.setAttribute('data-info', dataInfo);
    audio.volume = +this._volume;
    div.append(audio);
    pad.append(div);
  })
}




import './css/main.css';

const drumMachine = new DrumMachine({
  elem: document.getElementById('drum-machine')
})

drumMachine.renderItems();