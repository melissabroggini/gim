// Variabili per la palla
let ballX, ballY;
let ballSpeedX, ballSpeedY;
let ballSize = 20;
let ballColor; // Variabile per il colore della palla
let bgColor; // Variabile per il colore di sfondo

// Variabili per le racchette
let paddleWidth = 10;
let paddleHeight = 80;

// Racchetta sinistra
let leftPaddleX, leftPaddleY;

// Racchetta destra
let rightPaddleX, rightPaddleY;


function setup() {
    createCanvas(600, 400);
    
    // Posiziona le racchette
    leftPaddleX = paddleWidth;
    rightPaddleX = width - paddleWidth * 2;

    // Centra le racchette verticalmente all'inizio
    leftPaddleY = height / 2 - paddleHeight / 2;
    rightPaddleY = height / 2 - paddleHeight / 2;

    // Inizializza la posizione, la velocità e i colori
    resetBall();
}

function draw() {
    // Disegna un rettangolo semitrasparente con il colore di sfondo
    // per creare l'effetto scia nel colore complementare
    noStroke();
    fill(red(bgColor), green(bgColor), blue(bgColor), 25);
    rect(0, 0, width, height);

    // --- DISEGNA GLI ELEMENTI ---
    drawPaddles();
    drawBall();
    drawCenterLine();


    // --- AGGIORNA LA LOGICA DELL'ANIMAZIONE ---
    moveBall();
    moveLeftPaddle();
    moveRightPaddle();
}

// Funzione per disegnare la linea centrale tratteggiata
function drawCenterLine() {
    noStroke();
    // La linea centrale ora è del colore della palla per un contrasto migliore
    fill(red(ballColor), green(ballColor), blue(ballColor), 50);
    for (let i = 0; i < height; i += 20) {
        rect(width / 2 - 2, i, 4, 10);
    }
}


// Funzione per disegnare le racchette
function drawPaddles() {
    noStroke();
    // Le racchette ora sono del colore della palla
    fill(ballColor);
    rect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight);
    rect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight);
}

// Funzione per disegnare la palla con il suo colore attuale
function drawBall() {
    noStroke();
    fill(ballColor);
    ellipse(ballX, ballY, ballSize);
}

// Funzione per muovere la palla e gestire le collisioni
function moveBall() {
    // Aggiorna la posizione
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 1. Collisione con i bordi superiore e inferiore
    if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > height) {
        ballSpeedY *= -1; // Inverte la direzione verticale
        changeColors(); // Cambia colore all'impatto
    }

    // 2. Collisione con la racchetta sinistra
    if (ballX - ballSize / 2 < leftPaddleX + paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight) {
        
        if (ballSpeedX < 0) {
            ballSpeedX *= -1; // Inverte la direzione orizzontale
            changeColors(); // Cambia colore all'impatto
        }
    }

    // 3. Collisione con la racchetta destra
    if (ballX + ballSize / 2 > rightPaddleX &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight) {
        
        if (ballSpeedX > 0) {
            ballSpeedX *= -1; // Inverte la direzione orizzontale
            changeColors(); // Cambia colore all'impatto
        }
    }

    // 4. Gestione uscita palla
    if (ballX < 0 || ballX > width) {
        resetBall();
    }
}

// Funzione per muovere la racchetta sinistra (automatica)
function moveLeftPaddle() {
    let targetY = ballY - paddleHeight / 2;
    leftPaddleY += (targetY - leftPaddleY) * 0.08;
    leftPaddleY = constrain(leftPaddleY, 0, height - paddleHeight);
}


// Funzione per muovere la racchetta destra (automatica)
function moveRightPaddle() {
    let targetY = ballY - paddleHeight / 2;
    rightPaddleY += (targetY - rightPaddleY) * 0.08;
    rightPaddleY = constrain(rightPaddleY, 0, height - paddleHeight);
}

// Funzione per resettare la palla al centro
function resetBall() {
    ballX = width / 2;
    ballY = height / 2;
    
    ballSpeedX = random() > 0.5 ? 4 : -4;
    ballSpeedY = random(-2, 2);

    changeColors();
}

// Funzione per cambiare il colore della palla e dello sfondo
function changeColors() {
    // Sceglie un colore vivace e casuale per la palla
    let r = random(100, 255);
    let g = random(100, 255);
    let b = random(100, 255);
    ballColor = color(r, g, b);

    // Calcola e imposta il colore complementare per lo sfondo
    bgColor = color(255 - r, 255 - g, 255 - b);
}
