var GameState = function(game) {
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
GameState.prototype.preload = function() {
	this.load.image('player', 'assets/player.png');
	this.load.image('interactableUseRadiusEmpty', 'assets/interactable_empty.png');
	this.load.image('interactableUseRadiusOccupied', 'assets/interactable_full.png');
	this.load.image('interactableLight', 'assets/interactable_light.png');
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
GameState.prototype.create = function() {

	//init
	this.stage.backgroundColor = 0x1E1F1E;
	this.physics.startSystem(Phaser.Physics.ARCADE);

	//player
	this.player = this.add.sprite(this.game.width/2, this.game.height/2, "player");
	this.player.anchor.setTo(0.5, 0.5);

	//player physics
	this.PLAYER_MAX_SPEED = 150;
	this.PLAYER_DRAG = 1250;
	this.PLAYER_ACCELERATION = 1500;

	
	this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);


	//you have to add the actual parent objects you want to access to the tween manager here, not in the tween call below
	//currently not working, probably need to use something other than tween
	//this.this.PLAYER_ACCELERATIONTween = this.add.tween(this.player.body.acceleration); 


	//interactables
	this.INTERACTABLES_ARRAY = [];
	this.createNewInteractable("light", 500, 200, 0.4)
	this.createNewInteractable("blocker", 900, 600, 0.3)
	this.createNewInteractable("light", 1200, 300, 0.4)


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

	//bring player to top after everything is created
	this.player.bringToTop();

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
GameState.prototype.update = function() {

	//applies acceleration in the required direction when key is pressed
	if (this.inputIsActive("W")) 
	{
		this.player.body.acceleration.y = -this.PLAYER_ACCELERATION;
	}

	if (this.inputIsActive("S")) 
	{
		this.player.body.acceleration.y = this.PLAYER_ACCELERATION;
	}

	if (this.inputIsActive("A")) 
	{
		this.player.body.acceleration.x = -this.PLAYER_ACCELERATION;
	}

	if (this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = this.PLAYER_ACCELERATION;
	}


	//if keys are not held down, reset acceleration
	if (!this.inputIsActive("W") && !this.inputIsActive("S")) 
	{
		this.player.body.acceleration.y = 0;
		//this.this.PLAYER_ACCELERATIONTween.to({y: 0}, 2000, Phaser.Easing.Linear.None);
	}

	if (!this.inputIsActive("A") && !this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = 0;
		//this.this.PLAYER_ACCELERATIONTween.to({x: 0}, 2000, Phaser.Easing.Linear.None);
	}



/*
	for (var obj in INTERACTABLES_ARRAY) {

	}
*/



	//object pickup if player press E
	if (this.inputIsActive("E")) 
	{
		if (!this.hasInteractablePickedUp) 
		{
			if (this.isOnInteractable() !== false) 
			{
				this.pickUpInteractable(this.isOnInteractable());
			}
			else 
			{
				this.doDropInteractable(this.hasInteractablePickedUp());
			}
		}
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










//checks if supplied button name is currently pressed down
GameState.prototype.inputIsActive = function(button) {

	var isActive = false;
	button = button.toUpperCase() 

	//takes the button passed in to the function and checks if it's pressed
	if (button !== undefined) 
	{
		isActive = this.input.keyboard.isDown(Phaser.Keyboard[button.toString()]);
	}
	
	return isActive;
};



GameState.prototype.createNewObstacle =  function (width, height, x, y) {
	
};


GameState.prototype.createPlayer = function (x, y) {
	this.player = this.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);
};



GameState.prototype.createNewInteractable =  function (type, x, y, scale) {
	var interactable = new InteractableObject(type, x, y, scale);
	interactable.initialise();
	this.INTERACTABLES_ARRAY[this.INTERACTABLES_ARRAY.length] = interactable;
}



function InteractableObject(type, x, y, scale) {


	//initial variables for creation
	this.type = type;
	this.x = x;
	this.y = y;
	this.scale = scale;
	this.interactableGroup = game.add.group();
	this.interactable = undefined;
	this.useRadius = undefined;
	this.state = "placed";



	//creates the actual interactable
	this.initialise = function() {

		//adds relevant interactable type
		if (this.type == "light") 
		{
			this.interactable = game.add.sprite(x, y, "interactableLight");
			this.interactable.scale.x = 0.6;
			this.interactable.scale.y = 0.6;
			this.interactable.anchor.setTo(0.5, 0.5);
		}


		if (this.type == "blocker") 
		{
			this.interactable = game.add.sprite(x, y, "interactableBlocker");
			this.interactable.scale.x = 0.5;
			this.interactable.scale.y = 0.5;
			this.interactable.anchor.setTo(0.5, 0.5);
		}


		//sets useradius params, enables physics, adds to local group
		this.useRadius = game.add.sprite(x, y, "interactableUseRadiusEmpty");
		game.physics.enable(this.useRadius, Phaser.Physics.ARCADE);
		this.useRadius.scale.x = scale;
		this.useRadius.scale.y = scale;
		this.useRadius.anchor.setTo(0.5, 0.5);




		//adds elements to group
		this.interactableGroup.add(this.interactable);
		this.interactableGroup.add(this.useRadius);
	}

	this.playerInRadius = function() {
		game.add.tween(this.useRadius).to( { alpha: 0.2 }, 1250, Phaser.Easing.Cubic.InOut, true, 0, 10, true);
	}



	this.playerNotInRadius = function() {
		//tween
		this.useRadius.alpha = 0.05
		game.add.tween(this.useRadius).to( { alpha: 0.2 }, 1250, Phaser.Easing.Cubic.InOut, true, 0, 10, true);
	}


};



GameState.prototype.doPickUpInteractable = function (interactable) {
	//add interactable to player group
};

GameState.prototype.doDropInteractable = function (interactable) {

};

GameState.prototype.hasInteractablePickedUp = function () {
	
};

GameState.prototype.changeInteractableState = function(interactable, state) {
	//change texture
};







/*

//WHAT IS THIS
this.bitmap.context.fillstyle = "rgb(100,100,100)";
this.bitmap.context.fillRect = (0, 0, this.width, this.height);

*/







var game = new Phaser.Game(1400, 900, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);