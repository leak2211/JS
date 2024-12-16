let sound; // Переменная где будет находится аудио-дорожка
let isInitialised; // Состояние, которое обозначает инициализированы ли значения или нет
let isLoaded = false;
let amplitude;
let amplitudes = [];

let fft;

function preload()
{
    soundFormats('mp3', 'wav'); // Определяем аудио форматы, поддерживаемые плеером
    sound = loadSound('assets/yee-king_track.mp3', () =>{
        console.log("sound is loaded!"); // Загружаем музыку и при успешной загрузке выводим в консоль сообщение, что музыка загрузилась
        isLoaded = true;
    });
    isInitialised = false; 
    sound.setVolume(0.2); // Устанавливаем громкость на 20%
}

function setup()
{
    createCanvas(1024, 1024);
    textAlign(CENTER); // Центрируем следующий текст по центру
    textSize(32);
    
    amplitude = new p5.Amplitude();
    
    for (let i = 0; i < 512; i++)
        amplitudes.push(0);
    
    fft = new p5.FFT();
}

function draw() {
    background(0);
    fill(255);
    
    if (isInitialised && !sound.isPlaying()) {
        text("Press any key for play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        let freqs = fft.analyze(); // Анализ частот

        stroke(255);

        // Создание массива сглаженных частот на основе 5 ближайших
        let smoothedFreqs = [];
        
        for (let i = 2; i < freqs.length - 2; i++) {
            let avg = (freqs[i-2] + freqs[i-1] + freqs[i] + freqs[i+1] + freqs[i+2]) / 5; // Среднее значение
            smoothedFreqs.push(avg);
        }
        
     
        for (let i = 0; i < smoothedFreqs.length; i++) {
            let x = map(i, 0, smoothedFreqs.length, 0, width);
            let h = map(smoothedFreqs[i], 0, 255, 0, height);
            rect(x, height, width / smoothedFreqs.length, -h); // Столбцы
        }
    }
}

function keyPressed()
{
    if (!isInitialised)
    {
        isInitialised = true;
        
        
        let r = map(mouseX, 0, width, 0.5, 4.0); // r - скорость воспроизведения звука, которую мы расчитываем в зависимость от положения мыши по x. Чем правее - тем быстрее запускается воспроизведение
        if (isLoaded)
            sound.loop(0, r); // loop - функция для зацикливания. 0 -  откуда начинается зацикливание по времени r - rate - playback rate
    }
    else
    {
        if (key == ' ')
        {
            if (sound.isPaused())   sound.play();
            else                    sound.pause();
        }
    }
}