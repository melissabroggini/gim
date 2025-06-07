// Array per contenere tutti gli oggetti cifra e particelle
let digits = [];
let particles = [];
let explodingDigits = []; // Array per le cifre che stanno esplodendo

// Palette di colori personalizzata
let palette = [
  '#005F73', '#0A9396', '#94D2BD',
  '#E9D8A6', '#EE9B00', '#CA6702', '#BB3E03',
  '#AE2012', '#9B2226'
];

let baseY; // La linea di "terra" su cui poggiano i numeri
let prevS = -1; // Tiene traccia del secondo precedente per rilevare il cambio di minuto

// Costanti per la fisica dell'animazione
const gravity = 0.5; // Mantenuta solo per le particelle
const restitution = 0.4;
const homingForceStrength = 0.02;

// Classe per le particelle
class Particle {
  constructor(x, y, pColor) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.lifespan = 255;
    this.color = color(pColor);
  }

  update() {
    this.vel.y += gravity * 0.1; // Le particelle sono ancora affette da una leggera gravità
    this.pos.add(this.vel);
    this.lifespan -= 5;
  }

  draw() {
    noStroke();
    this.color.setAlpha(this.lifespan);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

// Classe per rappresentare una singola cifra (aggiornata)
class Digit {
	constructor(value, baseX) {
		this.value = value;
		// Le nuove cifre appaiono sempre dall'alto
		this.pos = createVector(baseX, -80);
		this.vel = createVector(random(-2, 2), random(-2, 2));
		this.baseX = baseX;
		this.color = random(palette);
	}

	applyPhysics() {
        // La forza di ritorno ora agisce in 2D per creare l'effetto fluttuante
        let homePosition = createVector(this.baseX, baseY);
        let displacement = p5.Vector.sub(homePosition, this.pos);
        let returnForce = displacement.mult(homingForceStrength);
        this.vel.add(returnForce);
		
		this.pos.add(this.vel);
		
        // Smorzamento generale della velocità per evitare oscillazioni infinite
		this.vel.mult(0.96);
	}
    
    // Interazione con il mouse
    applyMouseForce() {
        let mouseVec = createVector(mouseX, mouseY);
        let diff = p5.Vector.sub(this.pos, mouseVec);
        let dist = diff.mag();
        if (dist < 80) { // Area di influenza del mouse aumentata
            let force = diff.setMag(80 / (dist + 1));
            this.vel.add(force);
        }
    }
    
    // Controlla se la cifra è uscita dallo schermo
    isOffscreen() {
        const margin = 100;
        return (this.pos.x < -margin || this.pos.x > width + margin || this.pos.y < -margin || this.pos.y > height + margin);
    }

    // Crea un'esplosione di particelle
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(this.pos.x, this.pos.y, this.color));
        }
    }

	draw(shakeIntensity = 0) {
        let x = this.pos.x;
        let y = this.pos.y;
        
        // Se c'è un'intensità di tremolio, applica un offset casuale
        if (shakeIntensity > 0) {
            x += random(-shakeIntensity, shakeIntensity);
            y += random(-shakeIntensity, shakeIntensity);
        }

		fill(this.color);
		text(this.value, x, y);
	}
	
	// Gestisce il cambio di valore durante il minuto
	updateValue() {
		this.color = random(palette);
        // Da un piccolo impulso quando cambia valore, senza ricrearlo
        this.vel.add(p5.Vector.random2D().mult(2));
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	textFont('monospace');
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	digits = []; 
}

function draw() {
    // Sfondo solido per una migliore leggibilità in modalità fluttuante
	background(20, 20, 30);

	const s = second();
	const m = minute();
	const h = hour();

    // Rileva se è il momento dell'esplosione (passaggio da 59 a 0 secondi)
    const isExplosionTime = prevS === 59 && s === 0;
	
	const timeValues = [
		floor(h / 10), h % 10, floor(m / 10), m % 10, floor(s / 10), s % 10
	];
    
    // Logica dell'esplosione
    if (isExplosionTime) {
        for (const d of digits) {
            d.vel.add(p5.Vector.random2D().mult(random(35, 50))); // Spinta più forte
            d.createParticles(60); // MODIFICATO: Più particelle all'esplosione
        }
        explodingDigits.push(...digits); // Aggiunge le vecchie cifre alla lista delle esplosioni
        digits = []; // Svuota l'array principale, forzando la rigenerazione
    }
	
	const minFontSize = min(width / 15, height / 7);
	const maxFontSize = min(width / 6, height / 3);
	const dynamicFontSize = map(s, 0, 59, minFontSize, maxFontSize);
	textSize(dynamicFontSize);

	baseY = height / 2;
	const charWidth = textWidth('0');
	
    // Rigenera le cifre se l'array è vuoto (dopo un'esplosione)
	if (digits.length === 0) {
        const colonWidth = textWidth(':');
        const digitSpacing = charWidth * 1.3;
        const totalWidth = (digitSpacing * 6) + (colonWidth * 2);
        let currentX = (width - totalWidth) / 2;

        for (let i = 0; i < 6; i++) {
            let digitBaseX = currentX + digitSpacing / 2;
			digits.push(new Digit(timeValues[i], digitBaseX));
            currentX += digitSpacing;
            if (i === 1 || i === 3) {
                currentX += colonWidth;
            }
		}
	}
    
    // Calcolo del layout (ora solo per aggiornare le posizioni target)
    const colonWidth = textWidth(':');
    const digitSpacing = charWidth * 1.3;
    const totalWidth = (digitSpacing * 6) + (colonWidth * 2);
    let currentX = (width - totalWidth) / 2;
    colonPositions = [];

    // H H : M M : S S
    digits[0].baseX = currentX + digitSpacing / 2;
    currentX += digitSpacing;
    digits[1].baseX = currentX + digitSpacing / 2;
    currentX += digitSpacing;
    
    colonPositions.push(createVector(currentX + colonWidth / 2, baseY - dynamicFontSize * 0.1));
    currentX += colonWidth;
    
    digits[2].baseX = currentX + digitSpacing / 2;
    currentX += digitSpacing;
    digits[3].baseX = currentX + digitSpacing / 2;
    currentX += digitSpacing;
    
    colonPositions.push(createVector(currentX + colonWidth / 2, baseY - dynamicFontSize * 0.1));
    currentX += colonWidth;
    
    digits[4].baseX = currentX + digitSpacing / 2;
    currentX += digitSpacing;
    digits[5].baseX = currentX + digitSpacing / 2;
    
    
    // AGGIORNAMENTO E DISEGNO PARTICELLE E CIFRE ESPLOSE
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
    for (let i = explodingDigits.length - 1; i >= 0; i--) {
        let d = explodingDigits[i];
        d.pos.add(d.vel); // Le cifre esplose non hanno fisica, solo velocità
        d.vel.mult(0.995); // Rallentano gradualmente
        d.draw();
        if (d.isOffscreen()) {
            explodingDigits.splice(i, 1);
        }
    }

    // NUOVO: Logica per l'effetto tremolio
    let shakeIntensity = 0;
    // MODIFICATO: Il tremolio inizia a 30 secondi dalla fine e aumenta
    if (s >= 30) {
        shakeIntensity = map(s, 30, 59, 0, 15); // Aumenta l'intensità in modo più graduale
    }

	// AGGIORNAMENTO E DISEGNO CIFRE PRINCIPALI
	for (let i = 0; i < digits.length; i++) {
        let d = digits[i];
		if (d.value !== timeValues[i]) {
			d.value = timeValues[i];
			d.updateValue(); 
		}

        d.applyMouseForce();
		d.applyPhysics();

		for (let j = i + 1; j < digits.length; j++) {
			handleCollision(d, digits[j], charWidth);
		}
	}
    
    // DISEGNO
	fill(255);
	for (const p of colonPositions) {
		text(':', p.x, p.y);
	}
	noStroke();
	for (const digit of digits) {
		digit.draw(shakeIntensity); // Passa l'intensità del tremolio
	}
    
    prevS = s;
}

function handleCollision(digitA, digitB, charWidth) {
	let delta = p5.Vector.sub(digitB.pos, digitA.pos);
	let distance = delta.mag();
	
	if (distance < charWidth && distance > 0) {
		let overlap = (charWidth - distance);
		let correction = delta.copy().setMag(overlap / 2);
		digitA.pos.sub(correction);
		digitB.pos.add(correction);

		let normal = delta.copy().normalize();
		let relativeVel = p5.Vector.sub(digitB.vel, digitA.vel);
		let impulseScalar = p5.Vector.dot(relativeVel, normal);

		if (impulseScalar > 0) return;
		
		let j = -(1 + restitution) * impulseScalar;
		let impulse = normal.mult(j);

		digitA.vel.sub(impulse);
		digitB.vel.add(impulse);
	}
}
