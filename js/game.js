var GameState = function(game)
{

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  _____    _____    ______   _         ____               _____  
 |  __ \  |  __ \  |  ____| | |       / __ \      /\     |  __ \ 
 | |__) | | |__) | | |__    | |      | |  | |    /  \    | |  | |
 |  ___/  |  _  /  |  __|   | |      | |  | |   / /\ \   | |  | |
 | |      | | \ \  | |____  | |____  | |__| |  / ____ \  | |__| |
 |_|      |_|  \_\ |______| |______|  \____/  /_/    \_\ |_____/ 
                                                                 
*/



//called by "new Phaser.Game()"
GameState.prototype.preload = function()
{
	this.load.image('player', 'assets/player.png');
	this.load.image('useRadiusBorder', 'assets/use_radius_border.png');
	this.load.image('useRadiusFill', 'assets/use_radius_fill.png');
	this.load.image('EntityLight', 'assets/interactable_light.png');
};


















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   _____   _____    ______              _______   ______ 
  / ____| |  __ \  |  ____|     /\     |__   __| |  ____|
 | |      | |__) | | |__       /  \       | |    | |__   
 | |      |  _  /  |  __|     / /\ \      | |    |  __|  
 | |____  | | \ \  | |____   / ____ \     | |    | |____ 
  \_____| |_|  \_\ |______| /_/    \_\    |_|    |______|
*/




var GLOBAL_PLAYER = undefined;
var GLOBAL_ENTITIES_ARRAY = [];
var OBJECT_DICTIONARY = 
{
	light: 
		{ 
			textureName: "EntityLight",
			scale: 0.5
		},

	blocker: 
		{ 
			textureName: "EntityBlocker",
			scale: 0.4
		},
};


//called by "new Phaser.Game()"
GameState.prototype.create = function()
{

	//init
	this.stage.backgroundColor = 0x1E1F1E;
	this.physics.startSystem(Phaser.Physics.ARCADE);


	//player
	this.player = this.add.sprite(50, 100, "player");
	this.player.anchor.setTo(0.5, 0.5);
	GLOBAL_PLAYER = this.player;


	//player physics
	this.PLAYER_MAX_SPEED = 150;
	this.PLAYER_DRAG = 1250;
	this.PLAYER_ACCELERATION = 1500;
	this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);


	//Entitys
	GLOBAL_ENTITIES_ARRAY = [];
	this.createNewEntity("light", 200, 100, 0.4);
	this.createNewEntity("light", 400, 300, 0.4);	
	this.createNewEntity("light", 600, 150, 0.4);


	//light bitmap setup (unsure how this shit works, am scared by it)
	this.bitmap = this.add.bitmapData(this.width, this.height);
	this.bitmap.context.fillStyle = "rgb(255, 255, 255)";
	this.bitmap.context.strokeStyle = "rgb(255, 255, 255)";
	this.lightBitmap = this.add.image(0, 0, this.bitmap);
	this.lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;


	//capture keyboard input to stop them being used elsewhere
	this.game.input.keyboard.addKeyCapture([
		Phaser.Keyboard.W,
		Phaser.Keyboard.A,
		Phaser.Keyboard.S,
		Phaser.Keyboard.D
	]);


	//bring player to top after everything is created
	this.player.bringToTop();

};















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  _    _   _____    _____               _______   ______ 
 | |  | | |  __ \  |  __ \      /\     |__   __| |  ____|
 | |  | | | |__) | | |  | |    /  \       | |    | |__   
 | |  | | |  ___/  | |  | |   / /\ \      | |    |  __|  
 | |__| | | |      | |__| |  / ____ \     | |    | |____ 
  \____/  |_|      |_____/  /_/    \_\    |_|    |______|


*/



//called by "new Phaser.Game()"
GameState.prototype.update = function()
{

	//applies acceleration in the required direction when key is pressed
	if (this.inputIsActive("W")) 
	{
		this.player.body.acceleration.y = -this.PLAYER_ACCELERATION;
	}

	if (this.inputIsActive("S")) 
	{
		this.player.body.acceleration.y = this.PLAYER_ACCELERATION;
	}

	if (this.inputIsActive("A")) 
	{
		this.player.body.acceleration.x = -this.PLAYER_ACCELERATION;
	}

	if (this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = this.PLAYER_ACCELERATION;
	}




	//if no keys are not held down or opposite keys are held down, reset acceleration
	if ((!this.inputIsActive("W") && !this.inputIsActive("S")) || (this.inputIsActive("W") && this.inputIsActive("S")))
	{
		this.player.body.acceleration.y = 0;
	}

	if ((!this.inputIsActive("A") && !this.inputIsActive("D")) || (this.inputIsActive("A") && this.inputIsActive("D")))
	{
		this.player.body.acceleration.x = 0;
	}



	//updates every Entity to check correct feedback is being shown
	for (i in GLOBAL_ENTITIES_ARRAY)
	{
		GLOBAL_ENTITIES_ARRAY[i].updateClosestPlayerDistance();
		GLOBAL_ENTITIES_ARRAY[i].updateEnterRadiusFeedback();
		GLOBAL_ENTITIES_ARRAY[i].updateNearRadiusFeedback();
	}

};


















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  ______   _    _   _   _    _____   _______   _____    ____    _   _    _____ 
 |  ____| | |  | | | \ | |  / ____| |__   __| |_   _|  / __ \  | \ | |  / ____|
 | |__    | |  | | |  \| | | |         | |      | |   | |  | | |  \| | | (___  
 |  __|   | |  | | | . ` | | |         | |      | |   | |  | | | . ` |  \___ \ 
 | |      | |__| | | |\  | | |____     | |     _| |_  | |__| | | |\  |  ____) |
 |_|       \____/  |_| \_|  \_____|    |_|    |_____|  \____/  |_| \_| |_____/ 
                                                                      
*/



//creates player
GameState.prototype.createPlayer = function (x, y)
{
	this.player = this.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);
};




//checks if supplied button name is currently pressed down
GameState.prototype.inputIsActive = function(button)
{

	var isActive = false;
	button = button.toUpperCase() 

	//takes the button passed in to the function and checks if it's pressed
	if (button !== undefined) 
	{
		isActive = this.input.keyboard.isDown(Phaser.Keyboard[button.toString()]);
	}
	
	return isActive;
};



GameState.prototype.createNewEntity =  function (type, x, y, scale)
{
	var entity = new InteractableEntity(type, x, y, scale);
	GLOBAL_ENTITIES_ARRAY[GLOBAL_ENTITIES_ARRAY.length] = entity;
}







GameState.prototype.doPickUpEntity = function (Entity)
{
	//add Entity to player group
};

GameState.prototype.doDropEntity = function (Entity)
{

};

GameState.prototype.hasEntityPickedUp = function ()
{
	
};

GameState.prototype.createNewObstacle =  function (width, height, x, y)
{
	
};




















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   ____    ____         _   ______    _____   _______    _____ 
  / __ \  |  _ \       | | |  ____|  / ____| |__   __|  / ____|
 | |  | | | |_) |      | | | |__    | |         | |    | (___  
 | |  | | |  _ <   _   | | |  __|   | |         | |     \___ \ 
 | |__| | | |_) | | |__| | | |____  | |____     | |     ____) |
  \____/  |____/   \____/  |______|  \_____|    |_|    |_____/ 
*/



function InteractableEntity(type, x, y, scale)
{

	//initial variables for creation from function call
	this.type = type;
	this.x = x;
	this.y = y;
	this.useRadiusScale = scale;
	this.entityGroup = game.add.group();


	//object tweakable parameters
	this.usableRange = 55;
	this.useRadiusStartAlpha = 0.2;
	this.useRadiusVisibleRange = 150;


	//initial values of variables controlled by functions
	this.feedbackState = "LeaveRadius";
	this.distanceToPlayer = 1000;
	this.useRadiusDistanceToPlayerAlpha = 0;


	//adds relevant Entity type depending on object "type"
	var entityInfo = OBJECT_DICTIONARY[this.type];
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
	var leaveVisibleRangeTime = 500;
	var useRadiusShrunkScale = -0.03;
	var enterTime = 325;
	var leaveTime = 250;
	var autoStart = false;
	var entityScaleDifference = 0.05;
	var entityScaleLoopTime = 500;
	

	//tweens for enter feedback
	this.useRadiusBorderTweenAlphaEnter = game.add.tween(this.useRadiusBorder);
	this.useRadiusBorderTweenAlphaEnter.to( { alpha: 0.6 }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
	this.useRadiusBorderTweenScaleEnter = game.add.tween(this.useRadiusBorder.scale);
	this.useRadiusBorderTweenScaleEnter.to( { x: this.useRadiusScale + useRadiusShrunkScale, y: this.useRadiusScale + useRadiusShrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);

	this.useRadiusFillTweenAlphaEnter = game.add.tween(this.useRadiusFill);
	this.useRadiusFillTweenAlphaEnter.to( { alpha: 0.15 }, enterTime, Phaser.Easing.Quadratic.InOut, autoStart, 0, 0, false);
	this.useRadiusFillTweenScaleEnter = game.add.tween(this.useRadiusFill.scale);
	this.useRadiusFillTweenScaleEnter.to( { x: this.useRadiusScale + useRadiusShrunkScale, y: this.useRadiusScale + useRadiusShrunkScale }, enterTime, Phaser.Easing.Bounce.Out, autoStart, 0, 0, false);


	//tweens for leave feedback
	this.useRadiusFillTweenAlphaLeave = game.add.tween(this.useRadiusFill);
	this.useRadiusFillTweenAlphaLeave.to( { alpha: 0 }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.useRadiusFillTweenScaleLeave = game.add.tween(this.useRadiusFill.scale);
	this.useRadiusFillTweenScaleLeave.to( { x: this.useRadiusScale, y: this.useRadiusScale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);

	this.useRadiusBorderTweenAlphaLeave = game.add.tween(this.useRadiusBorder);
	this.useRadiusBorderTweenAlphaLeave.to( { alpha: this.useRadiusStartAlpha }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	this.useRadiusBorderTweenScaleLeave = game.add.tween(this.useRadiusBorder.scale);
	this.useRadiusBorderTweenScaleLeave.to( { x: this.useRadiusScale, y: this.useRadiusScale }, leaveTime, Phaser.Easing.Linear.Out, autoStart, 0, 0, false);
	
	
	//adds elements to group
	this.entityGroup.add(this.entity);
	this.entityGroup.add(this.useRadiusBorder);
	

	this.showEnterRadiusFeedback = function()
	{
		//bounces the useradius and fill in
		this.useRadiusBorderTweenAlphaEnter.start();
		this.useRadiusBorderTweenScaleEnter.start();

		this.useRadiusFillTweenAlphaEnter.start();
		this.useRadiusFillTweenScaleEnter.start();
	}



	this.showLeaveRadiusFeedback = function()
	{
		//fades the useradius and fill out
		// this.useRadiusBorderTweenAlphaLeave.start() - removed because the alpha based on distance looks nicer than linear tween
		this.useRadiusBorderTweenScaleLeave.start();

		this.useRadiusFillTweenAlphaLeave.start();
		this.useRadiusFillTweenScaleLeave.start();	
	}


	//keeps local distance to player updated every frame for use by other functions
	this.updateClosestPlayerDistance = function()
	{
		this.distanceToPlayer = game.physics.arcade.distanceBetween(GLOBAL_PLAYER, this.entity);
	}




	//updates feebdack to be correct based on player when called
	this.updateEnterRadiusFeedback = function()
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
	}




	//updates the alpha on the useradius based on player distance
	this.updateNearRadiusFeedback = function()
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
		if (this.distanceToPlayer >= this.usableRange && !this.useRadiusBorderTweenAlphaLeave.isRunning) 
		{
			this.useRadiusBorder.alpha = this.useRadiusDistanceToPlayerAlpha;

		}
	}
};




//kicks off actual game
var game = new Phaser.Game(1400, 900, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);