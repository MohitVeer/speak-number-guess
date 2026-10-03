const msgEl = document.getElementById('msg');

const randomNum = getRandomNumber();

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let gameWon = false;

if (window.SpeechRecognition) {
  recognition = new window.SpeechRecognition();

  // Start recognition and game
  recognition.start();
}

// Capture user speak
function onSpeak(e) {
  const msg = e.results[0][0].transcript;

  writeMessage(msg);
  checkNumber(msg);
}

// Write what user speaks
function writeMessage(msg) {
  msgEl.innerHTML = `
    <div>You said: </div>
    <span class="box">${msg}</span>
  `;
}

// Check msg against number
function checkNumber(msg) {
  const num = +msg;

  // Check if valid number
  if (Number.isNaN(num)) {
    msgEl.innerHTML += '<div>That is not a valid number</div>';
    return;
  }

  // Check in range
  if (num > 100 || num < 1) {
    msgEl.innerHTML += '<div>Number must be between 1 and 100</div>';
    return;
  }

  // Check number
  if (num === randomNum) {
    gameWon = true;
    recognition.stop();

    document.body.innerHTML = `
      <h2>Congrats! You have guessed the number! <br><br>
      It was ${num}</h2>
      <button class="play-again" id="play-again">Play Again</button>
    `;
  } else if (num > randomNum) {
    msgEl.innerHTML += '<div>GO LOWER</div>';
  } else {
    msgEl.innerHTML += '<div>GO HIGHER</div>';
  }
}

// Generate random number
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

if (recognition) {
  // Speak result
  recognition.addEventListener('result', onSpeak);

  // End SR service
  recognition.addEventListener('end', () => {
    if (!gameWon) {
      recognition.start();
    }
  });

  // Recognition error (e.g. mic permission denied, no speech detected)
  recognition.addEventListener('error', e => {
    msgEl.innerHTML = `<div>Speech recognition error: ${e.error}</div>`;
  });
} else {
  msgEl.innerHTML =
    "Speech recognition isn't supported in this browser — try Chrome or Edge.";
}

document.body.addEventListener('click', e => {
  if (e.target.id == 'play-again') {
    window.location.reload();
  }
});
