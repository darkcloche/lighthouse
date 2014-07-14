var GLOBAL_ENTITIES_ARRAY = [];
var GLOBAL_ENTITIES_GROUP = null;
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


	//group setup
	this.entityGroup = game.add.group();


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
