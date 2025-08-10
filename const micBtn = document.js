const micBtn = document.getElementById('mic-btn');

let recognition;
let isListening = false;

// Check for browser support
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener('start', () => {
    isListening = true;
    micBtn.textContent = '🛑'; // change icon to stop
    micBtn.title = 'Stop recording';
  });

  recognition.addEventListener('end', () => {
    isListening = false;
    micBtn.textContent = '🎤';
    micBtn.title = 'Speak';
  });

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    input.focus();
    // Optionally auto-submit after speech ends:
    // form.requestSubmit();
  });
} else {
  micBtn.disabled = true;
  micBtn.title = 'Speech recognition not supported';
}

// Toggle speech recognition on mic button click
micBtn.addEventListener('click', () => {
  if (!recognition) return;

  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
  }
});