// Board parameters
'use strict';
var BOARD_X = 5;
var BOARD_Y = 6;
var CELL_WIDTH = 101;
var CELL_HEIGHT = 83;

// List with all possible players
var PLAYERS = ['images/char-princess-girl.png',
'images/char-pink-girl.png', 'images/char-boy.png', 'images/char-cat-girl.png',
'images/char-horn-girl.png'];

// Preload resourses
Resources.load(['images/enemy-bug.png']);
Resources.load(PLAYERS);

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.xPos = this.xPos + dt * this.velocity;

    if (this.y == player.y && Math.abs(this.xPos - player.x * CELL_WIDTH) < CELL_WIDTH * .7) {
      player.delayedReset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.y * CELL_HEIGHT - 20);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
  this.reset();
  this.sinceLastEnemy = 0;
  this.playerIndex = 0;
};

// Reset player to inicial position
Player.prototype.reset = function() {
  this.x = Math.floor(BOARD_X / 2);
  this.y = BOARD_Y - 1;
  this.canMove = true;
}

// Reset Game with delay
Player.prototype.delayedReset = function() {
  if (!this.canMove) {
    return;
  }
  this.canMove = false;
  setTimeout(resetPlayer, 200);
}

// Win Game with delay
Player.prototype.delayedWin = function() {
  if (!this.canMove) {
    return;
  }
  this.canMove = false;
  setTimeout(showWinAlert, 200);
}

// Player update method
Player.prototype.update = function(dt) {

  // add new enemies every second
  this.sinceLastEnemy += dt;
  if (this.sinceLastEnemy > 1) {
    this.sinceLastEnemy = 0;
    addEnemy();
  }

  // remove offscreen enemies
  for (var i = allEnemies.length - 1; i >= 0; i -= 1) {
    var enemy = allEnemies[i];
    if (enemy.xPos > BOARD_X * CELL_WIDTH) {
      allEnemies.splice(i, 1);
    }
  }
};

// Draw player on canvas
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(PLAYERS[this.playerIndex]), this.x * CELL_WIDTH, this.y * CELL_HEIGHT - 40);
};

// Handle keyboar commands for player
Player.prototype.handleInput = function(command) {
  if (!this.canMove) {
    return;
  }
  if (command == 'up') {
    if (this.y > 0) {
      this.y = this.y - 1;
    }
    if (this.y == 0) {
      this.delayedWin();
    }
  }
  if (command == 'down') {
    if (this.y < BOARD_Y - 1) {
      this.y += 1;
    }
  }
  if (command == 'left') {
    if (this.x > 0) {
      this.x -= 1;
    }
  }
  if (command == 'right') {
    if (this.x < BOARD_X - 1) {
      this.x += 1;
    }
  }
  if (command == 'change') {
    this.playerIndex += 1;
    this.playerIndex %= PLAYERS.length;
  }
};

// return random value from min to max
function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Create new enemy and add to the list
function addEnemy() {
  var enemy = new Enemy();
  enemy.xPos = -CELL_WIDTH;
  enemy.y = getRandomInt(1, 3); // Random row
  enemy.velocity = getRandomInt(100, 300); // Random velocity
  allEnemies.push(enemy);
}

// Global function to call player reset
function resetPlayer() {
  player.reset();
}

// Alert for winning game
function showWinAlert() {
  alert('You won!');
  player.reset();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

addEnemy();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      32: 'change'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
