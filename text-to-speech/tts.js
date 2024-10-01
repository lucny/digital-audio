const speakButton = document.getElementById('speakButton');
const textInput = document.getElementById('textInput');

speakButton.addEventListener('click', () => {
    const text = textInput.value;  // Získá text od uživatele
    speakText(text);  // Převede text na hlas
});

function speakText(text) {
    const speechSynthesis = window.speechSynthesis;  // Přístup k API TTS
    const utterance = new SpeechSynthesisUtterance(text);  // Vytvoří objekt pro přečtení textu
    
    // Nastavení jazyka a dalších parametrů (čeština v tomto případě)
    utterance.lang = 'cs-CZ';
    utterance.pitch = 1;  // Výška hlasu (1 = normální)
    utterance.rate = 1;   // Rychlost čtení (1 = normální)
    
    speechSynthesis.speak(utterance);  // Spustí čtení textu
}
