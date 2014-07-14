var GLOBAL_USERADIUS_ARRAY = [];
var GLOBAL_USERADIUS_GROUP = null;

function UseRadius(entityParentObject, scale) {

	//adds to global entities array
	GLOBAL_USERADIUS_ARRAY[GLOBAL_USERADIUS_ARRAY.length] = this;


	//member vars set by constructor
	this.group = entityParentObject.useRadiusGroup;
	this.entityParent = entityParentObject.entity;
	this.entityParentObject = entityParentObject;


	//object tweakable parameters
	this.usableRange = 55;
	this.inRangeAlpha = 0.35;
	this.visibleRange = 150;


	//initial values of variables controlled by functions
	this.feedbackState = "LeaveRadius";
	this.distanceToPlayer = 1000;
	this.distanceToPlayerAlpha = 0;


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



	//tween local vars
	var enterTime = 325;
	var leaveTime = 250;
	var autoStart = false;

	var leaveVisibleRangeTime = 500;
	var shrunkScale = -0.03;


	//tweens for enter feedback
	this.borderTweenAlphaEnter = game.add.tween(this.radiusBorder);
	this.borderTweenAlphaEnter.to( { alpha: 0.6 }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
	this.borderTweenScaleEnter = game.add.tween(this.radiusBorder.scale);
	this.borderTweenScaleEnter.to( { x: scale + shrunkScale, y: scale + shrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);

	this.fillTweenAlphaEnter = game.add.tween(this.radiusFill);
	this.fillTweenAlphaEnter.to( { alpha: 0.3 }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
	this.fillTweenScaleEnter = game.add.tween(this.radiusFill.scale);
	this.fillTweenScaleEnter.to( { x: scale + shrunkScale, y: scale + shrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);


	//tweens for leave feedback
	this.fillTweenAlphaLeave = game.add.tween(this.radiusFill);
	this.fillTweenAlphaLeave.to( { alpha: 0 }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.fillTweenScaleLeave = game.add.tween(this.radiusFill.scale);
	this.fillTweenScaleLeave.to( { x: scale, y: scale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

	this.borderTweenAlphaLeave = game.add.tween(this.radiusBorder);
	this.borderTweenAlphaLeave.to( { alpha: this.inRangeAlpha }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.borderTweenScaleLeave = game.add.tween(this.radiusBorder.scale);
	this.borderTweenScaleLeave.to( { x: scale, y: scale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

};



UseRadius.prototype.showEnterRadiusFeedback = function()
{
	//bounces the useradius and fill in
	this.borderTweenAlphaEnter.start();
	this.borderTweenScaleEnter.start();

	this.fillTweenAlphaEnter.start();
	this.fillTweenScaleEnter.start();
};



UseRadius.prototype.showLeaveRadiusFeedback = function()
{
	//fades the useradius and fill out
	//this.borderTweenAlphaLeave.start() - /*removed because the alpha based on distance looks nicer than linear tween*/
	this.borderTweenScaleLeave.start();

	this.fillTweenAlphaLeave.start();
	this.fillTweenScaleLeave.start();	
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
	if (this.distanceToPlayer >= this.usableRange && !this.borderTweenAlphaLeave.isRunning) 
	{
		this.radiusBorder.alpha = this.distanceToPlayerAlpha;

	}
};

