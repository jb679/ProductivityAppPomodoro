let timer;
let seconds = 25 * 60;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function startTimer() {
  console.log("Start button clicked");
  displayMessage("The timer has started!");
  timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
  console.log("Pause button clicked");
  clearInterval(timer);
  displayMessage("The timer has paused!");
}

function updateTimer() {
  if (seconds > 0) {
    seconds--;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(
      remainingSeconds
    )}`;
    document.querySelector(".timer").innerText = formattedTime;
  } else {
    clearInterval(timer);
    displayMessage("Timer done! Good Job!");

    playBuzzer();
    createConfetti();
  }
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

function displayMessage(message) {
  const messageBoxStart = document.getElementById("messageBoxStart");
  messageBoxStart.innerText = message;

  setTimeout(() => {
    messageBoxStart.innerText = "";
  }, 3000);
}

function createConfetti() {
  const confettiContainer = document.getElementById("confettiContainer");

  const colors = ["#f44336", "#2196f3", "#ffeb3b", "#4caf50", "#ff9800"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
    confettiContainer.appendChild(confetti);
  }
}

function playBuzzer() {
  // Create an oscillator
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine"; // You can experiment with other wave types like 'square', 'sawtooth', etc.
  oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
  oscillator.connect(audioContext.destination);

  // Envelope to create a short, percussive sound
  const envelope = audioContext.createGain();
  envelope.connect(audioContext.destination);
  envelope.gain.setValueAtTime(1, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.2
  );

  // Connect oscillator to envelope
  oscillator.connect(envelope);

  // Start the oscillator
  oscillator.start();

  // Stop the oscillator and envelope after a short duration (adjust as needed)
  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
    envelope.disconnect();
  }, 300);
}
