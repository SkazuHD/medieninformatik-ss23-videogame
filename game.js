const GAME_HEIGHT = 720;
const GAME_WIDTH = 1280;
const PLAYER_VELOCITY = 300;
const PLAYER_SPRINT_MULTIPLIER = 1.8;
const PLAYER_MAX_FIRE_COOLDOWN = 15;
const PLAYER_MAX_HEALTH = 100;
var PLAYER_CAN_FIRE = true;
var PLAYER_FIRE_COOLDOWN = PLAYER_MAX_FIRE_COOLDOWN;
var PLAYER_HEALTH = 100;
var zombies;

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

  //World Assets
  this.load.spritesheet("sprWater", "assets/world/sprWater.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.image("sprSand", "assets/world/sprSand.png");
  this.load.image("sprGrass", "assets/world/sprGrass.png");
}
function createPlayer() {
  player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, "player");
  player.setCollideWorldBounds(false); //False for infinite Map

  //Player Inputs
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

  //Create World

  //Enemys
  this.zombies = this.physics.add.group({
    classType: zomboy,
    runChildUpdate: true,
  });
  this.zombies.get(200, 150, "player");
  this.zombies.get(600, 450, "player");
  this.zombies.get(200, 450, "player");
  this.zombies.get(600, 150, "player");
  //Colliders for the player and the zombies
  this.physics.add.collider(player, this.zombies);
  this.physics.add.collider(this.zombies, this.zombies);
}
function update() {
  playerMovement.call(this);

  //Update World
  //Camera Follow
  this.cameras.main.centerOn(player.x, player.y);

  //Update Enemys
}
function playerShoot() {
  //Create Bullet Object and shoot it in the direction of the mouse
  var bullet = this.physics.add.sprite(player.x, player.y, "bullet");
  //Calculate the angle between the player and the mouse
  var angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
  //Rotate the bullet to the angle

  bullet.setRotation(angle + Math.PI / 2);
  //Calculate the velocity of the bullet based on the angle
  var velocity = this.physics.velocityFromRotation(angle, 500);
  //Set the velocity of the bullet
  bullet.setVelocity(velocity.x, velocity.y);
  //Collide Bullet with zombies
  this.physics.add.collider(bullet, this.zombies, function (bullet, zombie) {
    zombie.hit(50);
    bullet.destroy();
  });
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
