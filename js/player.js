var PLAYER = null;
var PLAYER_OBJECT = null;
var PLAYER_GROUP = null;
var LEVEL_GROUP = null;



function Player(x, y, startHintsEnabled)
{
	//vars
	this.playerAcceleration = 1500;

	var playerMaxSpeed = 150;
	var playerDrag = 1250;
	var playerScale = 1;
	var hintOffset = 45;

	//init state of some vars
	this.pickedEntity = null;

	//loads sprite
	this.player = game.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);

	//sets global vars
	PLAYER_OBJECT = this;
	PLAYER = this.player;

	//enables phys and applies values
	game.physics.enable(this.player, Phaser.Physics.ARCADE);
	game.physics.arcade.enableBody(this.player);
	this.player.body.collideWorldBounds = true;
	this.player.body.maxVelocity.setTo(playerMaxSpeed, playerMaxSpeed);
	this.player.body.drag.setTo(playerDrag, playerDrag);

	//group setup
	this.player.addChild(PLAYER_GROUP);
	LEVEL_GROUP.add(PLAYER_GROUP); 

	//hints
	var hintsGroup = game.add.group()
	this.player.addChild(hintsGroup);


	if (startHintsEnabled) 
	{
		this.upHint = new Hint("w", true, hintsGroup, 0, -hintOffset, PLAYER_OBJECT);
		this.leftHint = new Hint("a", true, hintsGroup, -hintOffset, 0, PLAYER_OBJECT);
		this.downHint = new Hint("s", true, hintsGroup, -0, hintOffset, PLAYER_OBJECT);
		this.rightHint = new Hint("d", true, hintsGroup, hintOffset, 0, PLAYER_OBJECT);
	}
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
}



//checks if supplied button name is currently pressed down
Player.prototype.doPickUpEntity = function(object)
{
	// updates entity feedback, enables ability to drop
	this.pickedEntity = object;
	
	this.pickedEntity.isPicked = true;
	this.pickedEntity.startPickedUpFeedback();
	this.pickedEntity.useRadius.showUsedFeedback();
}



//checks if supplied button name is currently pressed down
Player.prototype.doDropEntity = function()
{
	// updates entity feedback, re-enables ability to pick up
	this.pickedEntity.isPicked = false;
	this.pickedEntity.stopPickedUpFeedback();
	this.pickedEntity.useRadius.showDroppedFeedback();

	this.pickedEntity = false;
}



//checks if supplied button name is currently pressed down
Player.prototype.onObjectPickedUp = function()
{
	this.pickedEntity.usePromptDrop.forceUpdateOffset();
	this.pickedEntity.usePromptDrop.unHide();
}