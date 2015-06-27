var timer = 0;
var FPS = 60;
var WIDTH;
var HEIGHT;

/* CANVAS ---------*/
var canvas = $("#particles")[0];
var ctx = canvas.getContext("2d");

/* FIREFLIES ---------*/
var fireflies = [];

var maxLifetime = 20; // in seconds
var minLifetime = 10;

var maxSize = 10;
var minSize = 2;

var maxSpeed = 60;
var minSpeed = 30;

var maxVarianceX = 50;
var firefliesNb = 200;
var firefliesColors = ["255, 255, 255", "250, 230, 235"];


//===============================
// MAIN INITIALIZATION
document.addEventListener("DOMContentLoaded", function() {
//===============================
	setSizes();
	window.addEventListener('resize', setSizes);

  	initParticles();
});

function initParticles() {
	// Fireflies
	for(var i = 0; i < firefliesNb; i++)
		fireflies[i] = new Firefly();

	// Draw the canvas
	draw();
}

function setSizes() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	canvas.setAttribute('width', WIDTH);
	canvas.setAttribute('height', HEIGHT);
}


//===============================
// FIREFLY CLASS
function Firefly() {
//===============================
	this.x;
	this.varianceX;
	this.y;

	this.size;
	this.speed;
	this.opacity;
	this.color;
	
	this.lifetime;
	this.starttime;

	this.init = function() {
		this.size = parseFloat(getRandomArbitrary(minSize, maxSize).toFixed(2));
		this.speed = parseFloat(getRandomArbitrary(minSpeed, maxSpeed).toFixed(2));
		this.opacity = parseFloat(getRandomArbitrary(.25, .75).toFixed(2));
		this.color = firefliesColors[Math.round(Math.random())];

		this.x = parseFloat((Math.random() * WIDTH).toFixed(2));
		this.varianceX = parseFloat(getRandomArbitrary(0, maxVarianceX).toFixed(2));
		this.y = HEIGHT + parseFloat(getRandomArbitrary(this.size, this.size * 100).toFixed(2));

		this.lifetime = getRandomInt(minLifetime, maxLifetime);
		this.starttime = timer / 60;
	}

	this.draw = function() {
		this.x += Math.cos(timer / FPS) * this.varianceX / FPS;
		this.y -= this.speed / FPS;

		this.currentTime = (timer / FPS) - this.starttime;
		var timePercentage = this.currentTime * 100 / this.lifetime;
		this.opacity = .75 - (timePercentage / 100) * .75;

		if(this.currentTime >= this.lifetime) this.init();

		ctx.beginPath();
	  	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
	  	ctx.closePath();

	  	ctx.save();
	  	ctx.globalCompositeOperation = "overlay";
	  	ctx.fillStyle = 'rgba('+this.color+','+this.opacity+')';
	  	ctx.fill();
	  	ctx.restore();
	}

	this.init();
}


//===============================
// CANVAS DRAWING
function draw() {
//===============================
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	timer = requestAnimationFrame(draw);

	// Fireflies
	for(var i = 0; i < firefliesNb; i++)
		fireflies[i].draw();
}


//===============================
// TOOLBOX
//===============================
/* http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range */
/*Returns a random number between min (inclusive) and max (exclusive) */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/* Returns a random integer between min (inclusive) and max (inclusive)
   Using Math.round() will give you a non-uniform distribution! */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}