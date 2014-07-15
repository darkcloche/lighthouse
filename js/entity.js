var GLOBAL_ENTITIES_ARRAY = [];
var GLOBAL_ENTITIES_GROUP = null;
var CURRENT_PICKED_ENTITY_OBJECT = null;
var ENTITY_DICTIONARY = 
{
	light: 
		{ 
			textureName: "entityLight",
			entityScale: 0.5,
			radiusScale: 0.85
		},

	blocker: 
		{ 
			textureName: "entityBlocker",
			entityScale: 0.5,
			radiusScale: 0.4
		},
};


function Entity(type, x, y, usable)
{
	//adds enttiy to global entities array
	GLOBAL_ENTITIES_ARRAY[GLOBAL_ENTITIES_ARRAY.length] = this;


	//initial variables for creation from function call
	this.type = type;
	var entityInfo = ENTITY_DICTIONARY[this.type];


	//adds relevant entity type depending on object "type"
	this.entity = game.add.sprite(x, y, entityInfo.textureName);
	GLOBAL_ENTITIES_GROUP.add(this.entity);
	this.entity.scale.x = this.entity.scale.y = entityInfo.entityScale;
	this.entity.anchor.setTo(0.5, 0.5);
	

	//useradius
	if (usable) 
	{
		this.useRadiusGroup = game.add.group()
		this.entity.addChild(this.useRadiusGroup);
		this.useRadius = new UseRadius(this, entityInfo.radiusScale);
	};
};


Entity.prototype.doPickUpFeedback = function() 
{
	//disabled for now as keeping transform seemed like a cool thing 

/*	if (entityTweenAlpha == undefined) {

		var time = 250;
		var autoStart = false; 
		var playerX = GLOBAL_PLAYER.x;
		var playerY = GLOBAL_PLAYER.y;

		var entityTweenAlpha = game.add.tween(this.entity);
		var entityTweenScale = game.add.tween(this.entity.scale);
		var entityTweenPos = game.add.tween(this.entity);

		entityTweenAlpha.to( { alpha: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		entityTweenScale.to( { x: 0, y: 0 }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
		entityTweenPos.to( { x: playerX, y: playerY }, time, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	}

	entityTweenAlpha.start();
	entityTweenScale.start();
	entityTweenPos.start();

	this.useRadius.active = false;
	this.useRadius.showUsedFeedback();*/
}
