/////////////////////////////////////////////////////////////


var GameState = function(game)
{

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  _____    _____    ______   _         ____               _____  
 |  __ \  |  __ \  |  ____| | |       / __ \      /\     |  __ \ 
 | |__) | | |__) | | |__    | |      | |  | |    /  \    | |  | |
 |  ___/  |  _  /  |  __|   | |      | |  | |   / /\ \   | |  | |
 | |      | | \ \  | |____  | |____  | |__| |  / ____ \  | |__| |
 |_|      |_|  \_\ |______| |______|  \____/  /_/    \_\ |_____/ 
                                                                 
*/



//called by "new Phaser.Game()"
GameState.prototype.preload = function()
{
	//player
	this.load.image("player", "assets/player.png");

	//entity assets
	this.load.image("radiusBorder", "assets/use_radius_border.png");
	this.load.image("radiusFill", "assets/use_radius_fill.png");
	this.load.image("entityLight", "assets/entity_light.png");
	this.load.image("entityParentDummy", "assets/entity_parent_dummy.png");

	//prompt assets
	this.load.image("buttonW", "assets/button_w.png");
	this.load.image("buttonA", "assets/button_a.png");
	this.load.image("buttonS", "assets/button_s.png");
	this.load.image("buttonD", "assets/button_d.png");
	this.load.image("buttonE", "assets/button_e.png");
	this.load.image("buttonGradient", "assets/button_gradient.png");

};


















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   _____   _____    ______              _______   ______ 
  / ____| |  __ \  |  ____|     /\     |__   __| |  ____|
 | |      | |__) | | |__       /  \       | |    | |__   
 | |      |  _  /  |  __|     / /\ \      | |    |  __|  
 | |____  | | \ \  | |____   / ____ \     | |    | |____ 
  \_____| |_|  \_\ |______| /_/    \_\    |_|    |______|
*/



//this just creates them, DO NOT MODIFY THEM HERE
var DEBUG_VAR_1 = "";
var DEBUG_VAR_2 = "";
var DEBUG_VAR_3 = "";
var DEBUG_VAR_4 = "";


//called by "new Phaser.Game()"
GameState.prototype.create = function()
{

	//debug text
	var style = { fill: "#FFFFFF" };
	this.debugText0 = game.add.text(10, this.game.height - 160, "" , style);
	this.debugText1 = game.add.text(10, this.game.height - 130, "" , style);
	this.debugText2 = game.add.text(10, this.game.height - 100, "" , style);
	this.debugText3 = game.add.text(10, this.game.height - 70, "" , style);
	this.debugText4 = game.add.text(10, this.game.height - 40, "" , style);


	//init
	this.stage.backgroundColor = 0x1E1F1E;
	game.physics.startSystem(Phaser.Physics.ARCADE);


	//light bitmap setup (unsure how this shit works, am scared by it)
	this.bitmap = this.add.bitmapData(this.width, this.height);
	this.bitmap.context.fillStyle = "rgb(255, 255, 255)";
	this.bitmap.context.strokeStyle = "rgb(255, 255, 255)";
	this.lightBitmap = this.add.image(0, 0, this.bitmap);
	this.lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;


	//capture Keyboardyboard input to stop them being used elsewhere
	this.game.input.keyboard.addKeyCapture([
		Phaser.Keyboard.W,
		Phaser.Keyboard.A,
		Phaser.Keyboard.S,
		Phaser.Keyboard.D
	]);


	//initial grouping
	LEVEL_GROUP = game.add.group();
	PLAYER_GROUP = game.add.group(LEVEL_GROUP);
	ENTITIES_GROUP = game.add.group(LEVEL_GROUP);
	USERADIUS_GROUP = game.add.group(LEVEL_GROUP);
	HINTS_GROUP = game.add.group(LEVEL_GROUP);


	//makes player
	new Player(100, 100, true, false);
	


	//entities
	light1 = new Entity("light", 100, 200, true);
};










////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  _    _   _____    _____               _______   ______ 
 | |  | | |  __ \  |  __ \      /\     |__   __| |  ____|
 | |  | | | |__) | | |  | |    /  \       | |    | |__   
 | |  | | |  ___/  | |  | |   / /\ \      | |    |  __|  
 | |__| | | |      | |__| |  / ____ \     | |    | |____ 
  \____/  |_|      |_____/  /_/    \_\    |_|    |______|


*/


GameState.prototype.update = function()
{

	//debug text
	this.debugText0.text = "Debug Variables";
	this.debugText1.text = "| " + DEBUG_VAR_1;
	this.debugText2.text = "| " + DEBUG_VAR_2;
	this.debugText3.text = "| " + DEBUG_VAR_3;
	this.debugText4.text = "| " + DEBUG_VAR_4;

	DEBUG_VAR_1 = CURRENT_USABLE_ENTITY_OBJECT;
	DEBUG_VAR_2 = light1.usePrompt.isChangingOffset;
	DEBUG_VAR_3 = "";
	DEBUG_VAR_4 = "";


	//updates movement
	PLAYER_OBJECT.updateMovement();


	//updates collision of entities with player
	for (i in ENTITIES_ARRAY) {
		ENTITIES_ARRAY[i].updateCollision();
	}



	//updates feedback state of all useradii
	for (i in USERADIUS_ARRAY)
	{
		USERADIUS_ARRAY[i].updateClosestPlayerDistance();
		USERADIUS_ARRAY[i].updateEnterRadiusFeedback();
		USERADIUS_ARRAY[i].updateNearRadiusFeedback();
	}

	//updates state of all hints
	for (i in ACTIVE_HINTS_ARRAY)
	{
		ACTIVE_HINTS_ARRAY[i].updatePressedState();
		ACTIVE_HINTS_ARRAY[i].updateOffset();
	}

	
};





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
                                                                      
*/






//kicks off actual game
var game = new Phaser.Game(1400, 900, Phaser.AUTO, "game");
game.state.add("game", GameState, true);