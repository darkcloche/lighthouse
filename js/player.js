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
	this.currentUsableEntity = null;

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
	this.hintsGroup = game.add.group()
	this.player.addChild(this.hintsGroup);

	if (startHintsEnabled)
	{
		var startEnabled = true;

		this.upHint = new Hint("W", startEnabled, this.hintsGroup, 0, -hintOffset, PLAYER_OBJECT);
		this.leftHint = new Hint("A", startEnabled, this.hintsGroup, -hintOffset, 0, PLAYER_OBJECT);
		this.downHint = new Hint("S", startEnabled, this.hintsGroup, -0, hintOffset, PLAYER_OBJECT);
		this.rightHint = new Hint("D", startEnabled, this.hintsGroup, hintOffset, 0, PLAYER_OBJECT);
	}

	//action setup
	this.useAction = new PlayerAction("E", this.useObject);
};



Player.prototype.updateMovement = function() 
{
	//applies acceleration in the required direction when key is pressed, and updates hint
	if (game.input.keyboard.isDown(Phaser.Keyboard.W))
	{
		this.player.body.acceleration.y = -this.playerAcceleration;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.S))
	{
		this.player.body.acceleration.y = this.playerAcceleration;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.A))
	{
		this.player.body.acceleration.x = -this.playerAcceleration;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.D))
	{
		this.player.body.acceleration.x = this.playerAcceleration;
	}

	//if no keys are not held down or opposite keys are held down, reset acceleration
	if ((!game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.S)) 
		|| (game.input.keyboard.isDown(Phaser.Keyboard.W) && game.input.keyboard.isDown(Phaser.Keyboard.S)))
	{
		this.player.body.acceleration.y = 0;
	}

	if ((!game.input.keyboard.isDown(Phaser.Keyboard.A) && !game.input.keyboard.isDown(Phaser.Keyboard.D)) 
		|| (game.input.keyboard.isDown(Phaser.Keyboard.A) && game.input.keyboard.isDown(Phaser.Keyboard.D)))
	{
		this.player.body.acceleration.x = 0;
	}
}




Player.prototype.useObject = function() 
{

	if (this.pickedEntity !== null)
	{
		this.pickedEntity.isPicked = false;
		this.pickedEntity.stopPickedUpFeedback();
		this.pickedEntity.useRadius.showDroppedFeedback();
		this.pickedEntity = null;
	}

	if (this.currentUsableEntity !== null && this.pickedEntity == null) 
	{
		this.pickedEntity = this.currentUsableEntity;
		this.pickedEntity.isPicked = true;
		this.pickedEntity.startPickedUpFeedback();
		this.pickedEntity.useRadius.showUsedFeedback();
		this.currentUsableEntity = null;
	}
}