var USERADIUS_ARRAY = [];


function UseRadius(entityParentObject, playerAction) {

	//adds to global entities array
	USERADIUS_ARRAY[USERADIUS_ARRAY.length] = this;


	//member vars set by constructor
	this.entityParent = entityParentObject.entity;
	this.entityParentObject = entityParentObject;
	this.group = entityParentObject.usableUIGroup;
	this.playerAction = playerAction;


	//object tweakable parameters
	this.usableRange = 50;
	this.inRangeAlpha = 0.35;
	this.visibleRange = 100;


	//initial values of variables 
	this.feedbackState = 0;
	this.distanceToPlayer = 1000;
	this.distanceToPlayerAlpha = 0;
	this.isActive = true;


	//creates useradius elements, sets scale and anchor
	this.radiusBorder = game.add.sprite(0, 0, "radiusBorder");
	this.radiusBorder.anchor.setTo(0.5, 0.5);
	this.radiusBorder.alpha = 0;
	this.group.add(this.radiusBorder);

	this.radiusFill = game.add.sprite(0, 0, "radiusFill");
	this.radiusFill.anchor.setTo(0.5, 0.5);
	this.radiusFill.alpha = 0;
	this.group.add(this.radiusFill);
}



//keeps local distance to player updated every frame for use by other functions
UseRadius.prototype.updateClosestPlayerDistance = function()
{
	this.distanceToPlayer = game.physics.arcade.distanceBetween(PLAYER, this.entityParentObject.entity);
}



//updates feebdack to be correct based on player when called
UseRadius.prototype.updateEnterRadiusFeedback = function()
{
	//show in radius feedback if within range and the feedback state is not reflecting this
	if (this.isActive && this.distanceToPlayer <= this.usableRange && this.feedbackState == 0) 
	{ 
		this.feedbackState = 1;
		this.showEnterRadiusFeedback();
	}


	//if not within range and the feedback state isn't reflecting this
	else if (this.isActive && this.distanceToPlayer >= this.usableRange && this.feedbackState == 1)
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



UseRadius.prototype.showEnterRadiusFeedback = function()
{
	if (tweenBorderAlpha == undefined) 
	{
		var time = 325;
		var autoStart = false;
		var shrunkScale = 0.95;
		var borderAlpha = 0.6;
		var fillAlpha = 0.3;

		var tweenBorderAlpha = game.add.tween(this.radiusBorder);
		var tweenBorderScale = game.add.tween(this.radiusBorder.scale);
		var tweenFillAlpha = game.add.tween(this.radiusFill);
		var tweenFillScale = game.add.tween(this.radiusFill.scale);

		tweenBorderAlpha.to( { alpha: borderAlpha }, time, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		tweenBorderScale.to( { x: shrunkScale, y: shrunkScale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false)
		tweenFillAlpha.to( { alpha: fillAlpha }, time, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
		tweenFillScale.to( { x: shrunkScale, y: shrunkScale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);

		tweenFillScale.onStart.add(function() 
		{
			PLAYER_OBJECT.currentUsableEntity = this.entityParentObject;
			PLAYER_OBJECT.useAction.enable();
			this.entityParentObject.startCanPickUpFeedback();


			//if there's a hint attached to the entity that hasn't been pressed, unhide it
			if (this.entityParentObject.usePromptPickUp !== undefined && !this.entityParentObject.usePromptPickUp.hasBeenPressed)
			{
				this.entityParentObject.usePromptPickUp.unHide();
			}
		}, this);

		tweenFillScale.onComplete.add(function() 
		{

		}, this);

	};

	tweenBorderAlpha.start();
	tweenBorderScale.start();

	tweenFillAlpha.start();
	tweenFillScale.start();
}



UseRadius.prototype.showLeaveRadiusFeedback = function()
{
	if (tweenBorderAlpha == undefined) 
	{
		var time = 250;
		var autoStart = false;
		var scale = 1;
		
		var tweenBorderAlpha = game.add.tween(this.radiusBorder);
		var tweenBorderScale = game.add.tween(this.radiusBorder.scale);
		var tweenFillAlpha = game.add.tween(this.radiusFill);
		var tweenFillScale = game.add.tween(this.radiusFill.scale);

		// tweenBorderAlpha.to( { alpha: this.inRangeAlpha }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		tweenBorderScale.to( { x: scale, y: scale }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		tweenFillAlpha.to( { alpha: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		tweenFillScale.to( { x: scale, y: scale }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

		tweenFillScale.onStart.add(function() 
		{
			PLAYER_OBJECT.currentUsableEntity = null;
			PLAYER_OBJECT.useAction.disable();
			this.entityParentObject.stopCanPickUpFeedback();

			//if there's a hint attached to the entity that hasn't been pressed, hide it
			if (this.entityParentObject.usePromptPickUp !== undefined && !this.entityParentObject.usePromptPickUp.hasBeenPressed)
			{
				this.entityParentObject.usePromptPickUp.hide();
			}
			
		}, this);

		tweenFillScale.onComplete.add(function() 
		{

		}, this);
	};

	//this.tweenBorderAlpha.start() - removed because the alpha based on distance looks nicer than linear tween
	tweenBorderScale.start();

	tweenFillAlpha.start();
	tweenFillScale.start();	
}



UseRadius.prototype.showUsedFeedback = function()
{
	//tween initialised every time as opposed to just first time because object position can change - should be safe as impossible to clash tweens in this state
	var moveTime = 250;
	var scaleTime = 375;
	var autoStart = false; 
	var endScale = 0;
	var endAlpha = 0;

	var tweenBorderAlpha = game.add.tween(this.radiusBorder);
	var tweenBorderScale = game.add.tween(this.radiusBorder.scale);
	var tweenFillAlpha = game.add.tween(this.radiusFill);
	var tweenFillScale = game.add.tween(this.radiusFill.scale);
	var tweenGroupPos = game.add.tween(this.group);

	tweenBorderAlpha.to( { alpha: endAlpha }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
	tweenBorderScale.to( { x: endScale, y: endScale }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);

	tweenFillAlpha.to( { alpha: endAlpha }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
	tweenFillScale.to( { x: endScale, y: endScale }, scaleTime, Phaser.Easing.Quadratic.Out, autoStart, 0, 0, false);
	tweenFillScale.onStart.add(function() 
	{
		this.isActive = false;
		this.entityParentObject.stopCanPickUpFeedback();
		PLAYER_OBJECT.useAction.disable();
		PLAYER_OBJECT.currentUsableEntity = null;
	}, this);

	tweenFillScale.onComplete.add(function() 
	{
		PLAYER_OBJECT.useAction.enable();
	}, this);

	tweenBorderAlpha.start();
	tweenBorderScale.start();

	tweenFillAlpha.start();
	tweenFillScale.start();
}



UseRadius.prototype.showDroppedFeedback = function()
{
	if (tweenBorderAlpha == undefined) 
	{
		var time = 400;
		var autoStart = false; 
		var scale = 1;
		var borderAlpha = 0.6;
		var fillAlpha = 0.3;

		var tweenBorderAlpha = game.add.tween(this.radiusBorder);
		var tweenBorderScale = game.add.tween(this.radiusBorder.scale);

		var tweenFillAlpha = game.add.tween(this.radiusFill);
		var tweenFillScale = game.add.tween(this.radiusFill.scale);

		tweenBorderAlpha.to( { alpha: borderAlpha }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
		tweenBorderScale.to( { x: scale, y: scale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);

		tweenFillAlpha.to( { alpha: fillAlpha }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
		tweenFillScale.to( { x: scale, y: scale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
		tweenFillScale.onStart.add(function() 
		{
			PLAYER_OBJECT.useAction.disable();
		}, this);

		tweenFillScale.onComplete.add(function() 
		{
			//if the player has left the radius by the time its finished dropping, show leave feedback
			if (this.distanceToPlayer >= this.usableRange) 
			{
				this.feedbackState = 0;
				this.showLeaveRadiusFeedback();
			}

			else
			{
				this.showEnterRadiusFeedback();
			}

			this.isActive = true;
			PLAYER_OBJECT.useAction.enable();

		}, this);
	};

	this.group.x = this.entityParent.x 
	this.group.y = this.entityParent.y 

	tweenBorderAlpha.start();
	tweenBorderScale.start();

	tweenFillAlpha.start();
	tweenFillScale.start();
}