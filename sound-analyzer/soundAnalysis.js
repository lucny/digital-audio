let sound;
let fft;
let isPlaying = false;
let rmsAnalyzer;

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent(document.body);  // Připojí canvas do těla stránky
    
    fft = new p5.FFT();  // Vytvoří analyzátor FFT
    rmsAnalyzer = new p5.Amplitude();  // Analyzátor pro RMS (celkovou hlasitost)

    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', () => {
        if (!sound) {
            userStartAudio();  // Inicializace AudioContext po uživatelském gestu
            sound = loadSound('Gellner-Vzduchoplavec.mp3', () => {
                sound.loop();
                isPlaying = true;
            });
        } else {
            togglePlay();
        }
    });
}

function draw() {
    background(200);

    if (fft && isPlaying) {
        let spectrum = fft.analyze();  // Získání aktuálního frekvenčního spektra

        // Najdi dominantní frekvenci
        let dominantFreq = fft.getEnergy('bass');
        
        // Zobraz dominantní frekvenci na stránce
        document.getElementById('dominantFreq').innerText = dominantFreq.toFixed(2);

        // Získání hodnoty RMS (celková hlasitost)
        let rmsValue = rmsAnalyzer.getLevel();
        document.getElementById('rms').innerText = rmsValue.toFixed(2);

        // Vizualizace spektra
        noStroke();
        fill(0, 255, 0);

        for (let i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length, 0, width);
            let h = -height + map(spectrum[i], 0, 255, height, 0);
            rect(x, height, width / spectrum.length, h);  // Vykreslení obdélníků podle hodnot spektra
        }
    }
}

function togglePlay() {
    if (isPlaying) {
        sound.pause();
    } else {
        sound.loop();
    }
    isPlaying = !isPlaying;
}
