export class Menu extends Phaser.State {
  game: Phaser.Game;

  constructor() {
    super();
  }

  preload() {
    var text = "Menu!";
    var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
    this.game.add.text(100, 100, text, style);
  }

  create() {
    this.input.onTap.addOnce(this.titleClicked, this); // <-- that um, this is extremely important
  }

  titleClicked() {
    this.game.state.start('Play');
  }
}
