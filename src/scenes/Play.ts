import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  isFiring = false;
  ship1?: Phaser.GameObjects.Shape;
  ship2?: Phaser.GameObjects.Shape;
  ship3?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 20; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(100, 450, 30, 30, 0xff0000);
    this.ship1 = this.add.rectangle(640, 50, 50, 30, 0xffff00);
    this.ship2 = this.add.rectangle(600, 100, 50, 30, 0xffff00);
    this.ship3 = this.add.rectangle(560, 150, 50, 30, 0xffff00);
  }

  update(_timeMs: number, delta: number) {
    this.ship1!.x -= delta * this.rotationSpeed;
    if (this.ship1!.x < 0) {
      this.ship1!.x = 640;
    }
    this.ship2!.x -= delta * this.rotationSpeed;
    if (this.ship2!.x < 0) {
      this.ship2!.x = 640;
    }
    this.ship3!.x -= delta * this.rotationSpeed;
    if (this.ship3!.x < 0) {
      this.ship3!.x = 640;
    }

    this.starfield!.tilePositionX -= 4;

    if (this.fire!.isDown) {
      this.isFiring = true;
    }

    if (this.isFiring) {
      // Move the spinner upward
      this.spinner!.y -= delta * this.rotationSpeed;

      // Check if the spinner has reached the top of the screen
      if (this.spinner!.y <= 0) {
        this.isFiring = false; // Stop moving upward when reaching the top
        this.spinner!.y = 450; // Teleport back down after reached the top
      }
    } else {
      // Allowing left and right movement when not firing
      if (this.left!.isDown) {
        this.spinner!.x -= delta * this.rotationSpeed;
        this.spinner!.x = Phaser.Math.Clamp(this.spinner!.x, 0, 640);
      }

      if (this.right!.isDown) {
        this.spinner!.x += delta * this.rotationSpeed;
        this.spinner!.x = Phaser.Math.Clamp(this.spinner!.x, 0, 640);
      }
    }
  }
}