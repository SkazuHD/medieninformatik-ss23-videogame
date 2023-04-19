class zomboy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  update() {
    var angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    var velocity = this.scene.physics.velocityFromRotation(angle, 200);
    this.setVelocity(velocity.x, velocity.y);
  }
}
