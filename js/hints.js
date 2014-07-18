var ACTIVE_HINTS_ARRAY = [];
var HINTS_GROUP = null;

function Hint(buttonType, startEnabled, group, offsetX, offsetY, entityParentObject, callback)
{
	//tweakable vars
	this.buttonScale = 1;


	//adds enttiy to global entities array
	ACTIVE_HINTS_ARRAY[ACTIVE_HINTS_ARRAY.length] = this;


	//member vars set by constructor params
	this.entityParentObject = entityParentObject;
	this.group = group;
	this.offsetX = offsetX;
	this.offsetY = offsetY;


	//init state of some vars
	this.isVisible = false; //is true when it is at all visible (during tweens included)
	this.hasBeenPressed = false;
	this.buttonType = buttonType.toUpperCase();
	this.callback = callback;
	this.offsetDirection = 1;


	//button sprite
	this.button = game.add.sprite(group.x + offsetX, group.y + offsetY, "button" + this.buttonType);
	this.button.alpha = 0;
	this.button.anchor.setTo(0.5, 0.5);	
	this.button.scale.x = this.button.scale.y = this.buttonScale;
	HINTS_GROUP.add(this.button);
	group.add(this.button);


	//gradient sprite
	this.gradient = game.add.sprite(group.x + offsetX, group.y + offsetY, "buttonGradient");
	this.gradient.alpha = 0;
	this.gradient.anchor.setTo(0.5, 0.5);
	this.gradient.scale.x = this.gradient.scale.y = this.buttonScale;
	HINTS_GROUP.add(this.gradient);
	group.add(this.gradient);


	//different creation outcomes based on params
	if (this.callback == PLAYER_OBJECT.doPickUpEntity)
	{
		this.isAttachedToEntity = true;
	}

	if (startEnabled)
	{
		this.unHide(true);
	}

}



Hint.prototype.updateOffset = function() 
{
	if (this.isAttachedToEntity) 
	{
		if (!this.isVisible) //this updates the offset direction that the hint should be at so when the hint enables, it shifts to the correct pos
		{
			if (PLAYER.y < this.entityParentObject.entity.y) 
			{
				this.offsetDirection = 0;
			}

			else
			{
				this.offsetDirection = 1;
			}
		}

		if (this.isVisible && CURRENT_USABLE_ENTITY_OBJECT != false)
		{
			if (PLAYER.y < this.entityParentObject.entity.y && this.offsetDirection == 0)
			{
				this.offsetDirection = 1;
				this.moveHintOffsetDown();
			}

			if (PLAYER.y > this.entityParentObject.entity.y && this.offsetDirection == 1)
			{
				this.offsetDirection = 0;
				this.moveHintOffsetUp();
			}
		}
	}	
}



Hint.prototype.updatePressedState = function() 
{
	if (PLAYER_OBJECT.inputIsActive(this.buttonType) && !this.hasBeenPressed && this.isVisible) 
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

		this.buttonTweenHide.onStart.add(function() 
		{

		}, this);

		this.buttonTweenHide.onComplete.add(function() 
		{
			this.isVisible = false;
			if (!this.buttonTweenUnHide.isRunning) 
			{
				CURRENT_USABLE_ENTITY_OBJECT = false;
			}
		}, this);
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
			CURRENT_USABLE_ENTITY_OBJECT = this.entityParentObject;
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

		this.buttonTweenPressedAlpha.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		this.buttonTweenPressedAlpha.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		this.buttonTweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);

		this.gradientTweenPressedAlpha.to( { alpha: gradientAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		this.gradientTweenPressedAlpha.to( { alpha: 0 }, gradientFadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		this.gradientTweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);

		this.gradientTweenPressedScale.onStart.add(function() 
		{	
			if (this.isAttachedToEntity)
			{
				this.callback();
				CURRENT_USABLE_ENTITY_OBJECT = false;
			}
		}, this);

		this.gradientTweenPressedScale.onComplete.add(function() 
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
		var posY = this.group.y - this.offsetY;

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
		var posY = this.group.y + this.offsetY;

		this.buttonTweenMoveOffsetDownUp = game.add.tween(this.button);
		this.gradientTweenMoveOffsetDownUp = game.add.tween(this.gradient);

		this.buttonTweenMoveOffsetDownUp.to( { y: posY }, time, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		this.gradientTweenMoveOffsetDownUp.to( { y: posY }, time, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
	}

	this.buttonTweenMoveOffsetDownUp.start();
	this.gradientTweenMoveOffsetDownUp.start();
}