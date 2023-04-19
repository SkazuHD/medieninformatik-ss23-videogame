class zomboy extends Phaser.Physics.Arcade.Sprite {
  health = 200;
  damage = 10;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  update() {
    var angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    var velocity = this.scene.physics.velocityFromRotation(
      angle,
      Phaser.Math.Between(200, 250)
    );
    this.setVelocity(velocity.x, velocity.y);
  }
  hit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      console.log("zombie dead");
      this.destroy();
    }
  }
}
