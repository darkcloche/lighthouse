var USERADIUS_ARRAY = [];
var USERADIUS_GROUP = null; //for depth sorting

function UseRadius(entityParentObject) {

	//adds to global entities array
	USERADIUS_ARRAY[USERADIUS_ARRAY.length] = this;


	//member vars set by constructor
	this.entityParent = entityParentObject.entity;
	this.entityParentObject = entityParentObject;
	this.group = entityParentObject.useRadiusGroup;


	//object tweakable parameters
	this.usableRange = 60;
	this.inRangeAlpha = 0.35;
	this.visibleRange = 150;


	//initial values of variables 
	this.feedbackState = "LeaveRadius";
	this.distanceToPlayer = 1000;
	this.distanceToPlayerAlpha = 0;
	this.isActive = true;


	//creates useradius elements, sets scale and anchor
	this.radiusBorder = game.add.sprite(0, 0, "radiusBorder");
	this.radiusBorder.anchor.setTo(0.5, 0.5);
	this.radiusBorder.alpha = 0;
	USERADIUS_GROUP.add(this.radiusBorder);
	this.group.add(this.radiusBorder);

	this.radiusFill = game.add.sprite(0, 0, "radiusFill");
	this.radiusFill.anchor.setTo(0.5, 0.5);
	this.radiusFill.alpha = 0;
	USERADIUS_GROUP.add(this.radiusFill);
	this.group.add(this.radiusFill);
}


UseRadius.prototype.showEnterRadiusFeedback = function()
{
	if (borderTweenAlpha == undefined) {

		var time = 325;
		var autoStart = false;
		var shrunkScale = 0.95;
		var borderAlpha = 0.6;
		var fillAlpha = 0.3;

		var borderTweenAlpha = game.add.tween(this.radiusBorder);
		var borderTweenScale = game.add.tween(this.radiusBorder.scale);
		var fillTweenAlpha = game.add.tween(this.radiusFill);
		var fillTweenScale = game.add.tween(this.radiusFill.scale);

		borderTweenAlpha.to( { alpha: borderAlpha }, time, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		borderTweenScale.to( { x: shrunkScale, y: shrunkScale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false)
		fillTweenAlpha.to( { alpha: fillAlpha }, time, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		fillTweenScale.to( { x: shrunkScale, y: shrunkScale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);

		fillTweenScale.onStart.add(function() 
		{
			PLAYER_OBJECT.usePrompt.unHide();
			this.entityParentObject.startCanPickUpFeedback();
		}, this);

		fillTweenScale.onComplete.add(function() 
		{

		}, this);

	};

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
		var scale = 1;
		
		var borderTweenAlpha = game.add.tween(this.radiusBorder);
		var borderTweenScale = game.add.tween(this.radiusBorder.scale);
		var fillTweenAlpha = game.add.tween(this.radiusFill);
		var fillTweenScale = game.add.tween(this.radiusFill.scale);

		// borderTweenAlpha.to( { alpha: this.inRangeAlpha }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		borderTweenScale.to( { x: scale, y: scale }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenAlpha.to( { alpha: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		fillTweenScale.to( { x: scale, y: scale }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

		fillTweenScale.onStart.add(function() 
		{
			PLAYER_OBJECT.usePrompt.hide();
			this.entityParentObject.stopCanPickUpFeedback();
		}, this);

		fillTweenScale.onComplete.add(function() 
		{
			CURRENT_USABLE_ENTITY_OBJECT = false;
		}, this);
	};

	//this.borderTweenAlpha.start() - removed because the alpha based on distance looks nicer than linear tween
	borderTweenScale.start();

	fillTweenAlpha.start();
	fillTweenScale.start();	
}



UseRadius.prototype.showUsedFeedback = function()
{

	if (borderTweenAlpha == undefined) {

		var moveTime = 250;
		var scaleTime = 375;
		var autoStart = false; 
		var playerX = PLAYER.x; 
		var playerY = PLAYER.y;
		var posOffsetX = -this.entityParent.x;	//don't like that i'm doing these offsets but couldn't see better solution
		var posOffsetY = -this.entityParent.y;
		var endScale = 0;
		var endAlpha = 0;

		var borderTweenAlpha = game.add.tween(this.radiusBorder);
		var borderTweenScale = game.add.tween(this.radiusBorder.scale);
		var borderTweenPos = game.add.tween(this.radiusBorder);

		var fillTweenAlpha = game.add.tween(this.radiusFill);
		var fillTweenScale = game.add.tween(this.radiusFill.scale);
		var fillTweenPos = game.add.tween(this.radiusFill);

		borderTweenAlpha.to( { alpha: endAlpha }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
		borderTweenScale.to( { x: endScale, y: endScale }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
		borderTweenPos.to( { x: posOffsetX, y: posOffsetY }, moveTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);

		fillTweenAlpha.to( { alpha: endAlpha }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
		fillTweenScale.to( { x: endScale, y: endScale }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
		fillTweenPos.to( { x: posOffsetX, y: posOffsetY }, moveTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);

		fillTweenPos.onStart.add(function() 
		{
			CURRENT_USABLE_ENTITY_OBJECT = false;
			this.isActive = false;
			this.entityParentObject.stopCanPickUpFeedback();
		}, this);

		fillTweenPos.onComplete.add(function() 
		{

		}, this);
	};

	this.isActive = false;

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
	this.distanceToPlayer = game.physics.arcade.distanceBetween(PLAYER, this.entityParent);
}



//updates feebdack to be correct based on player when called
UseRadius.prototype.updateEnterRadiusFeedback = function()
{
	//show in radius feedback if f within range and the feedback state is not reflecting this
	if (this.distanceToPlayer <= this.usableRange && this.feedbackState == "LeaveRadius" && this.isActive) 
	{ 
		this.feedbackState = "EnterRadius";
		this.showEnterRadiusFeedback();
	}


	//if not within range and the feedback state isn't reflecting this
	else if (this.distanceToPlayer >= this.usableRange && this.feedbackState == "EnterRadius" && this.isActive)
	{
		this.feedbackState = "LeaveRadius";
		this.showLeaveRadiusFeedback();
	}
}



//updates the alpha on the useradius based on player distance
UseRadius.prototype.updateNearRadiusFeedback = function()
{
	if (this.isActive) 
	{
		//intended alpha moves between 0 and inRangeAlpha depending on player distance
		this.distanceToPlayerAlpha = this.inRangeAlpha - (this.inRangeAlpha * (this.distanceToPlayer / this.visibleRange));

		//stops the alpha value being < 0
		if (this.distanceToPlayerAlpha < 0) 
		{
			this.distanceToPlayerAlpha = 0;
		}

		//if the player isn't inside the radius but is within visibleRange, fade in the useradius border
		if (this.distanceToPlayer >= this.usableRange) 
		{
			this.radiusBorder.alpha = this.distanceToPlayerAlpha;
		}
	}
}






















var ACTIVE_HINTS_ARRAY = [];
var HINTS_GROUP = null;

function Hint(buttonType, startEnabled, group, offsetX, offsetY, callback)
{

	//tweakable vars
	this.buttonScale = 1;


	//adds enttiy to global entities array
	ACTIVE_HINTS_ARRAY[ACTIVE_HINTS_ARRAY.length] = this;


	//init state of some vars
	this.isVisible = false; //is true when it is at all visible (during tweens included)
	this.hasBeenPressed = false;
	this.buttonType = buttonType.toUpperCase();
	this.callback = callback;


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


	//controls initial state
	if (startEnabled)
	{
		this.unHide(true);
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
		}, this);
	}

	this.buttonTweenHide.start();
}



Hint.prototype.unHide = function(isRandomlyDelayed) 
{
	//gets to it to only call once
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

		tweenPressedAlpha.to( { alpha: fadeToAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		tweenPressedAlpha.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		tweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);

		gradientTweenPressedAlpha.to( { alpha: gradientAlpha }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);
		gradientTweenPressedAlpha.to( { alpha: 0 }, gradientFadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
		gradientTweenPressedScale.to( { x: pressedScale, y: pressedScale }, fadeInTime, Phaser.Easing.Linear.InOut, autoStart, delay, 0, false);

		gradientTweenPressedScale.onStart.add(function() 
		{	
			if (this.callback == PLAYER_OBJECT.doPickUpEntity)
			{
				this.callback();
			}
		}, this);

		gradientTweenPressedScale.onComplete.add(function() 
		{
			this.isVisible = false;
		}, this);
	}

	this.buttonTweenUnHide.stop();
	tweenPressedAlpha.start();
	tweenPressedScale.start();
	gradientTweenPressedAlpha.start();
	gradientTweenPressedScale.start();
	return true;
}