class zomboy extends Phaser.Physics.Arcade.Sprite {
  health = 200;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  update() {
    var angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    var velocity = this.scene.physics.velocityFromRotation(angle, 200);
    this.setVelocity(velocity.x, velocity.y);
  }
  hit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
