import { DrumMachine } from './components/DrumMachine.js';
import './css/main.css';

const drumMachine = new DrumMachine({
  elem: document.getElementById('drum-machine')
})

drumMachine.render();
