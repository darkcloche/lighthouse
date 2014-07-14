var GLOBAL_ACTIVE_HINTS_ARRAY = [];
var GLOBAL_HINTS_GROUP = null;

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
	GLOBAL_HINTS_GROUP.add(this.button);
	this.button.alpha = 0;
	this.button.anchor.setTo(0.5, 0.5);	
	this.button.scale.x = this.button.scale.y = this.buttonScale;
	group.add(this.button);


	//gradient sprite
	this.gradient = game.add.sprite(group.x + offsetX, group.y + offsetY, "buttonGradient");
	GLOBAL_HINTS_GROUP.add(this.gradient);
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
	};

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
























var GLOBAL_USERADIUS_ARRAY = [];
var GLOBAL_USERADIUS_GROUP = null;

function UseRadius(entityParentObject, scale) {

	//adds to global entities array
	GLOBAL_USERADIUS_ARRAY[GLOBAL_USERADIUS_ARRAY.length] = this;


	//member vars set by constructor
	this.group = entityParentObject.useRadiusGroup;
	this.entityParent = entityParentObject.entity;
	this.entityParentObject = entityParentObject;
	this.scale = scale;


	//object tweakable parameters
	this.usableRange = 55;
	this.inRangeAlpha = 0.35;
	this.visibleRange = 150;


	//initial values of variables 
	this.feedbackState = "LeaveRadius";
	this.distanceToPlayer = 1000;
	this.distanceToPlayerAlpha = 0;
	this.isTweening = false;


	//creates useradius elements, sets scale and anchor
	this.radiusBorder = game.add.sprite(0, 0, "radiusBorder");
	GLOBAL_USERADIUS_GROUP.add(this.radiusBorder);
	this.radiusBorder.scale.x = this.radiusBorder.scale.y = scale;
	this.radiusBorder.anchor.setTo(0.5, 0.5);
	this.radiusBorder.alpha = 0;
	this.group.add(this.radiusBorder);

	this.radiusFill = game.add.sprite(0, 0, "radiusFill");
	GLOBAL_USERADIUS_GROUP.add(this.radiusFill);
	this.radiusFill.scale.x = this.radiusFill.scale.y = scale;
	this.radiusFill.anchor.setTo(0.5, 0.5);
	this.radiusFill.alpha = 0;
	this.group.add(this.radiusFill);

};



UseRadius.prototype.showEnterRadiusFeedback = function()
{
	if (borderTweenAlphaEnter == undefined) {

		var enterTime = 325;
		var autoStart = false;
		var shrunkScale = -0.03;
		var borderAlpha = 0.6;
		var fillAlpha = 0.3;

		var borderTweenAlphaEnter = game.add.tween(this.radiusBorder);
		borderTweenAlphaEnter.to( { alpha: borderAlpha }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		var borderTweenScaleEnter = game.add.tween(this.radiusBorder.scale);
		borderTweenScaleEnter
		.to( { x: this.scale + shrunkScale, y: this.scale + shrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false)
		.onComplete.add(function() 
		{
			this.isTweening = false;
		}, this);


		var fillTweenAlphaEnter = game.add.tween(this.radiusFill);
		fillTweenAlphaEnter.to( { alpha: fillAlpha }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		var fillTweenScaleEnter = game.add.tween(this.radiusFill.scale);
		fillTweenScaleEnter.to( { x: this.scale + shrunkScale, y: this.scale + shrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
	};

	this.isTweening = true;

	borderTweenAlphaEnter.start();
	borderTweenScaleEnter.start();

	fillTweenAlphaEnter.start();
	fillTweenScaleEnter.start();
};



UseRadius.prototype.showLeaveRadiusFeedback = function()
{
	if (borderTweenAlphaLeave == undefined) {

		var leaveTime = 250;
		var autoStart = false;
		var leaveVisibleRangeTime = 500;

		
		var borderTweenAlphaLeave = game.add.tween(this.radiusBorder);
		borderTweenAlphaLeave.to( { alpha: this.inRangeAlpha }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		var borderTweenScaleLeave = game.add.tween(this.radiusBorder.scale);
		borderTweenScaleLeave
		.to( { x: this.scale, y: this.scale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false)
		.onComplete.add(function() 
		{
			this.isTweening = false;
		}, this);

		
		var fillTweenAlphaLeave = game.add.tween(this.radiusFill); - 
		fillTweenAlphaLeave.to( { alpha: 0 }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		var fillTweenScaleLeave = game.add.tween(this.radiusFill.scale);
		fillTweenScaleLeave.to( { x: this.scale, y: this.scale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	};

	//this.borderTweenAlphaLeave.start() - removed because the alpha based on distance looks nicer than linear tween
	borderTweenScaleLeave.start();

	fillTweenAlphaLeave.start();
	fillTweenScaleLeave.start();	
};



//keeps local distance to player updated every frame for use by other functions
UseRadius.prototype.updateClosestPlayerDistance = function()
{
	this.distanceToPlayer = game.physics.arcade.distanceBetween(GLOBAL_PLAYER, this.entityParent);
};



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
};



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
};

















