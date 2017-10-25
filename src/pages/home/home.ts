import { Component } from '@angular/core';
import { GlobalVars } from '../../game/globalVars';

import { Game } from '../../game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**
   * Game instance
   * @private
   * @type {Game}
   * @memberof HomePage
   */
  private gameInstance: Game;

  /**
   * Creates an instance of HomePage.
   * @param {NavController} navCtrl
   * @memberof HomePage
   */
  constructor(public globalVars: GlobalVars) {
    this.gameInstance = new Game(this.globalVars);
  }
}
