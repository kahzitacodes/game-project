import {Sitting, Running, Jumping, Falling} from "./playerStates.js";

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
		this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)];
		this.currentState = this.states[0];
		this.currentState.enter();
	}

	update(input, deltaTime) {
		this.currentState.handleInput(input);

		// horizontal moviment
		this.x += this.speed;

		if (input.includes("ArrowRight")) {
			this.speed = this.maxSpeed;
		} else if (input.includes("ArrowLeft")) {
			this.speed = -this.maxSpeed;
		} else {
			this.speed = 0;
		}

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

		// sprite animation
		if (this.frameTimer > this.frameInterval) {
			this.frameTimer = 0;
			if (this.frameX < this.maxFrame) {
				this.frameX++;
				console.log(this.maxFrame);
			} else {
				this.frameX = 0;
			}
		} else {
			this.frameTimer += deltaTime;
		}
	}

	draw(context) {
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
}