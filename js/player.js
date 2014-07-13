var GLOBAL_PLAYER = null;
var GLOBAL_PLAYER_OBJECT = null;
var GLOBAL_PLAYER_GROUP = null;
var GLOBAL_LEVEL_GROUP = null;



function Player(x, y, startHintsEnabled)
{
	//vars
	this.playerAcceleration = 1500;

	var playerMaxSpeed = 150;
	var playerDrag = 1250;
	var playerScale = 1.2;
	var hintOffset = 35;


	//loads sprite
	this.player = game.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);
	this.player.scale.x = this.player.scale.y = playerScale;
	GLOBAL_PLAYER = this.player;
	GLOBAL_PLAYER_OBJECT = this;


	//enables phys and applies values
	game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(playerMaxSpeed, playerMaxSpeed);
	this.player.body.drag.setTo(playerDrag, playerDrag);


	//group setup
	this.player.addChild(GLOBAL_PLAYER_GROUP);
	GLOBAL_LEVEL_GROUP.add(GLOBAL_PLAYER_GROUP); 


	//hints
	if (startHintsEnabled) {
		this.hintsGroup = game.add.group()
		this.player.addChild(this.hintsGroup);

		new Hint("w", true, true, this.hintsGroup, 0, -hintOffset);
		new Hint("a", true, true, this.hintsGroup, -hintOffset, 0);
		new Hint("s", true, true, this.hintsGroup, -0, hintOffset);
		new Hint("d", true, true, this.hintsGroup, hintOffset, 0);
	}


	//bring player to top after everything is created
	this.player.bringToTop();
};




//checks if supplied button name is currently pressed down
Player.prototype.inputIsActive = function(button)
{
	var isActive = false;
	button = button.toUpperCase();

	//takes the button passed in to the function and checks if it"s pressed
	if (button !== undefined) 
	{
		isActive = game.input.keyboard.isDown(Phaser.Keyboard[button.toString()]);
	}
	
	return isActive;
};







Player.prototype.updateMovement = function() {

	//applies acceleration in the required direction when key is pressed, and updates hint
	if (this.inputIsActive("W")) 
	{
		this.player.body.acceleration.y = -this.playerAcceleration;
	}


	if (this.inputIsActive("S")) 
	{
		this.player.body.acceleration.y = this.playerAcceleration;
	}


	if (this.inputIsActive("A")) 
	{
		this.player.body.acceleration.x = -this.playerAcceleration;
	}


	if (this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = this.playerAcceleration;
	}



	//if no keys are not held down or opposite keys are held down, reset acceleration
	if ((!this.inputIsActive("W") && !this.inputIsActive("S")) || (this.inputIsActive("W") && this.inputIsActive("S")))
	{
		this.player.body.acceleration.y = 0;
	}

	if ((!this.inputIsActive("A") && !this.inputIsActive("D")) || (this.inputIsActive("A") && this.inputIsActive("D")))
	{
		this.player.body.acceleration.x = 0;
	}

}



