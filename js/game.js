/////////////////////////////////////////////////////////////

/*
TODO 

- add debug text functionality


*/







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
	this.load.image("useRadiusBorder", "assets/use_radius_border.png");
	this.load.image("useRadiusFill", "assets/use_radius_fill.png");
	this.load.image("entityLight", "assets/interactable_light.png");

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








//called by "new Phaser.Game()"
GameState.prototype.create = function()
{

	//init
	this.stage.backgroundColor = 0x1E1F1E;
	this.physics.startSystem(Phaser.Physics.ARCADE);


	//light bitmap setup (unsure how this shit works, am scared by it)
	this.bitmap = this.add.bitmapData(this.width, this.height);
	this.bitmap.context.fillStyle = "rgb(255, 255, 255)";
	this.bitmap.context.strokeStyle = "rgb(255, 255, 255)";
	this.lightBitmap = this.add.image(0, 0, this.bitmap);
	this.lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;


	//capture keyboard input to stop them being used elsewhere
	this.game.input.keyboard.addKeyCapture([
		Phaser.Keyboard.W,
		Phaser.Keyboard.A,
		Phaser.Keyboard.S,
		Phaser.Keyboard.D
	]);




	//entities
	this.createEntity("light", 300, 100, 0.4);
	// this.createEntity("light", 400, 300, 0.4);	
	// this.createEntity("light", 600, 150, 0.4);
	GLOBAL_PLAYER_OBJECT = this.createPlayer(100, 100, true, true);


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



//called by "new Phaser.Game()"
GameState.prototype.update = function()
{

	//updates movement based on player input
	GLOBAL_PLAYER_OBJECT.updateMovement();


	//updates movement hints around the player if they're enabled
	if (GLOBAL_PLAYER_OBJECT.hintsEnabled && GLOBAL_PLAYER_OBJECT.hintsRemaining !== 0)
	{
	 GLOBAL_PLAYER_OBJECT.updateMovementHints();
	}


	//updates every Entity to check correct feedback is being shown
	for (i in GLOBAL_ENTITIES_ARRAY)
	{
		GLOBAL_ENTITIES_ARRAY[i].updateClosestPlayerDistance();
		GLOBAL_ENTITIES_ARRAY[i].updateEnterRadiusFeedback();
		GLOBAL_ENTITIES_ARRAY[i].updateNearRadiusFeedback();
	}

};













////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  ______   _    _   _   _    _____   _______   _____    ____    _   _    _____ 
 |  ____| | |  | | | \ | |  / ____| |__   __| |_   _|  / __ \  | \ | |  / ____|
 | |__    | |  | | |  \| | | |         | |      | |   | |  | | |  \| | | (___  
 |  __|   | |  | | | . ` | | |         | |      | |   | |  | | | . ` |  \___ \ 
 | |      | |__| | | |\  | | |____     | |     _| |_  | |__| | | |\  |  ____) |
 |_|       \____/  |_| \_|  \_____|    |_|    |_____|  \____/  |_| \_| |_____/ 
                                                                      
*/





GameState.prototype.createEntity =  function (type, x, y, useRadiusScale)
{
	var entityObject = new Entity(type, x, y, useRadiusScale);
	GLOBAL_ENTITIES_ARRAY[GLOBAL_ENTITIES_ARRAY.length] = entityObject;
	return entityObject;a
};



//incapsulating in this function now despite being one line so its consistent and has scope for me to add more to later
GameState.prototype.createPlayer =  function (x, y, hintsEnabled, doFadeInHints)
{
	var playerObject = new Player(x, y, hintsEnabled, doFadeInHints);
	return playerObject;
};








//kicks off actual game
var game = new Phaser.Game(1400, 900, Phaser.AUTO, "game");
game.state.add("game", GameState, true);