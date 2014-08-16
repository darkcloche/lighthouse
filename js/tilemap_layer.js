var WALLS = null;
var TILEMAP = null;
var TILEMAP_LAYERS_ARRAY = [];
var TILEMAP_LAYERS_GROUP = null;


function TilemapLayer(layer, hasCollision, isFog)
{
	//adds to global tilemap array
	TILEMAP_LAYERS_ARRAY[TILEMAP_LAYERS_ARRAY.length] = this;


	//member vars set by constructor
	this.layer = layer;
	this.hasCollision = hasCollision;
	this.isFog = isFog;


	//initial state of some vars
	this.isVisible = true;
	this.playerIsIntersecting = null;


	//enables TIcollision if required
	if (this.hasCollision)
	{
		game.physics.enable(this.layer, Phaser.Physics.ARCADE);
		TILEMAP.setCollisionBetween(0, 20000, true, this.layer);
	}
};



TilemapLayer.prototype.updateCollision = function()
{
	if (this.hasCollision)
	{
		game.physics.arcade.collide(PLAYER, this.layer);

		if (PLAYER_OBJECT.pickedEntity !== null) 
		{
			game.physics.arcade.collide(PLAYER_OBJECT.pickedEntity.entity, this.layer);
		}
	}
}





TilemapLayer.prototype.updateVisibility = function()
{
	//get tile player currently, if tile.layer == this layer, then set alpha to 0
	if (this.isFog)
	{

		//work out if player is on top of the fog area
		if (TILEMAP.getTileWorldXY(PLAYER.x, PLAYER.y, 32, 32, this.layer) !== null)
		{
			this.playerIsIntersecting = true;
		}

		else
		{
			this.playerIsIntersecting = false;
		}


		//logic for hiding
		if (this.playerIsIntersecting && this.isVisible)
		{
			this.isVisible = false;
			this.hide();
		}
		
		if (!this.playerIsIntersecting && !this.isVisible) 
		{
			this.isVisible = true;
			this.unHide();
		}
	}
}



TilemapLayer.prototype.hide = function()
{
	if (layerTweenHide == undefined) 
	{
		var fadeOutTime = 250;
		var autoStart = false;
		var delay = 0;

		var layerTweenHide = game.add.tween(this.layer);
		layerTweenHide.to( { alpha: 0 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
	}

	layerTweenHide.start();
}


TilemapLayer.prototype.unHide = function()
{
	if (layerTweenUnHide == undefined) 
	{
		var fadeOutTime = 250;
		var autoStart = false;
		var delay = 0;

		var layerTweenUnHide = game.add.tween(this.layer);
		layerTweenUnHide.to( { alpha: 1 }, fadeOutTime, Phaser.Easing.Quadratic.InOut, autoStart, delay, 0, false);
	}

	layerTweenUnHide.start();
}