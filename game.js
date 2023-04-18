const GAME_HEIGHT = 900;
const GAME_WIDTH = 1600;
const PLAYER_VELOCITY = 300;
const PLAYER_SPRINT_MULTIPLIER = 1.8;
const PLAYER_MAX_FIRE_COOLDOWN = 15;
const PLAYER_MAX_HEALTH = 100;
var PLAYER_CAN_FIRE = true;
var PLAYER_FIRE_COOLDOWN = PLAYER_MAX_FIRE_COOLDOWN;
var PLAYER_HEALTH = 100;

var config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
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
  this.load.image("sky", "assets/background/sky.png");
  this.load.image("player", "assets/objects/player.png");
  this.load.image("bullet", "assets/objects/bullet.png");
}
function createPlayer() {
  player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, "player");
  player.setCollideWorldBounds(true);

  keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    sprint: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
  });

  pointer = this.input.activePointer;
}
function create() {
  this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "sky").setScale(2);

  //Create player with current context (this)
  createPlayer.call(this);
}
function update() {
  playerMovement.call(this);
}
function playerShoot() {
  //Create Bullet Object and shoot it in the direction of the mouse
  var bullet = this.physics.add.sprite(player.x, player.y, "bullet");
  //Calculate the angle between the player and the mouse
  var angle = Phaser.Math.Angle.Between(
    player.x,
    player.y,
    pointer.worldX,
    pointer.worldY
  );
  //Rotate the bullet to the angle

  bullet.setRotation(angle + Math.PI / 2);
  //Calculate the velocity of the bullet based on the angle
  var velocity = this.physics.velocityFromRotation(angle, 500);
  //Set the velocity of the bullet
  bullet.setVelocity(velocity.x, velocity.y);
  PLAYER_CAN_FIRE = false;
}

function playerMovement() {
  //Handle player Shooting
  if ((pointer.isDown || keys.fire.isDown) && PLAYER_CAN_FIRE) {
    playerShoot.call(this);
  } else if (!PLAYER_CAN_FIRE) {
    PLAYER_FIRE_COOLDOWN -= 1;
    if (PLAYER_FIRE_COOLDOWN <= 0) {
      PLAYER_FIRE_COOLDOWN = PLAYER_MAX_FIRE_COOLDOWN;
      PLAYER_CAN_FIRE = true;
    }
  }
  //Handles player movement on the X axis
  if (keys.left.isDown) {
    player.setVelocityX(-PLAYER_VELOCITY);
  } else if (keys.right.isDown) {
    player.setVelocityX(PLAYER_VELOCITY);
  } else {
    player.setVelocityX(0);
  }
  //Handles player movement on the Y axis
  if (keys.up.isDown) {
    player.setVelocityY(-PLAYER_VELOCITY);
  } else if (keys.down.isDown) {
    player.setVelocityY(PLAYER_VELOCITY);
  } else {
    player.setVelocityY(0);
  }
  //Handles player sprinting and caps the velocity at the max velocity
  player.body.velocity.normalize().scale(PLAYER_VELOCITY);

  if (keys.sprint.isDown) {
    player.setVelocityX(player.body.velocity.x * PLAYER_SPRINT_MULTIPLIER);
    player.setVelocityY(player.body.velocity.y * PLAYER_SPRINT_MULTIPLIER);
  }
}
