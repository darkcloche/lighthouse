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
		this.upHint = new Hint("w", true, hintsGroup, 0, -hintOffset);
		this.leftHint = new Hint("a", true, hintsGroup, -hintOffset, 0);
		this.downHint = new Hint("s", true, hintsGroup, -0, hintOffset);
		this.rightHint = new Hint("d", true, hintsGroup, hintOffset, 0);
	}
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



//checks if supplied button name is currently pressed down
Player.prototype.doPickUpEntity = function()
{
	// uses global vars because its called in the context of the Hint object
	this.pickedEntity = CURRENT_USABLE_ENTITY_OBJECT;
	CURRENT_PICKED_ENTITY_OBJECT = CURRENT_USABLE_ENTITY_OBJECT;

	//parents entity to player
	var offsetX = this.pickedEntity.entity.x - PLAYER.x;
	var offsetY = this.pickedEntity.entity.y - PLAYER.y;
	PLAYER.addChild(this.pickedEntity.entity);
	this.pickedEntity.entity.x = offsetX;
	this.pickedEntity.entity.y = offsetY;

	// updates entity feedback
	this.pickedEntity.doPickUpFeedback();
	this.pickedEntity.useRadius.showUsedFeedback();
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