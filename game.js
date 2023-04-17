var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");
  this.load.image("bg", "assets/sets/background.png");
  this.load.image("plattform3", "assets/sets/objects/platform2.png");
}
var platforms;
function create() {
  this.add.image(400, 300, "bg");
  this.add.image(400, 300, "plattform3");
}

function update() {}
