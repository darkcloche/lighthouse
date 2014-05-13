var game = new Phaser.Game(1400, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player = null;
var interactables = null;
var level = null;

function preload() {

	level_1 = new Level_1(game);
	level_1.preload();

	player = new Player(game);
	player.preload();

	interactables = new Interactables(game);
	interactables.preload();	

}

function create() {

	level_1.create();
	player.create();
	interactables.create();

}



function update() {

	level_1.update();
	player.update();
	interactables.update();

}