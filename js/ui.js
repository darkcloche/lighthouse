var GLOBAL_USERADIUS_ARRAY = [];
var GLOBAL_USERADIUS_GROUP = null; //for depth sorting

function UseRadius(entityParentObject, scale) {

	//adds to global entities array
	GLOBAL_USERADIUS_ARRAY[GLOBAL_USERADIUS_ARRAY.length] = this;


	//member vars set by constructor
	this.entityParent = entityParentObject.entity;
	this.entityParentObject = entityParentObject;
	this.scale = scale;
	var group = entityParentObject.useRadiusGroup;


	//object tweakable parameters
	this.usableRange = 55;
	this.inRangeAlpha = 0.35;
	this.visibleRange = 150;


	//initial values of variables 
	this.feedbackState = "LeaveRadius";
	this.distanceToPlayer = 1000;
	this.distanceToPlayerAlpha = 0;
	this.isTweening = false;
	this.active = true;


	//creates useradius elements, sets scale and anchor
	this.radiusBorder = game.add.sprite(0, 0, "radiusBorder");
	this.radiusBorder.anchor.setTo(0.5, 0.5);
	this.radiusBorder.scale.x = this.radiusBorder.scale.y = scale;
	this.radiusBorder.alpha = 0;
	GLOBAL_USERADIUS_GROUP.add(this.radiusBorder);
	group.add(this.radiusBorder);

	this.radiusFill = game.add.sprite(0, 0, "radiusFill");
	this.radiusFill.anchor.setTo(0.5, 0.5);
	this.radiusFill.scale.x = this.radiusFill.scale.y = scale;
	this.radiusFill.alpha = 0;
	GLOBAL_USERADIUS_GROUP.add(this.radiusFill);
	group.add(this.radiusFill);
}


UseRadius.prototype.showEnterRadiusFeedback = function()
{
	if (borderTweenAlpha == undefined) {

		var time = 325;
		var autoStart = false;
		var shrunkScale = -0.03;
		var borderAlpha = 0.6;
		var fillAlpha = 0.3;

		var borderTweenAlpha = game.add.tween(this.radiusBorder);
		var borderTweenScale = game.add.tween(this.radiusBorder.scale);
		var fillTweenAlpha = game.add.tween(this.radiusFill);
		var fillTweenScale = game.add.tween(this.radiusFill.scale);

		borderTweenAlpha.to( { alpha: borderAlpha }, time, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		borderTweenScale.to( { x: this.scale + shrunkScale, y: this.scale + shrunkScale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false)
		fillTweenAlpha.to( { alpha: fillAlpha }, time, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		fillTweenScale.to( { x: this.scale + shrunkScale, y: this.scale + shrunkScale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
		fillTweenScale.onComplete.add(function() 
		{
			this.isTweening = false;
		}, this);

	};

	this.isTweening = true;
	CURRENT_USABLE_ENTITY_OBJECT = this.entityParentObject;

	borderTweenAlpha.start();
	borderTweenScale.start();

	fillTweenAlpha.start();
	fillTweenScale.start();
}



UseRadius.prototype.showLeaveRadiusFeedback = function()
{
	if (borderTweenAlpha == undefined) {

		var time = 250;
		var autoStart = false;
		
		var borderTweenAlpha = game.add.tween(this.radiusBorder);
		var borderTweenScale = game.add.tween(this.radiusBorder.scale);
		var fillTweenAlpha = game.add.tween(this.radiusFill);
		var fillTweenScale = game.add.tween(this.radiusFill.scale);

		borderTweenAlpha.to( { alpha: this.inRangeAlpha }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		borderTweenScale.to( { x: this.scale, y: this.scale }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenAlpha.to( { alpha: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenScale.to( { x: this.scale, y: this.scale }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenScale.onComplete.add(function() 
		{
			this.isTweening = false;
		}, this);
	};

	this.isTweening = true;
	CURRENT_USABLE_ENTITY_OBJECT = false;


	//this.borderTweenAlpha.start() - removed because the alpha based on distance looks nicer than linear tween
	borderTweenScale.start();

	fillTweenAlpha.start();
	fillTweenScale.start();	
}



UseRadius.prototype.showUsedFeedback = function()
{

	if (borderTweenAlpha == undefined) {

		var time = 150;
		var autoStart = false; 
		var playerX = GLOBAL_PLAYER.x;
		var playerY = GLOBAL_PLAYER.y;
		var borderFillOffsetX = -380;
		var borderFillOffsetY = -100;

		var borderTweenAlpha = game.add.tween(this.radiusBorder);
		var borderTweenScale = game.add.tween(this.radiusBorder.scale);
		var borderTweenPos = game.add.tween(this.radiusBorder);

		var fillTweenAlpha = game.add.tween(this.radiusFill);
		var fillTweenScale = game.add.tween(this.radiusFill.scale);
		var fillTweenPos = game.add.tween(this.radiusFill);

		borderTweenAlpha.to( { alpha: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		borderTweenScale.to( { x: 0, y: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		borderTweenPos.to( { x: playerX + borderFillOffsetX, y: playerY + borderFillOffsetY }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

		fillTweenAlpha.to( { alpha: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenScale.to( { x: 0, y: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenPos.to( { x: playerX + borderFillOffsetX, y: playerY + borderFillOffsetY }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenPos.onComplete.add(function() 
		{
			this.isTweening = false;
			CURRENT_USABLE_ENTITY_OBJECT = false;
		}, this);

	};

	this.isTweening = true;
	this.active = true;

	borderTweenAlpha.start();
	borderTweenScale.start();
	borderTweenPos.start();

	fillTweenAlpha.start();
	fillTweenScale.start();
	fillTweenPos.start();

}



//keeps local distance to player updated every frame for use by other functions
UseRadius.prototype.updateClosestPlayerDistance = function()
{
	this.distanceToPlayer = game.physics.arcade.distanceBetween(GLOBAL_PLAYER, this.entityParent);
}



//updates feebdack to be correct based on player when called
UseRadius.prototype.updateEnterRadiusFeedback = function()
{
	//show in radius feedback if f within range and the feedback state is not reflecting this
	if (this.distanceToPlayer <= this.usableRange && this.feedbackState == "LeaveRadius") 
	{ 
		this.feedbackState = "EnterRadius";
		this.showEnterRadiusFeedback();
	}


	//if not within range and the feedback state isn't reflecting this
	else if (this.distanceToPlayer >= this.usableRange && this.feedbackState == "EnterRadius")
	{
		this.feedbackState = "LeaveRadius";
		this.showLeaveRadiusFeedback();
	}
}



//updates the alpha on the useradius based on player distance
UseRadius.prototype.updateNearRadiusFeedback = function()
{
	var intendedAlpha = this.inRangeAlpha - (this.inRangeAlpha * (this.distanceToPlayer / this.visibleRange));

	//stops the alpha value being < 0
	if (intendedAlpha < 0) 
	{
		this.distanceToPlayerAlpha = 0;
	}

	else 
	{
		this.distanceToPlayerAlpha = intendedAlpha;
	}

	//if the player isn't inside the radius but is within visibleRange, fade in the useradius border
	if (this.distanceToPlayer >= this.usableRange && !this.isTweening) 
	{
		this.radiusBorder.alpha = this.distanceToPlayerAlpha;

	}

}






















var GLOBAL_ACTIVE_HINTS_ARRAY = [];
var GLOBAL_HINTS_GROUP = null;

function Hint(buttonType, startEnabled, group, offsetX, offsetY, callback)
{

	//tweakable vars
	this.buttonScale = 0.8;


	//adds enttiy to global entities array
	GLOBAL_ACTIVE_HINTS_ARRAY[GLOBAL_ACTIVE_HINTS_ARRAY.length] = this;


	//init state of some vars
	this.isVisible = false;
	this.isTweening = false;
	this.hasBeenPressed = false;
	this.buttonType = buttonType.toUpperCase();
	this.callback = callback;


	//button sprite
	this.button = game.add.sprite(group.x + offsetX, group.y + offsetY, "button" + this.buttonType);
	this.button.alpha = 0;
	this.button.anchor.setTo(0.5, 0.5);	
	this.button.scale.x = this.button.scale.y = this.buttonScale;
	GLOBAL_HINTS_GROUP.add(this.button);
	group.add(this.button);


	//gradient sprite
	this.gradient = game.add.sprite(group.x + offsetX, group.y + offsetY, "buttonGradient");
	this.gradient.alpha = 0;
	this.gradient.anchor.setTo(0.5, 0.5);
	this.gradient.scale.x = this.gradient.scale.y = this.buttonScale;
	GLOBAL_HINTS_GROUP.add(this.gradient);
	group.add(this.gradient);


	//controls initial state
	if (startEnabled)
	{
		this.unHide(true);
	}

}



Hint.prototype.updatePressedState = function() 
{
	if (GLOBAL_PLAYER_OBJECT.inputIsActive(this.buttonType) && !this.hasBeenPressed && this.isVisible)  //add something involving a timeout to clean this up
	{
		this.pressed();
	}
}




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
		}

		var buttonTweenUnHide = game.add.tween(this.button)
		buttonTweenUnHide.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false)
		buttonTweenUnHide.onComplete.add(function() 
		{
			this.isTweening = false;
		}, this);
	}

	if (this.isTweening == false)
	{
		this.isTweening = true;
		this.isVisible = true;
		buttonTweenUnHide.start();
		return true;
	}

	else
	{
		return false;
	}

}



Hint.prototype.hide = function() 
{
	if (this.buttonTweenHide == undefined) //gets to it to only call once
	{
		var fadeOutTime = 250;
		var autoStart = false;
		var delay = 0;

		var buttonTweenHide = game.add.tween(this.button);
		buttonTweenHide.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false)
		buttonTweenHide.onComplete.add(function() 
		{
			this.isTweening = false;
			this.isVisible = false;
		}, this);
	}


	if (this.isTweening == false)
	{
		this.isTweening = true;
		buttonTweenHide.start();
		return true;
	}

	else
	{
		return false;
	}

}



Hint.prototype.pressed = function() 
{
	if (tweenPressedAlpha == undefined) //gets to it to only call once
	{
		var autoStart = false;
		var delay = 0;
		var fadeToAlpha = 1;
		var fadeInTime = 50;
		var fadeOutTime = 200;
		var pressedScale = this.buttonScale + 0.2;
		var gradientFadeOutTime = 300;
		var gradientAlpha = 0.4;


		var tweenPressedAlpha = game.add.tween(this.button);
		var tweenPressedScale = game.add.tween(this.button.scale);
		var gradientTweenPressedAlpha = game.add.tween(this.gradient);
		var gradientTweenPressedScale = game.add.tween(this.gradient.scale);	


		tweenPressedAlpha.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false)
		tweenPressedAlpha.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false)
		tweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		gradientTweenPressedAlpha.to( { alpha: gradientAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false)
		gradientTweenPressedAlpha.to( { alpha: 0 }, gradientFadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		gradientTweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		gradientTweenPressedScale.onComplete.add(function() 
			{
				this.isTweening = false;
				this.isVisible = false;
				if (this.callback !== undefined) 
				{
					this.callback();
				}
			}, this);
	}


	if (!this.hasBeenPressed) {

		this.isTweening = true;
		this.hasBeenPressed = true;

		tweenPressedAlpha.start();
		tweenPressedScale.start();

		gradientTweenPressedAlpha.start();
		gradientTweenPressedScale.start();

		return true;
	}
}