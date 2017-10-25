// import pixi, p2 and phaser ce
import "pixi";
import "p2";
import * as Phaser from "phaser-ce";
import { Menu } from './Menu';
import { Play } from './Play';
import { GlobalVars } from './globalVars';

/**
 * Main entry game
 * @export
 * @class Game
 * @extends {Phaser.Game}
 */
export class Game extends Phaser.Game {

  stage: Phaser.Stage;

  constructor(public globalVars: GlobalVars) {
    // call parent constructor
    super(800, 600, Phaser.AUTO, 'game');

    //Load from storage
    this.globalVars.restore().then(() => {
      this.state.add('preload', this.preload);

      // add some game states
      this.state.add('Menu', Menu);
      this.state.add('Play', Play);
      //    this.state.add('Title', Title);
      //    this.state.add('Achievements', Achievements);

      // start with boot state
      //    this.state.start('Menu');
      this.state.start('Play');
    });
  }

  preload() {
    PIXI.Sprite.defaultAnchor.x = 0.5;
    PIXI.Sprite.defaultAnchor.y = 0.5;
  }

}
