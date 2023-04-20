class zomboy extends Phaser.Physics.Arcade.Sprite {
  health = 200;
  damage = 10;
  move = true;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  update() {
    if (this.move) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      var velocity = this.scene.physics.velocityFromRotation(
        angle,
        Phaser.Math.Between(200, 250)
      );
      this.body.setVelocity(velocity.x, velocity.y);
    } else {
      // Stop movement for 1 second
      this.body.setVelocity(
        Phaser.Math.Between(50, 200),
        Phaser.Math.Between(50, 200)
      );
      setTimeout(() => {
        this.move = true;
      }, Phaser.Math.Between(1000, 2000));
    }
  }
  hit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      console.log("zombie dead");
      this.destroy();
    }
  }
}
class zomboyRange extends Phaser.Physics.Arcade.Sprite {
  health = 250;
  damage = 10;
  move = true;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  update() {
    if (
      Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <
      Phaser.Math.Between(600, 1000)
    ) {
      this.move = false;
      console.log("PEW PEW");
    }
    if (this.move) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      var velocity = this.scene.physics.velocityFromRotation(
        angle,
        Phaser.Math.Between(200, 250)
      );
      this.body.setVelocity(velocity.x, velocity.y);
    } else {
      // Stop movement for 1 second
      this.body.setVelocity(0, 0);
      setTimeout(() => {
        this.move = true;
      }, Phaser.Math.Between(1000, 2000));
    }
  }

  hit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      console.log("zombie dead");
      this.destroy();
    }
  }
}
