export class LabelButton extends Phaser.Button {
  game: Phaser.Game;

  buttonText: string; //Text over the actual button
  buttonTextObj: Phaser.Text;
  label: string; //Text next to the button I.E. price
  labelObj: Phaser.Text;
  description: string; //Description of the button under or tooltip
  descriptionObj: Phaser.Text;

  constructor(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, buttonText, label, description) {
    super(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
    this.game.add.existing(this);

    let style = { 'font': '12px Arial', 'fill': 'black' };
    this.buttonTextObj = new Phaser.Text(game, 0, 3, buttonText, style);
    this.addChild(this.buttonTextObj);

    this.labelObj = new Phaser.Text(game, 55, 3, label, style);
    this.labelObj.anchor = new Phaser.Point(0, .5);
    this.addChild(this.labelObj);

    this.descriptionObj = new Phaser.Text(game, 5 - this.width / 2, 18, description, style);
    this.descriptionObj.anchor = new Phaser.Point(0, 0);
    this.addChild(this.descriptionObj);
  }

  setLabel(label) {
    this.labelObj.setText('' + label);
  };

}
