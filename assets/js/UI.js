export class UI {
	constructor(game) {
		this.game = game;
		this.fontSize = 25;
		this.fontFamily = "Bebas Neue";
		this.livesImage = document.getElementById("live");
	}

	draw(context) {
		context.font = this.fontSize + "px " + this.fontFamily;
		context.textAlign = "left";
		context.fillStyle = this.game.fontColor;

		// score
		context.fillText("Score: " + this.game.score, 20, 40);

		// timer
		context.font = this.fontSize + "px " + this.fontFamily;
		context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 150, 40);

		//lives
		context.fillText("x " + this.game.lives, this.game.width - 45, 38);

		context.drawImage(this.livesImage, this.game.width - 75, 20, 20, 20);
		// game over message
		if (this.game.gameOver) {
			context.textAlign = "center";
			context.font = this.fontSize * 2 + "px " + this.fontFamily;

			if (this.game.score > this.game.winningScore && this.game.lives >= 1) {
				context.fillText("Game Over", this.game.width * 0.5, this.game.height * 0.5 - 30);
				context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
				context.fillText("You played well!!", this.game.width * 0.5, this.game.height * 0.5);
			} else {
				context.fillText("Game Over", this.game.width * 0.5, this.game.height * 0.5 - 30);
				context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
				context.fillText("Better luck next time!", this.game.width * 0.5, this.game.height * 0.5);
			}
		}
	}
}
