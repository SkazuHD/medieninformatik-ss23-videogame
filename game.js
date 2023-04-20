const GAME_HEIGHT = window.innerHeight * 0.85;
const GAME_WIDTH = window.innerWidth * 0.85;
const WORLD_INFINITE = true;
//Only used if WORLD_INFINITE is false
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;
const WORLD_MAX_ENEMIES = 75;
//Player Variables
const PLAYER_VELOCITY = 300;
const PLAYER_SPRINT_MULTIPLIER = 1.8;
const PLAYER_MAX_HEALTH = 100;
var PLAYER_IS_VULNERABLE = false;
var PLAYER_MAX_INVULNERABILITY_COOLDOWN = 100;
var PLAYER_INVULNERABILITY_COOLDOWN = PLAYER_MAX_INVULNERABILITY_COOLDOWN;

var PLAYER_CAN_FIRE = true;
const PLAYER_MAX_FIRE_COOLDOWN = 15;

var PLAYER_FIRE_COOLDOWN = PLAYER_MAX_FIRE_COOLDOWN;
var PLAYER_BULLET_SPEED = 1500;
var PLAYER_DAMAGE = 50;
var PLAYER_AUTOAIM = true;
var PLAYER_HEALTH = 100;

//Enemy Types
var zombies;
var zomboyRanger;

var config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      maxEntries: 1000,
      TILE_BIAS: 4096,
      OVERLAP_BIAS: 4096,
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
    matter: {
      debug: true,
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  parent: "game",
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/background/sky.png");
  this.load.image("player", "assets/objects/player.png");
  this.load.image("bullet", "assets/objects/bullet.png");
  this.load.spritesheet("slime", "assets/objects/slime.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  //World Assets
  this.load.spritesheet("sprWater", "assets/world/sprWater.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.image("sprSand", "assets/world/sprSand.png");
  this.load.image("sprGrass", "assets/world/sprGrass.png");
}
function calcSpawnLocation() {
  side = Phaser.Math.Between(0, 3);
  switch (side) {
    case 0:
      //Top
      posX = Phaser.Math.Between(
        this.cameras.main.midPoint.x - GAME_WIDTH,
        this.cameras.main.midPoint.x + GAME_WIDTH
      );
      posY = Phaser.Math.Between(
        this.cameras.main.midPoint.y + GAME_HEIGHT / 2,
        this.cameras.main.midPoint.y + GAME_HEIGHT
      );
      break;
    case 1:
      //Right
      posX = Phaser.Math.Between(
        this.cameras.main.midPoint.x + GAME_WIDTH / 2,
        this.cameras.main.midPoint.x + GAME_WIDTH
      );
      posY = Phaser.Math.Between(
        this.cameras.main.midPoint.y - GAME_HEIGHT,
        this.cameras.main.midPoint.y + GAME_HEIGHT
      );
      break;
    case 2:
      //Bottom
      posX = Phaser.Math.Between(
        this.cameras.main.midPoint.x - GAME_WIDTH,
        this.cameras.main.midPoint.x + GAME_WIDTH
      );
      posY = Phaser.Math.Between(
        this.cameras.main.midPoint.y - GAME_HEIGHT,
        this.cameras.main.midPoint.y - GAME_HEIGHT / 2
      );
      break;
    case 3:
      //Left
      posX = Phaser.Math.Between(
        this.cameras.main.midPoint.x - GAME_WIDTH,
        this.cameras.main.midPoint.x - GAME_WIDTH / 2
      );
      posY = Phaser.Math.Between(
        this.cameras.main.midPoint.y - GAME_HEIGHT,
        this.cameras.main.midPoint.y + GAME_HEIGHT
      );
      break;
    default:
      console.error("Error: Side is not a valid number");
  }
  return [posX, posY];
}

function spawnEnemy() {
  enemyCount =
    this.zombies.getChildren().length + this.zomboyRanger.getChildren().length;

  if (this.zombies == null || enemyCount < WORLD_MAX_ENEMIES) {
    if (Phaser.Math.Between(0, 1000) > 998) {
      //Spawn Enemy outside of the camera view

      // * NOTE * Enemy can spawn inside of View if the camera is at the edge of the world
      [posX, posY] = calcSpawnLocation.call(this);
      this.zombies.get(posX, posY, "slime").setScale(1.5);
      //Set Sprite to random frame;
      this.zombies
        .getChildren()
        [this.zombies.getChildren().length - 1].setFrame(
          Phaser.Math.Between(0, 63)
        );
    }
    if (Phaser.Math.Between(0, 1000) > 1000) {
      //Spawn Enemy outside of the camera view

      // * NOTE * Enemy can spawn inside of View if the camera is at the edge of the world
      [posX, posY] = calcSpawnLocation.call(this);
      this.zomboyRanger.get(posX, posY, "player").setScale(1.5);
      //Set Sprite to random frame;
    }
  }
}
function createPlayer() {
  player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "player");

  if (WORLD_INFINITE) {
    player.setCollideWorldBounds(false);
  } else {
    player.setCollideWorldBounds(true);
  }

  // * Somehow Player is still pushed by other objects
  player.immovable = true;
  player.setBounce(0);

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
  this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "sky").setScale(4);

  if (!WORLD_INFINITE) {
    //Create World
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    //Setup Camera
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }

  //Create player with current context (this)
  createPlayer.call(this);
  //Starting Enemies

  this.zombies = this.physics.add.group({
    classType: zomboy,
    runChildUpdate: true,
  });
  this.zomboyRanger = this.physics.add.group({
    classType: zomboyRange,
    runChildUpdate: true,
  });

  //Colliders for the player and the zombies
  this.physics.add.collider(player, this.zombies, function (player, zombie) {
    if (PLAYER_IS_VULNERABLE) {
      PLAYER_HEALTH -= zombie.damage;
    }
    PLAYER_IS_VULNERABLE = false;
    PLAYER_INVULNERABILITY_COOLDOWN = PLAYER_MAX_INVULNERABILITY_COOLDOWN;
  });

  this.physics.add.collider(this.zombies, this.zombies, (zombie1, zombie2) => {
    zombie2.move = false;
  });
  this.physics.add.collider(
    this.zomboyRanger,
    this.zombies,
    (zombie1, zombie2) => {}
  );
  this.physics.add.collider(
    this.zomboyRanger,
    this.zomboyRanger,
    (zombie1, zombie2) => {}
  );
  this.physics.add.collider(this.zomboyRanger, player);

  this.physics.world.setFPS(240);
}

function update() {
  playerMovement.call(this);

  //Player Health and Vulnerability
  if (!PLAYER_IS_VULNERABLE) {
    PLAYER_INVULNERABILITY_COOLDOWN -= 1;
    if (PLAYER_INVULNERABILITY_COOLDOWN <= 0) {
      PLAYER_IS_VULNERABLE = true;
    }
  }

  //Update World
  //TODO Add Chunk Generation

  //Camera Follow

  this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 0);
  //this.cameras.main.centerOn(player.x, player.y);

  //Spawn Enemies if there are less than the max
  spawnEnemy.call(this);
}

function playerShoot() {
  //Create Bullet Object and shoot it in the direction of the mouse
  var bullet = this.physics.add.sprite(player.x, player.y, "bullet");
  //Calculate the angle between the player and the mouse
  if (this.zombies.getChildren().length == 0) {
    angle = 0;
  } else if (PLAYER_AUTOAIM) {
    let closestEnemy = this.physics.closest(player, this.zombies.getChildren());
    if (
      closestEnemy.visible &&
      this.cameras.main.cull([closestEnemy]).length > 0
    ) {
      var angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        closestEnemy.x,
        closestEnemy.y
      );
    } else {
      angle = 0;
    }
  } else {
    var angle = Phaser.Math.Angle.Between(
      player.x,
      player.y,
      pointer.worldX,
      pointer.worldY
    );
  }

  //Rotate the bullet to the angle

  bullet.setRotation(angle + Math.PI / 2);
  //Calculate the velocity of the bullet based on the angle
  var velocity = this.physics.velocityFromRotation(angle, PLAYER_BULLET_SPEED);
  //Set the velocity of the bullet
  bullet.setVelocity(velocity.x, velocity.y);
  //Collide Bullet with zombies
  this.physics.add.collider(bullet, this.zombies, function (bullet, zombie) {
    zombie.hit(PLAYER_DAMAGE);
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
    player.body.setVelocityX(-PLAYER_VELOCITY);
  } else if (keys.right.isDown) {
    player.body.setVelocityX(PLAYER_VELOCITY);
  } else {
    player.body.setVelocityX(0);
  }
  //Handles player movement on the Y axis
  if (keys.up.isDown) {
    player.body.setVelocityY(-PLAYER_VELOCITY);
  } else if (keys.down.isDown) {
    player.body.setVelocityY(PLAYER_VELOCITY);
  } else {
    player.body.setVelocityY(0);
  }
  //Handles player sprinting and caps the velocity at the max velocity
  player.body.velocity.normalize().scale(PLAYER_VELOCITY);

  if (keys.sprint.isDown) {
    player.body.setVelocityX(player.body.velocity.x * PLAYER_SPRINT_MULTIPLIER);
    player.body.setVelocityY(player.body.velocity.y * PLAYER_SPRINT_MULTIPLIER);
  }
}
