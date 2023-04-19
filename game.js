var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 00 },
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");
  this.load.image("sky", "src/games/firstgame/assets/sky.png");
  this.load.image("block", "assets/sprites/block.png");
  this.load.image("block2", "assets/sprites/block.png");
}
var block;
var cursors;
var block2;
function create() {
  this.add.image(400, 300, "sky");
  block = this.physics.add.image(100, 100, "block");
  block2 = this.physics.add.image(500, 500, "block2");
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    block.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    block.setVelocityX(160);
  } else if (cursors.up.isDown) {
    block.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    block.setVelocityY(160);
  } else {
    block.setVelocityX(0);
    block.setVelocityY(0);
  }
}
