import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  isFiring = false;

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
  }

  update(_timeMs: number, delta: number) {
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