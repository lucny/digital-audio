let sound;
let fft;
let isPlaying = false;
let spectrumChart;  // Uchovává referenci na Chart.js graf

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.hide();  // Skryjeme p5.js canvas, protože použijeme Chart.js pro vizualizaci

    fft = new p5.FFT();  // Vytvoří analyzátor FFT

    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', () => {
        if (!sound) {
            userStartAudio();  // Inicializace AudioContext po uživatelském gestu
            sound = loadSound('Gellner-Vzduchoplavec.mp3', () => {
                sound.loop();
                isPlaying = true;

                // Po načtení zvuku vykreslíme graf jen jednou
                initializeChart();
            });
        } else {
            togglePlay();
        }
    });
}

function initializeChart() {
    const ctx = document.getElementById('spectrumChart').getContext('2d');

    // Získání frekvencí odpovídajících indexům
    const frequencies = Array.from({length: 1024}, (_, i) => freqFromIndex(i, 44100));  // Zde použijeme 44100 Hz jako vzorkovací frekvenci

    // Vytvoříme nový graf (jen jednou)
    spectrumChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: frequencies,  // Frekvenční složky v Hertzích
            datasets: [{
                label: 'Spektrum',
                data: Array(1024).fill(0),  // Inicializujeme prázdná data
                backgroundColor: function(context) {
                    const index = context.dataIndex;
                    return index < 60 ? 'red' : index < 150 ? 'purple' : 'blue';
                },
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frekvence (Hz)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amplituda'
                    }
                }
            }
        }
    });
}

// Funkce pro přepočet indexu na frekvenci
function freqFromIndex(index, sampleRate) {
    const fftSize = 1024;  // Velikost FFT
    return Math.round((index * sampleRate) / (2 * fftSize));
}


// Funkce pro aktualizaci dat v grafu (bez vytváření nového grafu)
function updateChart(spectrumData) {
    spectrumChart.data.datasets[0].data = spectrumData;
    spectrumChart.update();  // Pouze aktualizujeme data grafu
}

function draw() {
    if (fft && isPlaying) {
        let spectrum = fft.analyze();  // Získání spektra frekvencí z FFT
        updateChart(spectrum);  // Aktualizujeme graf s novými daty
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
