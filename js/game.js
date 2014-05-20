var GameState = function(game) {
};


//called by "new Phaser.Game()"
GameState.prototype.preload = function() {
	this.load.image('player', 'assets/player.png');
	this.load.image('interactableUseRadiusEmpty', 'assets/interactable_empty.png');
	this.load.image('interactableUseRadiusOccupied', 'assets/interactable_full.png');
	this.load.image('interactableLight', 'assets/interactable_light.png');
};



//called by "new Phaser.Game()"
GameState.prototype.create = function() {

	//background
	this.stage.backgroundColor = 0x1E1F1E;


	//player
	this.player = this.add.sprite(this.game.width/2, this.game.height/2, "player");
	this.player.anchor.setTo(0.5, 0.5);	
	

	//player physics
	this.PLAYER_MAX_SPEED = 150;
	this.PLAYER_DRAG = 1250;
	this.PLAYER_ACCELERATION = 1500;

	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);


	//you have to add the actual parent objects you want to access to the tween manager here, not in the tween call below
	//currently not working, probably need to use something other than tween
	//this.this.PLAYER_ACCELERATIONTween = this.add.tween(this.player.body.acceleration); 


	//interactables
	this.ALL_INTERACTABLES_GROUP = this.add.group();
	this.createNewInteractable("light", 500, 200, 0.4)
	this.createNewInteractable("light", 900, 600, 0.4)
	this.createNewInteractable("light", 1200, 300, 0.4)


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

};


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
		//this.this.PLAYER_ACCELERATIONTween.to({y: 0}, 2000, Phaser.Easing.Linear.None);
	}

	if (!this.inputIsActive("A") && !this.inputIsActive("D")) 
	{
		this.player.body.acceleration.x = 0;
		//this.this.PLAYER_ACCELERATIONTween.to({x: 0}, 2000, Phaser.Easing.Linear.None);
	}





	//pickup feedback
	if (this.isOnInteractable())
	{

	}


	//object pickup if player press E
	if (this.inputIsActive("E")) 
	{
		if (!this.hasInteractablePickedUp) 
		{
			if (this.isOnInteractable() !== false) 
			{
				this.pickUpInteractable(this.isOnInteractable());
			}
			else 
			{
				this.doDropInteractable(this.hasInteractablePickedUp());
			}
		}
	}


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



GameState.prototype.createNewObstacle =  function (width, height, x, y) {
	
};


GameState.prototype.createPlayer = function (x, y) {
	this.player = this.add.sprite(x, y, "player");
	this.player.anchor.setTo(0.5, 0.5);	

	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.maxVelocity.setTo(this.PLAYER_MAX_SPEED, this.PLAYER_MAX_SPEED);
	this.player.body.drag.setTo(this.PLAYER_DRAG, this.PLAYER_DRAG);
};





GameState.prototype.createNewInteractable =  function (type, x, y, scale) {

	if (type == "light" || "blocker") 
	{
		//declares local group (entity + interactable), interactable and entity
		var localInteractableGroup = this.add.group();
		var interactable = this.add.sprite(x, y, "interactableUseRadiusEmpty");
		var entity = undefined;

		//sets interactable params, adds to local group
		interactable.scale.x = scale;
		interactable.scale.y = scale;
		interactable.anchor.setTo(0.5, 0.5);
		localInteractableGroup.add(interactable)

		//adds relevant entity type
		if (type == "light") 
		{
			entity = this.add.sprite(x, y, "interactableLight");
			entity.scale.x = 0.6
			entity.scale.y = 0.6
		}

		if (type == "blocker") 
		{
			entity = this.add.sprite(x, y, "interactableBlocker");
			entity.scale.x = 0.5
			entity.scale.y = 0.5
		}

		//sets entity params and adds to group
		entity.anchor.setTo(0.5, 0.5);
		localInteractableGroup.add(entity)

		//adds local group to global group
		this.ALL_INTERACTABLES_GROUP.add(localInteractableGroup);
		this.player.bringToTop();
		return true;
	}

	else 
	{
		return false;
	}
};


GameState.prototype.isOnInteractable = function () {
	//do range checks to all interactables, return of interactable if on it

};

GameState.prototype.doPickUpInteractable = function (interactable) {
	//add interactable to player group
};

GameState.prototype.doDropInteractable = function (interactable) {

};

GameState.prototype.hasInteractablePickedUp = function () {
	
};

GameState.prototype.changeInteractableState = function(interactable, state) {
	//change texture
};







/*

//WHAT IS THIS
this.bitmap.context.fillstyle = "rgb(100,100,100)";
this.bitmap.context.fillRect = (0, 0, this.width, this.height);

*/

var game = new Phaser.Game(1400, 900, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);