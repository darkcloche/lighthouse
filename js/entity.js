var ENTITIES_ARRAY = [];
var ENTITIES_GROUP = null;
var CURRENT_PICKED_ENTITY_OBJECT = null;
var CURRENT_USABLE_ENTITY_OBJECT = null;
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
};


function Entity(type, x, y, usable)
{
	//adds entity to global entities array
	ENTITIES_ARRAY[ENTITIES_ARRAY.length] = this;

	//initial variables for creation from function call
	this.type = type;
	this.entityInfo = ENTITY_DICTIONARY[this.type];

	//dummy invisible sprite because rotating the main entity when it was parent caused relative position maths to go crazy)
	this.entityParentDummy = game.add.sprite(x, y, "entityParentDummy");
	this.entityParentDummy.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.entityParentDummy, Phaser.Physics.ARCADE);
	game.physics.arcade.enableBody(this.entityParentDummy);
	game.physics.arcade.collide(PLAYER, this.entityParentDummy);
	this.entityParentDummy.body.collideWorldBounds = true;
	this.entityParentDummy.body.immovable = true;

	//adds relevant entity type depending on object "type"
	this.entity = game.add.sprite(x, y, this.entityInfo.textureName);
	this.entity.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.entity, Phaser.Physics.ARCADE);
	game.physics.arcade.enableBody(this.entityParentDummy);
	this.entity.body.angularDrag = 200; //angular params for the rotation effect when you enter useradius
	this.entity.body.maxAngular = 50;
	this.entityParentDummy.addChild(this.entity);

	//groups (used for depth sorting in game.js)
	ENTITIES_GROUP.add(this.entity);

	//useradius
	if (usable) 
	{
		this.useRadiusGroup = game.add.group()
		this.entityParentDummy.addChild(this.useRadiusGroup);
		this.useRadius = new UseRadius(this);
	};
};



Entity.prototype.updateCollision = function() 
{
	if (CURRENT_PICKED_ENTITY_OBJECT !== this) {
		game.physics.arcade.collide(PLAYER, this.entityParentDummy);
	}
}



Entity.prototype.startCanPickUpFeedback = function() 
{
	this.entity.body.angularAcceleration = 300;
}



Entity.prototype.stopCanPickUpFeedback = function() 
{
	this.entity.body.angularAcceleration = 0;
}



Entity.prototype.doPickUpFeedback = function() 
{
	if (entityTweenAlpha == undefined) {

		var time = 500;
		var autoStart = false;
		var alphaStart = 0.25;
		var alphaEnd = 0.5;
		var scaleStart = 0.85;
		var scaleEnd = 1;

		var entityTweenAlpha = game.add.tween(this.entity);
		var entityTweenScale = game.add.tween(this.entity.scale);
		
		entityTweenAlpha.to( { alpha: alphaStart }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		entityTweenAlpha.to( { alpha: alphaEnd }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		entityTweenAlpha.loop();
		entityTweenScale.to( { x: scaleStart, y: scaleStart }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		entityTweenScale.to( { x: scaleEnd, y: scaleEnd }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		entityTweenScale.loop();
	}

	entityTweenAlpha.start();
	entityTweenScale.start();
}






