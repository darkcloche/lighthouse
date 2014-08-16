var PLAYER_ACTIONS_ARRAY = [];


function PlayerAction(button, pressedCallback, releasedCallback)
{	
	//adds to global array
	PLAYER_ACTIONS_ARRAY[PLAYER_ACTIONS_ARRAY.length] = this;

	//constructor params
	this.button = button.toUpperCase();
	this.pressedCallback = pressedCallback;
	this.releasedCallback = releasedCallback;

	//default state of object vars
	this.isEnabled = false;
	this.isActive = false;
};



PlayerAction.prototype.updateActionState = function()
{
	var buttonIsDown = game.input.keyboard.isDown(Phaser.Keyboard[this.button]);

	if (this.isEnabled)
	{
		if (buttonIsDown && !this.isActive)
		{
			this.isActive = true;

			if (this.pressedCallback !== undefined) 
			{
				this.pressedCallback.call(PLAYER_OBJECT); //the .call() allows us to call the function with a specific context
			}
		}

		if (!buttonIsDown && this.isActive)
		{
			if (this.releasedCallback !== undefined) 
			{
				this.releasedCallback.call(PLAYER_OBJECT); //the .call() allows us to call the function with a specific context
			}

			this.isActive = false;
		}
	}
}



PlayerAction.prototype.enable = function()
{
	this.isEnabled = true;
}



PlayerAction.prototype.disable = function()
{
	this.isEnabled = false;
}
