var ACTIVE_HINTS_ARRAY = [];
var HINTS_GROUP = null;


function Hint(buttonType, startEnabled, group, offsetX, offsetY, parentObject, action)
{
	//tweakable vars
	this.buttonScale = 1;


	//adds enttiy to global entities array
	ACTIVE_HINTS_ARRAY[ACTIVE_HINTS_ARRAY.length] = this;


	//member vars set by constructor params
	this.parentObject = parentObject;
	this.group = group;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.buttonType = buttonType;

	//sets a different hint parent (used by updating offset positions) based on type of parent object
	if (parentObject == PLAYER_OBJECT)
	{
		this.hintParent = PLAYER;
	}

	else 
	{
		this.hintParent = parentObject.entity;
	}


	//init state of some vars
	this.isVisible = false; //is true when it is at all visible (during tweens included)
	this.hasBeenPressed = false;
	this.buttonType = buttonType;
	this.offsetDirection = 1;


	//button sprite
	this.button = game.add.sprite(offsetX, offsetY, "button" + this.buttonType);
	this.button.alpha = 0;
	this.button.anchor.setTo(0.5, 0.5);	
	this.button.scale.x = this.button.scale.y = this.buttonScale;
	HINTS_GROUP.add(this.button);
	group.add(this.button);


	//gradient sprite
	this.gradient = game.add.sprite(offsetX, offsetY, "buttonGradient");
	this.gradient.alpha = 0;
	this.gradient.anchor.setTo(0.5, 0.5);
	this.gradient.scale.x = this.gradient.scale.y = this.buttonScale;
	HINTS_GROUP.add(this.gradient);
	group.add(this.gradient);

	//conditional start
	if (startEnabled)
	{
		this.unHide(true);
	}
}



Hint.prototype.updateOffset = function() 
{
	if (!this.hasBeenPressed && this.hintParent !== PLAYER)
	{
		if (!this.isVisible) //this updates the offset direction that the hint should be at so when the hint enables, it shifts to the correct pos
		{
			if (PLAYER.y < this.parentObject.entity.y) 
			{
				this.offsetDirection = 0;
			}

			else
			{
				this.offsetDirection = 1;
			}
		}

		if (this.isVisible)
		{
			if (PLAYER.y < this.parentObject.entity.y && this.offsetDirection == 0)
			{
				this.offsetDirection = 1;
				this.moveHintOffsetDown();
			}

			if (PLAYER.y > this.parentObject.entity.y && this.offsetDirection == 1)
			{
				this.offsetDirection = 0;
				this.moveHintOffsetUp();
			}
		}
	}
}



Hint.prototype.forceUpdateOffset = function() 
{
	if (PLAYER.y < this.parentObject.entity.y) 
	{
		this.button.y=  -this.offsetY;
		this.gradient.y = -this.offsetY;
	}

	else
	{
		this.button.y = this.offsetY;
		this.gradient.y = this.offsetY;
	}
}



Hint.prototype.updatePressedState = function() 
{
	if (game.input.keyboard.isDown(Phaser.Keyboard[this.buttonType]) && !this.hasBeenPressed && this.isVisible) 
	{
		this.pressed();
		this.hasBeenPressed = true;
	}
}



Hint.prototype.hide = function() 
{
	//gets to it to only call once
	if (this.buttonTweenHide == undefined) 
	{
		var fadeOutTime = 200;
		var autoStart = false;
		var delay = 0;

		this.buttonTweenHide = game.add.tween(this.button);
		this.buttonTweenHide.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
	}

	this.buttonTweenHide.start();
}



Hint.prototype.unHide = function(isRandomlyDelayed) 
{
	if (this.buttonTweenUnHide == undefined)
	{
		var fadeInTime = 300;
		var fadeToAlpha = 0.6;
		var autoStart = false;
		var delay = 0;

		if (isRandomlyDelayed) {
			delay = game.rnd.integerInRange(100, 250);
		}

		this.buttonTweenUnHide = game.add.tween(this.button)
		this.buttonTweenUnHide.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);

		this.buttonTweenUnHide.onStart.add(function() 
		{
			this.isVisible = true;
		}, this);

		this.buttonTweenUnHide.onComplete.add(function() 
		{

		}, this);
	}

	this.buttonTweenUnHide.start();
}



Hint.prototype.pressed = function() 
{
	if (this.buttonTweenPressedAlpha == undefined)
	{
		var autoStart = false;
		var delay = 0;
		var fadeToAlpha = 1;
		var fadeInTime = 50;
		var fadeOutTime = 200;
		var pressedScale = this.buttonScale + 0.2;
		var gradientFadeOutTime = 300;
		var gradientAlpha = 0.4;

		this.buttonTweenPressedAlpha = game.add.tween(this.button);
		this.buttonTweenPressedScale = game.add.tween(this.button.scale);
		this.gradientTweenPressedAlpha = game.add.tween(this.gradient);
		this.gradientTweenPressedScale = game.add.tween(this.gradient.scale);	

		this.gradientTweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		this.gradientTweenPressedAlpha.to( { alpha: gradientAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		this.gradientTweenPressedAlpha.to( { alpha: 0 }, gradientFadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);

		this.buttonTweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		this.buttonTweenPressedAlpha.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		this.buttonTweenPressedAlpha.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		this.buttonTweenPressedAlpha.onStart.add(function() 
		{	

		}, this);

		this.buttonTweenPressedAlpha._lastChild.onComplete.add(function() 
		{
			this.isVisible = false;
		}, this);
	}

	this.buttonTweenUnHide.stop();
	this.buttonTweenPressedAlpha.start();
	this.buttonTweenPressedScale.start();
	this.gradientTweenPressedAlpha.start();
	this.gradientTweenPressedScale.start();
	return true;
}




Hint.prototype.moveHintOffsetDown = function() 
{
	if (this.tweenMoveOffsetDown == undefined)
	{
		var autoStart = false;
		var time = 300;
		var delay = 0;
		var posY = -this.offsetY;

		this.buttonTweenMoveOffsetDown = game.add.tween(this.button);
		this.gradientTweenMoveOffsetDown = game.add.tween(this.gradient);

		this.buttonTweenMoveOffsetDown.to( { y: posY }, time, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		this.gradientTweenMoveOffsetDown.to( { y: posY }, time, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
	}

	this.buttonTweenMoveOffsetDown.start();
	this.gradientTweenMoveOffsetDown.start();
}



Hint.prototype.moveHintOffsetUp = function() 
{
	if (this.tweenMoveOffsetDownUp == undefined)
	{
		var autoStart = false;
		var time = 300;
		var delay = 0;
		var posY = this.offsetY;

		this.buttonTweenMoveOffsetDownUp = game.add.tween(this.button);
		this.gradientTweenMoveOffsetDownUp = game.add.tween(this.gradient);

		this.buttonTweenMoveOffsetDownUp.to( { y: posY }, time, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		this.gradientTweenMoveOffsetDownUp.to( { y: posY }, time, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
	}

	this.buttonTweenMoveOffsetDownUp.start();
	this.gradientTweenMoveOffsetDownUp.start();
}