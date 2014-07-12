var GLOBAL_ENTITIES_ARRAY = [];
var ENTITY_DICTIONARY = 
{
	light: 
		{ 
			textureName: "entityLight",
			scale: 0.5
		},

	blocker: 
		{ 
			textureName: "entityBlocker",
			scale: 0.4
		},
};


function Entity(type, x, y, scale)
{

	//initial variables for creation from function call
	this.type = type;
	this.x = x;
	this.y = y;
	this.useRadiusScale = scale;
	this.entityGroup = game.add.group();


	//object tweakable parameters
	this.usableRange = 55;
	this.useRadiusStartAlpha = 0.35;
	this.useRadiusVisibleRange = 150;


	//initial values of variables controlled by functions
	this.feedbackState = "LeaveRadius";
	this.distanceToPlayer = 1000;
	this.useRadiusDistanceToPlayerAlpha = 0;


	//adds relevant Entity type depending on object "type"
	var entityInfo = ENTITY_DICTIONARY[this.type];
	this.entity = game.add.sprite(x, y, entityInfo.textureName);
	this.entity.scale.x = this.entity.scale.y = entityInfo.scale;
	this.entity.anchor.setTo(0.5, 0.5);


	//creates useradius elements, sets scale and anchor
	this.useRadiusBorder = game.add.sprite(x, y, "useRadiusBorder");
	this.useRadiusBorder.scale.x = this.useRadiusBorder.scale.y = this.useRadiusScale;
	this.useRadiusBorder.anchor.setTo(0.5, 0.5);
	this.useRadiusBorder.alpha = 0;

	this.useRadiusFill = game.add.sprite(x, y, "useRadiusFill");
	this.useRadiusFill.scale.x = this.useRadiusFill.scale.y = this.useRadiusScale;
	this.useRadiusFill.anchor.setTo(0.5, 0.5);
	this.useRadiusFill.alpha = 0;


	//tween local vars
	var enterTime = 325;
	var leaveTime = 250;
	var autoStart = false;

	var leaveVisibleRangeTime = 500;
	var useRadiusShrunkScale = -0.03;

	

	//tweens for enter feedback
	this.borderTweenAlphaEnter = game.add.tween(this.useRadiusBorder);
	this.borderTweenAlphaEnter.to( { alpha: 0.6 }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
	this.borderTweenScaleEnter = game.add.tween(this.useRadiusBorder.scale);
	this.borderTweenScaleEnter.to( { x: this.useRadiusScale + useRadiusShrunkScale, y: this.useRadiusScale + useRadiusShrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);

	this.fillTweenAlphaEnter = game.add.tween(this.useRadiusFill);
	this.fillTweenAlphaEnter.to( { alpha: 0.3 }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
	this.fillTweenScaleEnter = game.add.tween(this.useRadiusFill.scale);
	this.fillTweenScaleEnter.to( { x: this.useRadiusScale + useRadiusShrunkScale, y: this.useRadiusScale + useRadiusShrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);


	//tweens for leave feedback
	this.fillTweenAlphaLeave = game.add.tween(this.useRadiusFill);
	this.fillTweenAlphaLeave.to( { alpha: 0 }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.fillTweenScaleLeave = game.add.tween(this.useRadiusFill.scale);
	this.fillTweenScaleLeave.to( { x: this.useRadiusScale, y: this.useRadiusScale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

	this.borderTweenAlphaLeave = game.add.tween(this.useRadiusBorder);
	this.borderTweenAlphaLeave.to( { alpha: this.useRadiusStartAlpha }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.borderTweenScaleLeave = game.add.tween(this.useRadiusBorder.scale);
	this.borderTweenScaleLeave.to( { x: this.useRadiusScale, y: this.useRadiusScale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	
	
	//adds elements to group
	this.entityGroup.add(this.entity);
	this.entityGroup.add(this.useRadiusBorder);
};



Entity.prototype.showEnterRadiusFeedback = function()
{
	//bounces the useradius and fill in
	this.borderTweenAlphaEnter.start();
	this.borderTweenScaleEnter.start();

	this.fillTweenAlphaEnter.start();
	this.fillTweenScaleEnter.start();
};



Entity.prototype.showLeaveRadiusFeedback = function()
{
	//fades the useradius and fill out
	//this.borderTweenAlphaLeave.start() - /*removed because the alpha based on distance looks nicer than linear tween*/
	this.borderTweenScaleLeave.start();

	this.fillTweenAlphaLeave.start();
	this.fillTweenScaleLeave.start();	
};



//keeps local distance to player updated every frame for use by other functions
Entity.prototype.updateClosestPlayerDistance = function()
{
	this.distanceToPlayer = game.physics.arcade.distanceBetween(GLOBAL_PLAYER, this.entity);
};



//updates feebdack to be correct based on player when called
Entity.prototype.updateEnterRadiusFeedback = function()
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
Entity.prototype.updateNearRadiusFeedback = function()
{

	var intendedAlpha = this.useRadiusStartAlpha - (this.useRadiusStartAlpha * (this.distanceToPlayer / this.useRadiusVisibleRange));

	//stops the alpha value being < 0
	if (intendedAlpha < 0) 
	{
		this.useRadiusDistanceToPlayerAlpha = 0;
	}

	else 
	{
		this.useRadiusDistanceToPlayerAlpha = intendedAlpha;
	}

	//if the player isn't inside the radius but is within useRadiusVisibleRange, fade in the useradius border
	if (this.distanceToPlayer >= this.usableRange && !this.borderTweenAlphaLeave.isRunning) 
	{
		this.useRadiusBorder.alpha = this.useRadiusDistanceToPlayerAlpha;

	}
};
