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
	this.feedbackState = 0;
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
			this.entityParentObject.usePrompt.unHide();
			this.entityParentObject.startCanPickUpFeedback();
		}, this);

		fillTweenScale.onComplete.add(function() 
		{

		}, this);

	};

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
			this.entityParentObject.usePrompt.hide();
			this.entityParentObject.stopCanPickUpFeedback();
		}, this);

		fillTweenScale.onComplete.add(function() 
		{

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
	if (this.distanceToPlayer <= this.usableRange && this.feedbackState == 0 && this.isActive) 
	{ 
		this.feedbackState = 1;
		this.showEnterRadiusFeedback();
	}


	//if not within range and the feedback state isn't reflecting this
	else if (this.distanceToPlayer >= this.usableRange && this.feedbackState == 1 && this.isActive)
	{
		this.feedbackState = 0;
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