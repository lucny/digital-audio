window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "cs-CZ"; // Nastavíme češtinu
recognition.interimResults = false; // Zobrazíme pouze konečné výsledky

const startButton = document.getElementById("startButton");
const resultDisplay = document.getElementById("result");

startButton.addEventListener("click", () => {
  recognition.start(); // Spustí proces rozpoznávání řeči
});

recognition.addEventListener("result", (event) => {
  const transcript = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join("");
  resultDisplay.textContent = `Rozpoznaný text: ${transcript}`;
});

recognition.addEventListener("end", recognition.stop);
