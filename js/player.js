var GLOBAL_PLAYER = undefined;
var GLOBAL_PLAYER_OBJECT = undefined;
var PLAYER_ACCELERATION = 1500;


function Player(x, y, hintsEnabled, doFadeInHints)
{
	//movement vars
	var playerMaxSpeed = 150;
	var playerDrag = 1250;
	var playerScale = 1.2

	//loads sprite
	this.player = game.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);
	this.player.scale.x = this.player.scale.y = playerScale;
	this.hintsEnabled = hintsEnabled;
	GLOBAL_PLAYER = this.player;


	//enables phys and applies values
	game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(playerMaxSpeed, playerMaxSpeed);
	this.player.body.drag.setTo(playerDrag, playerDrag);

	//if hints enabled, show movement button hints around player
	if (hintsEnabled)
	{

		this.buttonScale = 0.8;
		this.keyWHasBeenPressed = false;
		this.keySHasBeenPressed = false;
		this.keyAHasBeenPressed = false;
		this.keyDHasBeenPressed = false;


		var buttonOffset = 40;
		var buttonGroupOffset = -100;
		var gradientGroupOffset = -82;
		var gradientButtonOffset = -19;


		//makes group of gradients for buttons
		this.gradientGroup = game.add.group();
		this.gradientGroup.x = x + gradientGroupOffset
		this.gradientGroup.y = y + gradientGroupOffset
		this.player.addChild(this.gradientGroup)

		this.buttonWGradient = this.gradientGroup.create(0, -buttonOffset, "buttonGradient");
		this.buttonAGradient = this.gradientGroup.create(-buttonOffset, 0, "buttonGradient");
		this.buttonSGradient = this.gradientGroup.create(0, buttonOffset, "buttonGradient");
		this.buttonDGradient = this.gradientGroup.create(buttonOffset, 0, "buttonGradient");


		//makes group of buttons (render after gradients)
		this.buttonGroup = game.add.group();
		this.buttonGroup.x = x + buttonGroupOffset
		this.buttonGroup.y = y + buttonGroupOffset
		this.player.addChild(this.buttonGroup)

		this.buttonW = this.buttonGroup.create(0, -buttonOffset, "buttonW");
		this.buttonA = this.buttonGroup.create(-buttonOffset, 0, "buttonA");
		this.buttonS = this.buttonGroup.create(0, buttonOffset, "buttonS");
		this.buttonD = this.buttonGroup.create(buttonOffset, 0, "buttonD");


		//setting default params for buttons
		this.buttonGroup.forEach(function(button) 
		{
			button.scale.x = button.scale.y = this.buttonScale;
			button.anchor.setTo(0.5, 0.5);

		}, this);


		//setting default params for gradients
		this.gradientGroup.forEach(function(gradient) 
		{
			gradient.alpha = 0;
			gradient.x = gradient.x + gradientButtonOffset;
			gradient.y = gradient.y + gradientButtonOffset;
			gradient.anchor.setTo(0.5, 0.5);
			
		}, this);

		//if we want hints to fade in, tween the opacity up
		if (doFadeInHints) {

			var fadeInTime = 300;
			var autoStart = true;
			var fadeToAlpha = 0.6;

			this.buttonGroup.forEach(function(button) {button.alpha = 0;}, this);

			this.buttonWTweenIn = game.add.tween(this.buttonW);
			this.buttonATweenIn = game.add.tween(this.buttonA);
			this.buttonSTweenIn = game.add.tween(this.buttonS);
			this.buttonDTweenIn = game.add.tween(this.buttonD);

			this.buttonWTweenIn.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Quadratic.InOut, autoStart, 100, 0, false);
			this.buttonSTweenIn.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Quadratic.InOut, autoStart, 150, 0, false);
			this.buttonATweenIn.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Quadratic.InOut, autoStart, 200, 0, false);
			this.buttonDTweenIn.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Quadratic.InOut, autoStart, 250, 0, false);
		}

	};

	//bring player to top after everything is created
	this.player.bringToTop();



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






};

Player.prototype.updateMovement = function() {

	//applies acceleration in the required direction when key is pressed, and updates hint
	if (this.inputIsActive("W")) 
	{
		this.player.body.acceleration.y = -PLAYER_ACCELERATION;
	}


	if (this.inputIsActive("S")) 
	{
		this.player.body.acceleration.y = PLAYER_ACCELERATION;
	}


	if (this.inputIsActive("A")) 
	{
		this.player.body.acceleration.x = -PLAYER_ACCELERATION;
	}


	if (this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = PLAYER_ACCELERATION;
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






Player.prototype.updateMovementHints = function() {

		this.hintsRemaining = this.buttonGroup.countLiving();

		if (this.inputIsActive("W") && !this.keyWHasBeenPressed) {
			this.keyWHasBeenPressed = true;
			GLOBAL_PLAYER_OBJECT.hideButtonHint("W");
		}

		if (this.inputIsActive("A") && !this.keyAHasBeenPressed) {
			this.keyAHasBeenPressed = true;
			GLOBAL_PLAYER_OBJECT.hideButtonHint("A");
		}

		if (this.inputIsActive("S") && !this.keySHasBeenPressed) {
			this.keySHasBeenPressed = true;
			GLOBAL_PLAYER_OBJECT.hideButtonHint("S");
		}

		if (this.inputIsActive("D") && !this.keyDHasBeenPressed) {
			this.keyDHasBeenPressed = true;
			GLOBAL_PLAYER_OBJECT.hideButtonHint("D");
		}
}








//can be cleaned up, didnt quite understand the stack overflow solutions
Player.prototype.hideButtonHint = function(key) {

	var autoStart = false;
	var fadeToAlpha = 1;
	var fadeInTime = 50;
	var fadeOutTime = 200;
	var hideScale = this.buttonScale + 0.2;
	var gradientFadeOutTime = 300;
	var gradientAlpha = 0.25;
	var buttonName = "";
	var hideDelay = 0;


	buttonName = "button" + key.toUpperCase()
	gradientName = "button" + key.toUpperCase() + "Gradient"

	this.buttonTweenHideAlpha = game.add.tween(this[buttonName]);
	this.buttonTweenHideAlpha
	.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, hideDelay, 0, false)
	.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, hideDelay, 0, false)
	.start();


	this.buttonTweenHideScale = game.add.tween(this[buttonName].scale);
	this.buttonTweenHideScale
	.to( { x: hideScale, y: hideScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, hideDelay, 0, false)
	.start();


	this.buttonGradientTweenHideAlpha = game.add.tween(this[gradientName]);
	this.buttonGradientTweenHideAlpha
	.to( { alpha: gradientAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, hideDelay, 0, false)
	.to( { alpha: 0 }, gradientFadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, hideDelay, 0, false)
	.start();


	this.buttonGradientTweenHideScale = game.add.tween(this[gradientName].scale);
	this.buttonGradientTweenHideScale
	.to( { x: hideScale, y: hideScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, hideDelay, 0, false)
	.start();
}



