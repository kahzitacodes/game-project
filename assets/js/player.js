import {Sitting, Running, Jumping, Falling, Rolling, Diving, Hit, Idle} from "./playerStates.js";
import {CollisionAnimation} from "./collisionAnimation.js";

export class Player {
	constructor(game) {
		this.game = game;
		this.width = 100;
		this.height = 91.3;
		this.x = 0;
		this.y = this.game.height - this.height - this.game.groundMargin;
		this.image = document.getElementById("player");
		this.frameX = 0;
		this.frameY = 0;
		this.maxFrame = 0;
		this.fps = 20;
		this.frameInterval = 1000 / this.fps;
		this.frameTimer = 0;
		this.vy = 0;
		this.weight = 1;
		this.speed = 0;
		this.maxSpeed = 10;
		this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this), new Rolling(this), new Diving(this), new Hit(this), new Idle(this)];
		this.currentState = this.states[7];
		this.currentState.enter();
		this.hit = false;
	}

	update(input, deltaTime) {
		this.checkCollision();
		this.currentState.handleInput(input);

		// horizontal moviment
		this.x += this.speed;

		if (input.includes("ArrowRight") && this.currentState !== this.states[6]) {
			this.speed = this.maxSpeed;
		} else if (input.includes("ArrowLeft") && this.currentState !== this.states[6]) {
			this.speed = -this.maxSpeed;
		} else {
			this.speed = 0;
		}

		// horizontal bondaries
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x > this.game.width - this.width) {
			this.x = this.game.width - this.width;
		}

		//vertical moviment
		this.y += this.vy;
		if (!this.onGround()) {
			this.vy += this.weight;
		} else this.vy = 0;

		// horizontal bondaries
		if (this.y > this.game.height - this.height - this.game.groundMargin) {
			this.y = this.game.height - this.height - this.game.groundMargin;
		}

		// sprite animation
		if (this.frameTimer > this.frameInterval) {
			this.frameTimer = 0;
			if (this.frameX < this.maxFrame) {
				this.frameX++;
			} else {
				this.frameX = 0;
			}
		} else {
			this.frameTimer += deltaTime;
		}
	}

	draw(context) {
		if (this.game.debug) {
			context.strokeRect(this.x, this.y, this.width, this.height);
		}
		context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
	}

	// return true if player is on the gound and false if it's in the air
	onGround() {
		return this.y >= this.game.height - this.height - this.game.groundMargin;
	}

	setState(stateIndex, speed) {
		this.currentState = this.states[stateIndex];
		this.game.speed = this.game.maxSpeed * speed;
		this.currentState.enter();
	}

	checkCollision() {
		this.game.enemies.forEach((enemy) => {
			this.hit = enemy.x < this.x + this.width && enemy.x + enemy.width > this.x && enemy.y < this.y + this.height && enemy.y + enemy.height > this.y;
			if (this.hit) {
				if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
					enemy.willBeDeleted = true;
					this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
					this.game.score += 8;
				} else {
					this.setState(6, 0);
					this.x -= 80;
					this.game.score -= 5;
					this.game.lives--;

					if (this.game.lives <= 0) {
						this.game.gameOver = true;
					}
				}
			}
		});
	}
}
