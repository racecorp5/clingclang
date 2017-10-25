import { Game } from './game'
import { Chip } from './Chip';
import { LabelButton } from './LabelButton';

export class Play extends Phaser.State {

  gamePanel: any;
  upgradePanel: any;
  bucketPanel: any;
  otherPanel: any;;
  moneyPanel: any;

  worldLevel: any;
  money: Phaser.Text;
  spacer: number = 20;
  gameSize = new Phaser.Point(600, 500);

  auto: Phaser.Sprite;
  autoGroup: Phaser.Group;
  autoCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  chipGroup: Phaser.Group;
  chipCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  pegGroup: Phaser.Group;
  pegCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  buttonGroup: any[] = [];

  constructor(public game: Game) {
    super();
    this.worldLevel = this.game.globalVars.worldLevel;

    //Testing
    this.test();
  }

  preload() {
    this.game.load.image("bucket", "assets/images/bucket.png");
    //    this.game.load.image("border", "assets/images/border.png");
    this.game.load.image("chip1", "assets/images/chip1.png");
    this.game.load.image("chip2", "assets/images/chip2.png");
    this.game.load.image("peg1", "assets/images/peg1.png");
    //    this.game.load.image("peg2", "assets/images/peg2.png");
    this.game.load.image("button", "assets/images/Button.png");
    this.game.load.image("button2", "assets/images/Button2.png");
    this.game.load.image("auto", "assets/images/Auto.png");

    game.load.spritesheet('mummy', 'assets/imahes/Mummy.png', 37, 45, 18);

  }

  create() {
    // Enable P2JS physics
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0.9;
    this.game.physics.p2.gravity.y = this.worldLevel.gravity;

    //CollisionGroups
    this.game.physics.p2.setImpactEvents(true);
    this.chipCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.autoCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.pegCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.game.physics.p2.updateBoundsCollisionGroup();

    //Create the objects
    this.createDisplay();
    this.createAuto();
    this.createBorder();
    this.createPegs();

    this.chipGroup = this.game.add.group();
    this.autoGroup = this.game.add.group();
  }

  createChip() {
    //Start at 3
    let max = this.game.globalVars.getUpgrade({ type: "minor", index: 0 }).level + 3;

    if (this.chipGroup.length >= max) return;
    this.chipGroup.enableBody = true;
    this.chipGroup.physicsBodyType = Phaser.Physics.P2JS;
    let x = this.input.position.x;
    if (x > this.gameSize.x - this.spacer) x = this.gameSize.x - this.spacer;
    if (x < this.spacer) x = this.spacer;


    let chip = new Chip(this.game, x, 20, "chip" + this.game.rnd.integerInRange(1, 2), 0, 10, this.worldLevel.scale);
    chip.anchor.x = 0.5;
    chip.anchor.y = 0.5;

    chip.body.setCollisionGroup(this.chipCollisionGroup);
    chip.body.collides(this.pegCollisionGroup, this.hitPeg, this);
    chip.body.collides([this.chipCollisionGroup, this.autoCollisionGroup]);
    this.chipGroup.add(chip);
  }

  createBorder() {
    //Set the top, right, and left bounds
    this.game.physics.p2.setBounds(
      this.spacer, this.spacer, this.gameSize.x - this.spacer, this.gameSize.y - this.spacer,
      true, true, true, false
    );
  }

  createPegs() {
    this.pegGroup = this.game.add.group();
    this.pegGroup.enableBody = true;
    this.pegGroup.physicsBodyType = Phaser.Physics.P2JS;

    let pegRows = this.worldLevel.pegRows;
    for (let row = 1; row < pegRows + 1; row++) {
      let pegCols = this.worldLevel.pegCols;
      let offset = 0;
      if (row % 2) {
        pegCols = this.worldLevel.pegCols + 1;
        offset = this.gameSize.x / this.worldLevel.pegCols / 2;
      }
      for (let col = 1; col < pegCols; col++) {
        let yOffset = 10;
        let peg = this.pegGroup.create(
          (this.gameSize.x / this.worldLevel.pegCols * col) - offset,
          (this.gameSize.y - yOffset) * row / this.worldLevel.pegRows - yOffset,
          "peg"
        );
        peg.anchor = { x: .5, y: .5 };
        peg.body.static = true;
        peg.body.setCollisionGroup(this.pegCollisionGroup);
        peg.body.collides([this.chipCollisionGroup, this.autoCollisionGroup]);
      }
    }
  }

  createDisplay() {
    let spacing = 10;
    let round = 20;
    let moneyPanelHeight = 60;
    let color = "0xAAAAAA";

    // Panels
    let firstXBreak = this.game.width - this.gameSize.x - spacing * 3;
    let firstYBreak = this.game.height - this.gameSize.y - spacing * 3;

    this.gamePanel = this.game.add.graphics(spacing, spacing);
    this.gamePanel.beginFill(color, 1);
    this.gamePanel.drawRoundedRect(0, 0, this.gameSize.x, this.gameSize.y, round);
    this.gamePanel.inputEnabled = true;
    this.gamePanel.input.useHandCursor = true;
    this.gamePanel.events.onInputDown.add(this.createChip, this);

    this.bucketPanel = this.game.add.graphics(spacing, this.gameSize.y + spacing * 2);
    this.bucketPanel.beginFill(color, 1);
    this.bucketPanel.drawRoundedRect(0, 0, this.gameSize.x, firstYBreak, round);

    this.upgradePanel = this.game.add.graphics(this.gameSize.x + spacing * 2, moneyPanelHeight + spacing * 2);
    this.upgradePanel.beginFill(color, 1);
    this.upgradePanel.drawRoundedRect(0, 0, firstXBreak, this.gameSize.y - moneyPanelHeight - spacing, round);

    this.otherPanel = this.game.add.graphics(this.gameSize.x + spacing * 2, this.gameSize.y + spacing * 2);
    this.otherPanel.beginFill(color, 1);
    this.otherPanel.drawRoundedRect(0, 0, firstXBreak, firstYBreak, round);

    this.moneyPanel = this.game.add.graphics(this.gameSize.x + spacing * 2, spacing);
    this.moneyPanel.beginFill(color, 1);
    this.moneyPanel.drawRoundedRect(0, 0, firstXBreak, moneyPanelHeight, round);


    //Upgrade Buttons
    let buttonStart = 120;
    let buttonXSpacing = 75;
    let buttonYSpacing = 55;
    let majorMinorSpacing = 240;
    let padding = 10;
    let buttonWidth = 70;
    let font = { font: "15px Arial", fill: "#ff0044", align: "center" };
    let subfont = { font: "10px Arial", fill: "#ff00ff", align: "center" };
    //Minor
    this.game.globalVars.upgrades.minor.forEach((upgrade, i) => {
      let btn = new LabelButton(this.game, this.gameSize.x + buttonXSpacing, buttonStart + (buttonYSpacing * i), 'button', this.upgrade, this, 0, 0, 0, 0, upgrade.name, upgrade.level, upgrade.description);
      btn.data = { index: i, type: 'minor' };
      this.buttonGroup.push(btn);
    });
    console.log(this.buttonGroup);
    //Major
    this.game.globalVars.upgrades.major.forEach((upgrade, i) => {
      let btn = new LabelButton(this.game, this.gameSize.x + buttonXSpacing, buttonStart + majorMinorSpacing + (buttonYSpacing * i), 'button', this.upgrade, this, 0, 0, 0, 0, upgrade.name, upgrade.level, upgrade.description);
      btn.data = { index: i, type: 'major' };
    });

    //Bucket Buttons
    let pegRows = this.worldLevel.pegRows;
    let pegCols = this.worldLevel.pegCols + 1;
    let offset = this.gameSize.x / this.worldLevel.pegCols / 2;
    let yOffset = 40;
    let bucketYOffset = 40;

    if (pegRows % 2) {
      pegCols = this.worldLevel.pegCols;
      offset = 0;
    }
    for (let col = 1; col < pegCols; col++) {

      let bucket = this.game.add.sprite(
        (this.gameSize.x / this.worldLevel.pegCols * col) - offset,
        this.gameSize.y - bucketYOffset,
        "bucket"
      );

      let btn = this.game.add.button(
        (this.gameSize.x / this.worldLevel.pegCols * col) - offset,
        this.gameSize.y + yOffset,
        "button2",
        this.upgrade,
        this
      );
      btn.scale = new Phaser.Point(.4, .4);
      btn.data = { index: col - 1, type: 'bucket' };
    }


    /*
    let pegRows = this.worldLevel.pegRows;
    for (let row = 1; row < pegRows + 1; row++) {
      let pegCols = this.worldLevel.pegCols;
      let offset = 0;
      if (row % 2) {
        pegCols = this.worldLevel.pegCols + 1;
        offset = this.gameSize.x / this.worldLevel.pegCols / 2;
      }
      for (let col = 1; col < pegCols; col++) {
        let yOffset = 10;
        let peg = this.pegGroup.create(
          (this.gameSize.x / this.worldLevel.pegCols * col) - offset,
          (this.gameSize.y - yOffset) * row / this.worldLevel.pegRows - yOffset,
          "peg"
        );
        peg.anchor = { x: .5, y: .5 };
        peg.body.static = true;
        peg.body.setCollisionGroup(this.pegCollisionGroup);
        peg.body.collides([this.chipCollisionGroup, this.pegCollisionGroup]);
      }
    }
    */
    //Other Buttons

    //money
    var style = { font: "bold 20px Arial", fill: "#055", boundsAlignH: "center", boundsAlignV: "middle" };
    this.money = this.game.add.text(this.gameSize.x + 100 + spacing, spacing * 4, "2000.5 AAAA", style);
    this.money.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  }

  createAuto() {
    this.auto = this.game.add.sprite(this.spacer * 2, this.spacer * 2, "auto");
    this.game.physics.p2.enable(this.auto);
    this.auto.body.static = true;
    this.auto.body.velocity.x = 150;

    //  Create our Timer
    let timer = this.game.time.create(false);
    timer.loop(500, this.autoDrop, this);
    timer.start();
  }

  hitBottom(chip, y) {
    if (chip.y > y) {
      chip.destroy();

      chip.x;

      let addedMoney = 1000 * this.game.globalVars.getMultiplier();
      console.log(addedMoney);
      this.game.globalVars.addMoney(Math.round(addedMoney / 100));
    }
  }

  hitPeg(chip, other) {
    let addedMoney = 100 * this.game.globalVars.getMultiplier();
    //this.game.globalVars.addMoney(Math.round(addedMoney / 100));
  }

  upgrade(thing) {
    this.game.globalVars.purchase(thing.data);
  }


  autoDrop() {
    //Start at 3
    let max = 100;
    if (this.autoGroup.length >= max) return;

    this.autoGroup.enableBody = true;
    this.autoGroup.physicsBodyType = Phaser.Physics.P2JS;
    let x = this.auto.position.x;
    if (x > this.gameSize.x - this.spacer) x = this.gameSize.x - this.spacer;
    if (x < this.spacer) x = this.spacer;

    let auto = new Chip(this.game, x, 60, "chip" + this.game.rnd.integerInRange(1, 2), 0, 10, this.worldLevel.scale);
    auto.anchor.x = 0.5;
    auto.anchor.y = 0.5;

    auto.body.setCollisionGroup(this.autoCollisionGroup);
    auto.body.collides(this.pegCollisionGroup, this.hitPeg, this);
    auto.body.collides([this.autoCollisionGroup, this.chipCollisionGroup]);
    this.autoGroup.add(auto);
  }

  update() {
    //Show money
    this.autoGroup.forEach(this.hitBottom, this, true, this.gameSize.y);
    this.chipGroup.forEach(this.hitBottom, this, true, this.gameSize.y);
    this.money.setText(this.game.globalVars.getMoney());

    //Show costs
    this.buttonGroup.forEach((btn) => {
      let upgrade = this.game.globalVars.getUpgrade(btn.data);
      btn.setLabel(this.game.globalVars.getUpgradeCost(upgrade));
    });

    //Move auto
    if (this.auto.visible && (this.auto.x > this.gameSize.x - (this.spacer * 2) || this.auto.x < this.spacer * 2)) {
      this.auto.body.velocity.x *= -1;
    }
  }


  render() {
    //debug helper
    //let rect = new Phaser.Rectangle(this.spacer, this.spacer, this.gameSize.x - this.spacer, this.gameSize.y - this.spacer);
    //this.game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 20, 20, 'yellow', 'Segoe UI');
    //this.game.debug.geom(rect);
    //let chip = this.chips[this.chips.length - 1];
    //if (chip && chip.alive) {
    //      this.game.debug.bodyInfo(chip, 32, 32);
    //      this.game.debug.body(chip);
    //this.game.debug.spriteInfo(chip, 32, 32);
    //this.game.debug.spriteBounds(chip);
    //}
    //this.game.debug.spriteBounds(this.pegs[10]);
    //this.game.debug.geom(this.borders[0]);

  }

  test() {
    //    this.game.debug.stop();
    //    let level = this.game.globalVars.get('level');
    //    level += 2;
    //    this.game.globalVars.set('level', level);
    //    this.game.globalVars.save();
  }
}
