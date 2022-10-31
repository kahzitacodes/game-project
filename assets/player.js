export class Player {
	constructor(game) {
		this.game = game;
		this.width = 100;
		this.height = 91.3;
		this.x = 0;
		this.y = this.game.height - this.height;
		this.image = document.getElementById("player");
		this.vy = 0;
		this.weight = 1;
		this.speed = 0;
		this.maxSpeed = 5;
	}

	update(input) {
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
		if (input.includes("ArrowUp") && this.onGround()) {
			this.vy -= 25;
		}
		this.y += this.vy;
		if (!this.onGround()) {
			this.vy += this.weight;
		} else this.vy = 0;
	}

	draw(context) {
		context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
	}

	onGround() {
		return this.y >= this.game.height - this.height;
		// return true if player is on the gound and false if it's in the air
	}
}
