var GLOBAL_ACTIVE_HINTS_ARRAY = [];

function Hint(buttonType, startEnabled, fadesIn, group, offsetX, offsetY)
{

	//tweakable vars
	this.buttonScale = 0.8;

	//adds enttiy to global entities array
	GLOBAL_ACTIVE_HINTS_ARRAY[GLOBAL_ACTIVE_HINTS_ARRAY.length] = this;


	//init state of some vars
	this.isVisible = false;
	this.hasBeenPressed = false;
	this.buttonType = buttonType.toUpperCase();


	//button sprite
	this.button = game.add.sprite(group.x + offsetX, group.y + offsetY, "button" + this.buttonType);
	this.button.alpha = 0;
	this.button.anchor.setTo(0.5, 0.5);	
	this.button.scale.x = this.button.scale.y = this.buttonScale;
	group.add(this.button);


	//gradient sprite
	this.gradient = game.add.sprite(group.x + offsetX, group.y + offsetY, "buttonGradient");
	this.gradient.alpha = 0;
	this.gradient.anchor.setTo(0.5, 0.5);
	this.gradient.scale.x = this.gradient.scale.y = this.buttonScale;
	group.add(this.gradient);


	//controls initial state
	if (startEnabled)
	{
		if (fadesIn) {
			this.button.alpha = 0;
			this.unHide(true);
		}

		else 
		{
			this.button.alpha = 1;
			this.isVisible = true;
		}
	}

};



Hint.prototype.unHide = function(isRandomlyDelayed) 
{

	if (buttonTweenUnHide == undefined) //gets to it to only call once
	{
		var fadeInTime = 300;
		var fadeToAlpha = 0.6;
		var autoStart = false;
		var delay = 0;

		if (isRandomlyDelayed) {
			delay = game.rnd.integerInRange(100, 250);
		};

		var buttonTweenUnHide = game.add.tween(this.button);
		buttonTweenUnHide
		.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false)
		.onComplete.add(function() {this.isVisible = true;}, this);
	}

	buttonTweenUnHide.start();
};



Hint.prototype.hide = function() 
{
	if (this.buttonTweenHide == undefined) //gets to it to only call once
	{
		var fadeOutTime = 250;
		var autoStart = false;
		var delay = 0;

		var buttonTweenHide = game.add.tween(this.button);
		buttonTweenHide
		.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false)
		.onComplete.add(function() {this.isVisible = false;}, this);
	}

	buttonTweenHide.start();
};



Hint.prototype.pressed = function() 
{
	if (buttonTweenPressedAlpha == undefined) //gets to it to only call once
	{
		var autoStart = false;
		var delay = 0;
		var fadeToAlpha = 1;
		var fadeInTime = 50;
		var fadeOutTime = 200;
		var pressedScale = this.buttonScale + 0.2;
		var gradientFadeOutTime = 300;
		var gradientAlpha = 0.4;


		var buttonTweenPressedAlpha = game.add.tween(this.button);
		buttonTweenPressedAlpha
		.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false)
		.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false)
		.onComplete.add(function() 
			{
				this.isVisible = false;
				this.hasBeenPressed = true;
			}, this);

		var buttonTweenPressedScale = game.add.tween(this.button.scale);
		buttonTweenPressedScale
		.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);

		var buttonGradientTweenPressedAlpha = game.add.tween(this.gradient);
		buttonGradientTweenPressedAlpha
		.to( { alpha: gradientAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false)
		.to( { alpha: 0 }, gradientFadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);


		var buttonGradientTweenPressedScale = game.add.tween(this.gradient.scale);
		buttonGradientTweenPressedScale
		.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
	}

	buttonTweenPressedAlpha.start();
	buttonTweenPressedScale.start();
	buttonGradientTweenPressedAlpha.start();
	buttonGradientTweenPressedScale.start();
};




Hint.prototype.updateState = function() 
{
	if (GLOBAL_PLAYER_OBJECT.inputIsActive(this.buttonType) && !this.hasBeenPressed && this.isVisible)  //add something involving a timeout to clean this up
	{
		this.hasBeenPressed = true;
		this.pressed();
	}
};




	















