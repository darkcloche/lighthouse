var ENTITIES_ARRAY = [];
var ENTITIES_GROUP = null;
var ENTITY_DICTIONARY = 
{
	light: 
		{ 
			textureName: "entityLight",
		},

	blocker: 
		{ 
			textureName: "entityBlocker",
		},

	macguffin: 
		{ 
			textureName: "macguffin",
		},
};

//global variable for the single macguffin
var MACGUFFIN = null;


function Entity(type, x, y, usable, hasHint, fadesAlphaWhenPicked)
{
	//adds entity to global entities array
	ENTITIES_ARRAY[ENTITIES_ARRAY.length] = this;


	//initial variables for creation from function call
	this.type = type;
	this.entityInfo = ENTITY_DICTIONARY[this.type];
	this.hasHint = hasHint;
	this.fadesAlphaWhenPicked = fadesAlphaWhenPicked;


	//adds relevant entity type depending on object "type"
	this.entity = game.add.sprite(x, y, this.entityInfo.textureName);
	ENTITIES_GROUP.add(this.entity);
	this.entity.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.entity, Phaser.Physics.ARCADE);
	game.physics.arcade.enableBody(this.entity);
	this.entity.body.angularDrag = 200; //angular params for the rotation effect when you enter useradius (currently using tween but keeping around in case)
	this.entity.body.maxAngular = 50;
	this.entity.body.collideWorldBounds = true;
	this.entity.body.immovable = true;


	//initial state of vars
	this.isPicked = false;
	this.isUsable = usable;


	//if entity is usable, add interactive elements
	if (this.isUsable) 
	{
		this.usableUIGroup = game.add.group()
		this.usableUIGroup.x = x;
		this.usableUIGroup.y = y;
		ENTITIES_GROUP.add(this.usableUIGroup);

		//shows the radius around the entity when near
		this.useRadius = new UseRadius(this);

		// prompts for teaching pickups
		if (this.hasHint) 
		{
			this.usePromptPickUp = new Hint("E", false, this.usableUIGroup, 0, -30, this, "PickUp");
		}
	};
};



Entity.prototype.updateCollision = function() 
{
	if (PLAYER_OBJECT.pickedEntity !== this && PLAYER_OBJECT.currentUsableEntity == this) //stops collision on picked objects, only checks when in range
	{
		game.physics.arcade.collide(PLAYER, this.entity);
	}
}



Entity.prototype.updatePickedOffsetPosition = function() 
{
	if (this.isPicked) 
	{
		this.entity.x = this.usableUIGroup.x = PLAYER.x - this.pickedOffsetX;
		this.entity.y = this.usableUIGroup.y = PLAYER.y - this.pickedOffsetY;
	}
}



Entity.prototype.startCanPickUpFeedback = function() 
{

	var time = 350;
	var autoStart = false;
	var angle = 10;
	var scaleStart = 1.25;
	var scaleEnd = 1;
	//this works strangely (i assume because of the loop behaviour) every other tween required only initialising .to's once but this wants them every time

	this.entityTweenRotate = game.add.tween(this.entity);
	this.entityTweenScale = game.add.tween(this.entity.scale);
	
	this.entityTweenRotate.to( { angle: angle }, time, Phaser.Easing.Linear.InOut, autoStart, 0, 0, false);
	this.entityTweenRotate.to( { angle: -angle }, time, Phaser.Easing.Linear.InOut, autoStart, 0, 0, false);
	this.entityTweenRotate.loop();

	this.entityTweenScale.to( { x: scaleStart, y: scaleStart }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.entityTweenScale.to( { x: scaleEnd, y: scaleEnd }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.entityTweenScale.loop();

	// this.entityTweenRotate.start();
	this.entityTweenScale.start();

	// this.entity.body.angularAcceleration = 300;
	// went for a looping tween for now instead of constant rotation
}



Entity.prototype.stopCanPickUpFeedback = function() 
{
	this.entityTweenRotate.pause();
	this.entityTweenScale.pause();

	// this.entity.body.angularAcceleration = 0;
	// went for a looping tween for now instead of constant rotation
}



Entity.prototype.startPickedUpFeedback = function() 
{
	if (this.entityTweenAlpha == undefined) 
	{
		var time = 300;
		var autoStart = false;
		var alphaStart = 0.25;
		var alphaEnd = 0.5;


		this.pickedEntityTweenAlpha = game.add.tween(this.entity);
		
		this.pickedEntityTweenAlpha.to( { alpha: alphaStart }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		this.pickedEntityTweenAlpha.to( { alpha: alphaEnd }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		this.pickedEntityTweenAlpha.loop();
	}

	this.pickedOffsetX = PLAYER.x - this.entity.x;
	this.pickedOffsetY = PLAYER.y - this.entity.y;

	if (this.fadesAlphaWhenPicked) 
	{
		this.pickedEntityTweenAlpha.start();
	}
}



Entity.prototype.startDroppedFeedback = function() 
{
	if (this.droppedEntityTweenAlpha == undefined) {

		var time = 500;
		var autoStart = false;
		var alpha = 1;
		var scale = 1;

		this.droppedEntityTweenAlpha = game.add.tween(this.entity);
		this.droppedEntityTweenScale = game.add.tween(this.entity.scale);
		
		this.droppedEntityTweenAlpha.to( { alpha: alpha }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
		this.droppedEntityTweenScale.to( { x: scale, y: scale }, time, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);
	}

	this.pickedEntityTweenAlpha.pause();
	this.entityTweenScale.pause();

	this.droppedEntityTweenAlpha.start();
	this.droppedEntityTweenScale.start();
}