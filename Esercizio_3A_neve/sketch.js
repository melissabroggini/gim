// Array per contenere tutti gli oggetti fiocco di neve
let snowflakes = [];
// Numero totale di fiocchi di neve
const numberOfSnowflakes = 400;

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Crea tutti i fiocchi di neve e aggiungili all'array
	for (let i = 0; i < numberOfSnowflakes; i++) {
		snowflakes.push(new Snowflake());
	}
}

function draw() {
	// Sfondo blu scuro per un'atmosfera notturna
	background(20, 40, 80);

	// Aggiorna e disegna ogni fiocco di neve nell'array
	// Usiamo un ciclo for...of per una sintassi più pulita
	for (let flake of snowflakes) {
		flake.update();
		flake.display();
	}
}

// La classe Snowflake definisce come ogni singolo fiocco di neve si comporta e appare
class Snowflake {
	// Il costruttore imposta le proprietà iniziali di un nuovo fiocco di neve
	constructor() {
		// Assegna una posizione x casuale all'interno della larghezza della finestra
		this.x = random(width);
		// Assegna una posizione y casuale sopra l'area visibile, in modo che appaiano cadere dall'alto
		this.y = random(-height, 0);
		// Assegna una dimensione casuale
		this.size = random(10, 25);
		// Velocità di caduta verticale
		this.speedY = random(1, 3);
		// Leggero movimento orizzontale per simulare il vento
		this.speedX = random(-1, 1);
		// Scegli un carattere casuale per rappresentare il fiocco di neve
		this.char = random(["✽", "✲", "✳", "✺", "❋", "∗"]);
	}

	// Il metodo update gestisce il movimento
	update() {
		// Aggiorna la posizione del fiocco
		this.x += this.speedX;
		this.y += this.speedY;

		// Se un fiocco esce dai lati, fallo riapparire dall'altro lato
		if (this.x > width + this.size) {
			this.x = -this.size;
		}
		if (this.x < -this.size) {
			this.x = width + this.size;
		}

		// Se un fiocco di neve supera il fondo dello schermo, lo resettiamo in cima
		if (this.y > height + this.size) {
			this.reset();
		}
	}

	// Resetta un fiocco di neve riportandolo in cima allo schermo
	reset() {
		this.x = random(width);
		this.y = -this.size; // Lo posiziona appena sopra il bordo superiore
		this.speedY = random(1, 3);
		this.speedX = random(-1, 1);
	}

	// Il metodo display disegna il fiocco di neve sullo schermo
	display() {
		fill(255, 255, 255, 220); // Bianco semi-trasparente
		noStroke();
		textSize(this.size);
		textAlign(CENTER, CENTER);
		text(this.char, this.x, this.y);
	}
}

// Questa funzione viene chiamata automaticamente quando la finestra del browser viene ridimensionata
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	// Quando la finestra viene ridimensionata, resettiamo l'intera animazione
	// per evitare comportamenti strani e riempire il nuovo spazio.
	snowflakes = [];
	for (let i = 0; i < numberOfSnowflakes; i++) {
		snowflakes.push(new Snowflake());
	}
}

/*
Simboli per i fiocchi di neve:
*✺✱✳✲✽❋☸⧆⊛⁕⁎﹡∗
*/
