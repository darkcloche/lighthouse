//the stuff in brackets at the end just calls the functions below. it took me a while to realise this. carry on

var game = new Phaser.Game(1400, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });



////global variables
var playerMaxSpeed = 150;
var playerDrag = 1250;
var playerAcceleration = 1500;


var interactableCurrent = ""



//called by "new Phaser.Game()"
function preload() {
	game.load.image('player', 'assets/player.png');
	game.load.image('interactableEmpty', 'assets/interactable_empty.png');
	game.load.image('interactableFull', 'assets/interactable_full.png');
}



//called by "new Phaser.Game()"
function create() {

	//background
	game.stage.backgroundColor = 0x1E1F1E;


	//player
	game.player = game.add.sprite(game.width/2, game.height/2, "player");
	game.player.anchor.setTo(0.5, 0.5);	
	

	//player physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(game.player, Phaser.Physics.ARCADE);
	game.player.body.maxVelocity.setTo(playerMaxSpeed, playerMaxSpeed);
	game.player.body.drag.setTo(playerDrag, playerDrag);

	//you have to add the actual parent objects you want to access to the tween manager here, not in the tween call below
	//currently not working, probably need to use something other than tween
	//game.playerAccelerationTween = game.add.tween(game.player.body.acceleration); 


	//interactibles
	game.interactible = game.add.sprite(game.width/2, game.height/2, "interactableEmpty");
	game.interactible.anchor.setTo(0.5, 0.5);	
	game.interactible.scale.x = 0.5;
	game.interactible.scale.y = 0.5;


	//light bitmap setup (unsure how this shit works, am scared by it)
	game.bitmap = game.add.bitmapData(game.width, game.height);
	game.bitmap.context.fillStyle = "rgb(255, 255, 255)";
	game.bitmap.context.strokeStyle = "rgb(255, 255, 255)";
	var lightBitmap = game.add.image(0, 0, game.bitmap);
	lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;


	//capture keyboard input to stop them being used elsewhere
	this.game.input.keyboard.addKeyCapture([
		Phaser.Keyboard.W,
		Phaser.Keyboard.A,
		Phaser.Keyboard.S,
		Phaser.Keyboard.D
	]);

	game.player.bringToTop();

}






//checks if supplied button name is currently pressed down
var inputIsActive = function(button) {

	var isActive = false;
	button = button.toUpperCase() 

	//takes the button passed in to the function and checks if it's pressed
	if (button !== undefined) 
	{
		isActive = game.input.keyboard.isDown(Phaser.Keyboard[button.toString()]);
	}
	
	return isActive;
};



var createNewObstacle =  function (width, height, x, y) {

};


var createPlayer = function (x, y) {
	game.player = game.add.sprite(x, y, "player");
	game.player.anchor.setTo(0.5, 0.5);	

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(game.player, Phaser.Physics.ARCADE);
	game.player.body.maxVelocity.setTo(playerMaxSpeed, playerMaxSpeed);
	game.player.body.drag.setTo(playerDrag, playerDrag);
};





var createNewInteractable =  function (name, type, x, y, scale) {
	

	//add all the stuff in create here


	if (type == "light" || "obstacle") 
	{
		this.name = game.add.group();

		this.name = game.add.sprite(x, y, "interactableEmpty");
		this.name.scale.x = scale;
		this.name.scale.y = scale;
		this.name.anchor.setTo(0.5, 0.5);



		if (type == "light") 
		{
			return true;
		}


		if (type == "obstacle") 
		{
			return true;
		}

	}



	else 
	{
		return false;
	}
};


var isOnInteractable = function () {
	//do range checks to all interactables, return ID of interactable if on it

};

var doPickUpInteractable = function (interactible) {
	//add interactable to player group
};

var doDropInteractable = function (interactible) {

};

var hasInteractablePickedUp = function () {
	
};

var changeInteractableState = function(interactible, state) {
	//change texture
};







/*

//WHAT IS THIS
game.bitmap.context.fillstyle = "rgb(100,100,100)";
game.bitmap.context.fillRect = (0, 0, game.width, game.height);

*/




//called by "new Phaser.Game()"
function update() {

	//applies acceleration in the required direction when key is pressed
	if (inputIsActive("W")) 
	{
		game.player.body.acceleration.y = -playerAcceleration;
	}

	if (inputIsActive("S")) 
	{
		game.player.body.acceleration.y = playerAcceleration;
	}

	if (inputIsActive("A")) 
	{
		game.player.body.acceleration.x = -playerAcceleration;
	}

	if (inputIsActive("D")) 
	{
		game.player.body.acceleration.x = playerAcceleration;
	}


	//if keys are not held down, reset acceleration
	if (!inputIsActive("W") && !inputIsActive("S")) 
	{
		game.player.body.acceleration.y = 0;
		//game.playerAccelerationTween.to({y: 0}, 2000, Phaser.Easing.Linear.None);
	}

	if (!inputIsActive("A") && !inputIsActive("D")) 
	{
		game.player.body.acceleration.x = 0;
		//game.playerAccelerationTween.to({x: 0}, 2000, Phaser.Easing.Linear.None);
	}



/*

	//pickup feedback
	if (isOnInteractable() {
		
	}
*/

	//object pickup if player press E
	if (inputIsActive("E")) 
	{
		if (!hasInteractablePickedUp) 
		{
			if (isOnInteractable() !== false) 
			{
				pickUpInteractable(isOnInteractable());
			}
			else 
			{
				doDropInteractable(hasInteractablePickedUp());
			}
		}
	}


}
