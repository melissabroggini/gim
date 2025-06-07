// Array per contenere gli oggetti "goccia di pioggia"
let drops = [];
const totalDrops = 400; // Numero totale di gocce per l'animazione

// Funzione eseguita una sola volta all'avvio
function setup() {
    // Crea un canvas che copre l'intera finestra del browser
    createCanvas(windowWidth, windowHeight);
    
    // Inizializza le gocce di pioggia, creando oggetti con posizione, lunghezza e velocità
    for (let i = 0; i < totalDrops; i++) {
        drops.push({
            x: random(width),
            y: random(-height, 0), // Posiziona le gocce inizialmente sopra lo schermo
            len: random(15, 25),   // Lunghezza della goccia
            speed: random(8, 20)   // Velocità di caduta aumentata per un effetto più rapido
        });
    }
}

// Funzione chiamata automaticamente quando la finestra viene ridimensionata
function windowResized() {
    // Adatta le dimensioni del canvas alla nuova dimensione della finestra
    resizeCanvas(windowWidth, windowHeight);
}

// Funzione eseguita in loop continuo per creare l'animazione
function draw() {
    // --- Sfondo a Gradiente (Tramonto) ---
    let topColor = color(135, 206, 235);    // Celeste per la parte alta
    let bottomColor = color(255, 204, 102); // Giallo-arancio per la parte bassa

    // Disegna il gradiente come sfondo
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(topColor, bottomColor, inter);
        stroke(c);
        line(0, y, width, y);
    }

    // --- Animazione della Pioggia Realistica ---
    
    // Itera su ogni goccia per aggiornarla e disegnarla
    for (let drop of drops) {
        // Aggiorna la posizione verticale della goccia in base alla sua velocità
        drop.y += drop.speed;

        // Disegna la goccia
        strokeWeight(random(1, 2));
        stroke(255, 150); // Bianco con una certa trasparenza per un effetto più morbido
        line(drop.x, drop.y, drop.x, drop.y + drop.len);

        // Se la goccia esce dallo schermo, la riposiziona in alto per creare un ciclo
        if (drop.y > height) {
            drop.y = random(-200, -100); // La fa riapparire sopra lo schermo
            drop.x = random(width);      // A una nuova posizione orizzontale casuale
        }
    }
}
