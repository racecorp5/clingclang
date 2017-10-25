export class Chip extends Phaser.Sprite {
  game: Phaser.Game;
  speed: number;
  x: number;
  y: number;

  constructor(game, x, y, key, frame = 0, speed, scale) {
    super(game, x, y, key, frame);
    this.game.add.existing(this);
    this.anchor.set(.5);
    this.game.physics.p2.enable(this);
    this.smoothed = true;
    this.body.setCircle(10);
    this.scale.x = 1 / scale;
    this.scale.y = 1 / scale;
    this.speed = speed;
  }


  update() {
    if (this.body.velocity.x < 1 && this.body.velocity.x > -1) this.body.velocity.x += this.game.rnd.integerInRange(-1, 1) * 20;
  }

}
