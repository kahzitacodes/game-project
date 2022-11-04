import {Player} from "./player.js";
import {InputHandler} from "./input.js";
import {Background} from "./background.js";
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from "./enemies.js";
import {UI} from "./UI.js";

window.addEventListener("load", function () {
	const canvas = document.getElementById("my-canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = 900;
	canvas.height = 500;

	class Game {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.groundMargin = 40;
			this.speed = 0;
			this.maxSpeed = 3;
			this.background = new Background(this);
			this.player = new Player(this);
			this.input = new InputHandler(this);
			this.UI = new UI(this);
			this.enemies = [];
			this.collisions = [];
			this.enemyTimer = 0;
			this.enemyInterval = 1200;
			this.fontColor = "white";
			this.debug = false;
			this.score = 0;
			this.winningScore = 500;
			this.time = 0;
			this.maxTime = 120000;
			this.gameOver = false;
			this.lives = 5;
		}

		update(deltaTime) {
			this.time += deltaTime;
			if (this.time > this.maxTime) {
				this.gameOver = true;
			}

			this.background.update();

			this.player.update(this.input.keys, deltaTime);

			// handle enemies
			if (this.enemyTimer > this.enemyInterval) {
				this.addEnemy();
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}
			this.enemies.forEach((enemy) => {
				enemy.update(deltaTime);
			});

			// handle collision sprites
			this.collisions.forEach((collision) => {
				collision.update(deltaTime);
			});

			this.enemies = this.enemies.filter((enemy) => !enemy.willBeDeleted);
			this.collisions = this.collisions.filter((collision) => !collision.willBeDeleted);
		}

		draw(context) {
			this.background.draw(context);
			this.player.draw(context);
			this.enemies.forEach((enemy) => {
				enemy.draw(context);
			});
			this.collisions.forEach((collision) => {
				collision.draw(context);
			});
			this.UI.draw(context);
		}

		addEnemy() {
			if (this.speed > 0 && Math.random() < 0.5) {
				this.enemies.push(new GroundEnemy(this));
			} else if (this.speed > 0) {
				this.enemies.push(new ClimbingEnemy(this));
			}

			this.enemies.push(new FlyingEnemy(this));
		}
	}

	const game = new Game(canvas.width, canvas.height);
	let lastTime = 0;

	function animate(timeStamp) {
		const button = document.getElementById("btn-play");
		const deltaTime = timeStamp - lastTime;
		//console.log(deltaTime);
		lastTime = timeStamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		game.update(deltaTime);
		game.draw(ctx);

		if (!game.gameOver) {
			requestAnimationFrame(animate);
		} else {
			button.addEventListener("click", () => {
				location.reload();
			});
			button.classList.add("show");
		}
	}

	animate(0);
});
