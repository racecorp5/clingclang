import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { worlds } from '../game/game.config';
import bigInt from 'big-integer'; //https://www.npmjs.com/package/big-integer
import { upgradeData } from './upgradeData';

@Injectable()
export class GlobalVars {

  money: any;
  level: number;
  worldLevel: any;
  upgrades = upgradeData;

  constructor(public storage: Storage) {
    //testing
    //this.set('level', 0);
    //this.save();
    this.storage.remove('data');
  }

  /*
   * Save worldLevel && upgrades to localstorage
   */
  save() {
    let obj = {
      money: this.money,
      level: this.level,
      upgrades: this.upgrades
    };
    var encoded = btoa(JSON.stringify(obj));
    this.storage.remove('data');
    this.storage.set('data', encoded);
    //    console.log({ saved: obj });
  }

  /*
   * Restore worldLevel && upgrades to localstorage
   */
  restore() {
    return this.storage.get('data').then(
      (value) => {
        let obj = JSON.parse(atob(value));
        //        console.log({ retrieved: obj });
        this.money = bigInt(obj.money);
        this.level = obj.level || 0;
        this.upgrades = obj.upgrades;
        this.worldLevel = worlds[this.level];
        return true;
      }
    ).catch(
      () => {
        this.money = bigInt(0);
        this.level = 0;
        this.upgrades = upgradeData;
        this.worldLevel = worlds[this.level];
        return false;
      }
      );
  }

  get(name) {
    return this[name];
  }

  getUpgrade(upgrade) {
    return this.upgrades[upgrade.type][upgrade.index];
  }

  set(name, value) {
    this[name] = value;
  }

  /*
   * Reset the game and goto next world
   */
  reset() {

  }

  addMoney(x) {
    this.money = this.money.plus(x);
  }

  subtractMoney(x) {
    this.money = this.money.subtract(x);
  }

  getMoney() {
    return this.money.toString();
  }

  purchase(upgrade) {
    let thisUpgrade = this.getUpgrade(upgrade);
    let cost = this.getUpgradeCost(thisUpgrade);

    if (this.money.greaterOrEquals(cost)) {
      thisUpgrade.level += 1;
      this.subtractMoney(cost);
    }
    this.save();
  }

  getUpgradeCost(upgrade) {
    let cost = Math.round(upgrade.initialCost * upgrade.coefficient ** upgrade.level);
    return cost;
  }

  getMultiplier() {
    let multiplierUpgrade = this.getUpgrade({ type: "minor", index: 1 });
    let multiplier = (multiplierUpgrade.level + 1) * multiplierUpgrade.multiplierBase * this.get('worldLevel').multiplier;

    let debug = {
      world: this.get('worldLevel').multiplier,
      upg: (multiplierUpgrade.level + 1) * multiplierUpgrade.multiplierBase,
      total: multiplier
    }
    console.log(debug);

    return multiplier;
  }
}
