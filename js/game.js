var GameState = function(game) {
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
GameState.prototype.preload = function() {
	this.load.image('player', 'assets/player.png');
	this.load.image('useRadiusBorder', 'assets/use_radius_border.png');
	this.load.image('useRadiusFill', 'assets/use_radius_fill.png');
	this.load.image('interactableLight', 'assets/interactable_light.png');
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
var GLOBAL_INTERACTABLES_ARRAY = [];


//called by "new Phaser.Game()"
GameState.prototype.create = function() {

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


	//interactables
	GLOBAL_INTERACTABLES_ARRAY = [];
	this.createNewInteractable("light", 200, 100, 0.4)


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
GameState.prototype.update = function() {

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



	//if keys are not held down, reset acceleration
	if (!this.inputIsActive("W") && !this.inputIsActive("S")) 
	{
		this.player.body.acceleration.y = 0;
	}

	if (!this.inputIsActive("A") && !this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = 0;
	}



	//updates every interactable to check correct feedback is being shown
	for (i in GLOBAL_INTERACTABLES_ARRAY)
	{
		GLOBAL_INTERACTABLES_ARRAY[i].updateDistanceToPlayer();
		GLOBAL_INTERACTABLES_ARRAY[i].updateInRadiusFeedback();
		GLOBAL_INTERACTABLES_ARRAY[i].updateNearRadiusFeedback();

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
GameState.prototype.createPlayer = function (x, y) {
	this.player = this.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);
};




//checks if supplied button name is currently pressed down
GameState.prototype.inputIsActive = function(button) {

	var isActive = false;
	button = button.toUpperCase() 

	//takes the button passed in to the function and checks if it's pressed
	if (button !== undefined) 
	{
		isActive = this.input.keyboard.isDown(Phaser.Keyboard[button.toString()]);
	}
	
	return isActive;
};



GameState.prototype.createNewInteractable =  function (type, x, y, scale) {
	var interactable = new InteractableObject(type, x, y, scale);
	interactable.initialise();
	GLOBAL_INTERACTABLES_ARRAY[GLOBAL_INTERACTABLES_ARRAY.length] = interactable;
}







GameState.prototype.doPickUpInteractable = function (interactable) {
	//add interactable to player group
};

GameState.prototype.doDropInteractable = function (interactable) {

};

GameState.prototype.hasInteractablePickedUp = function () {
	
};

GameState.prototype.createNewObstacle =  function (width, height, x, y) {
	
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



function InteractableObject(type, x, y, scale) {

	//initial variables for creation from function call
	this.type = type;
	this.x = x;
	this.y = y;
	this.scale = scale;
	this.interactableGroup = game.add.group();

	//interactable parameters
	this.currentlyTweening = false;
	this.feedbackState = "notInRadius";
	this.useRadiusInsideScale = -0.03;
	this.useRadiusVisibleRange = 150;
	this.usableRange = 55;
	this.distanceToPlayer = 1000;
	this.useRadiusDistanceToPlayerAlpha = 0;



	//creates the actual interactable
	this.initialise = function() {

		//adds relevant interactable type depending on object "type"
		if (this.type == "light") 
		{
			this.interactable = game.add.sprite(x, y, "interactableLight");
		}


		if (this.type == "blocker") 
		{
			this.interactable = game.add.sprite(x, y, "interactableBlocker");
		}

		this.interactable.scale.x = 0.6;
		this.interactable.scale.y = 0.6;
		this.interactable.anchor.setTo(0.5, 0.5);


		//creates useradius elements, sets scale and anchor
		this.useRadiusBorder = game.add.sprite(x, y, "useRadiusBorder");
		this.useRadiusBorder.scale.x = scale;
		this.useRadiusBorder.scale.y = scale;
		this.useRadiusBorder.anchor.setTo(0.5, 0.5);
		this.useRadiusBorder.alpha = 0;

		this.useRadiusFill = game.add.sprite(x, y, "useRadiusFill");
		this.useRadiusFill.scale.x = scale;
		this.useRadiusFill.scale.y = scale;
		this.useRadiusFill.anchor.setTo(0.5, 0.5);
		this.useRadiusFill.alpha = 0;


		//tweens for feedback
		this.useRadiusBorderTweenAlphaIn = game.add.tween(this.useRadiusBorder);
		this.useRadiusBorderTweenAlphaOut = game.add.tween(this.useRadiusBorder);
		this.useRadiusBorderTweenXScaleIn = game.add.tween(this.useRadiusBorder.scale);
		this.useRadiusBorderTweenXScaleOut = game.add.tween(this.useRadiusBorder.scale);
		this.useRadiusBorderTweenYScaleIn = game.add.tween(this.useRadiusBorder.scale);
		this.useRadiusBorderTweenYScaleOut = game.add.tween(this.useRadiusBorder.scale);

		this.useRadiusFillTweenAlphaIn = game.add.tween(this.useRadiusFill);
		this.useRadiusFillTweenAlphaOut = game.add.tween(this.useRadiusFill);
		this.useRadiusFillTweenXScaleIn = game.add.tween(this.useRadiusFill.scale);
		this.useRadiusFillTweenXScaleOut = game.add.tween(this.useRadiusFill.scale);
		this.useRadiusFillTweenYScaleIn = game.add.tween(this.useRadiusFill.scale);
		this.useRadiusFillTweenYScaleOut = game.add.tween(this.useRadiusFill.scale);


		//blocks other feedback tweens from trying to run over the top of current tween until its completed
		this.useRadiusBorderTweenAlphaIn.onComplete.add(this.setCurrentlyTweeningToFalse, this);
		this.useRadiusBorderTweenAlphaOut.onComplete.add(this.setCurrentlyTweeningToFalse, this);


		//adds elements to group
		this.interactableGroup.add(this.interactable);
		this.interactableGroup.add(this.useRadiusBorder);
	}



	this.showInRadiusFeedback = function() {
		this.feedbackState = "inRadius";
		this.currentlyTweening = true;

		//bounces the useradius and fill in
		this.useRadiusBorderTweenAlphaIn.to( { alpha: 0.6 }, 250, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusBorderTweenXScaleIn.to( { x: scale + this.useRadiusInsideScale }, 250, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusBorderTweenYScaleIn.to( { y: scale + this.useRadiusInsideScale }, 250, Phaser.Easing.Bounce.Out, true, 10, 0, false)

		this.useRadiusFillTweenAlphaIn.to( { alpha: 0.15 }, 250, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusFillTweenXScaleIn.to( { x: scale + this.useRadiusInsideScale }, 250, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusFillTweenYScaleIn.to( { y: scale + this.useRadiusInsideScale }, 250, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		

	}



	this.showNotInRadiusFeedback = function() {
		this.feedbackState = "notInRadius";
		this.currentlyTweening = true;

		//bounces the useradius and fill out
		this.useRadiusBorderTweenAlphaOut.to( { alpha: this.useRadiusDistanceToPlayerAlpha }, 350, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusBorderTweenXScaleOut.to( { x: scale }, 350, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusBorderTweenYScaleOut.to( { y: scale }, 350, Phaser.Easing.Bounce.Out, true, 10, 0, false)

		this.useRadiusFillTweenAlphaOut.to( { alpha: 0 }, 350, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusFillTweenXScaleOut.to( { x: scale }, 350, Phaser.Easing.Bounce.Out, true, 10, 0, false)
		this.useRadiusFillTweenYScaleOut.to( { y: scale }, 350, Phaser.Easing.Bounce.Out, true, 10, 0, false)
	
		
		
	}



	//small function to get called by the tween OnCompletes above
	this.setCurrentlyTweeningToFalse = function() {
		this.currentlyTweening = false;
	}



	//keeps local distance to player updated every frame for use by other functions
	this.updateDistanceToPlayer = function() {
		this.distanceToPlayer = game.physics.arcade.distanceBetween(GLOBAL_PLAYER, this.interactable);
	}



	//updates feebdack to be correct based on player when called
	this.updateInRadiusFeedback = function() {

		//show in radius feedback if player is within range and the useradius is currently not tweening
		if (!this.currentlyTweening) 
		{
			if (this.distanceToPlayer <= this.usableRange) 
			{
				if (this.feedbackState !== "inRadius")
					{
						this.showInRadiusFeedback();
					}
				}
		
				//if player leaves, show exit feedback
				else if (this.feedbackState !== "notInRadius")
				{
					this.showNotInRadiusFeedback();
			}

		}

	}



	this.updateNearRadiusFeedback = function() {

		//if the player isn't inside the radius but is within useRadiusVisibleRange, fade in the useradius border
		if ((this.distanceToPlayer <= this.useRadiusVisibleRange && this.distanceToPlayer >= this.usableRange)) 
		{
			this.useRadiusDistanceToPlayerAlpha = 0.2 - (0.2 * (this.distanceToPlayer /  this.useRadiusVisibleRange));
			this.useRadiusBorder.alpha = this.useRadiusDistanceToPlayerAlpha;
		}

		//added this if player leaves too quickly and they're outside of the useRadiusVisibleRange before the exit tween finishes, leaving the alpha in a weird state 
		if (this.useRadiusDistanceToPlayerAlpha !== 0)
		{
			this.useRadiusBorderTweenAlphaOut.to( { alpha: this.useRadiusDistanceToPlayerAlpha }, 50, Phaser.Easing.Linear.Out, true, 10, 0, false)
		}
	}





};






//kicks off actual game
var game = new Phaser.Game(1400, 900, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);