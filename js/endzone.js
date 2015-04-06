var LEVEL_COMPLETE = false;

function Endzone(x, y) 
{
	this.endzone = game.add.sprite(x, y, "endzone");
	this.state = null;
};

Endzone.protptype.updateState = function()
{

	var objectInsideEndzone = game.physics.arcade.overlap(MACGUFFIN, this.endzone);

	//states
	//0 = outside
	//1 = inside and picked (not yet dropped)
	//2 = inside and dropped (completed)

	if (this.state != 2) {

		if (!objectInsideEndzone && this.state !== 0)
		{
			this.state = 0;
			this.showOutsideFeedback();
		}

		else 
		{
			if (objectInsideEndzone && PLAYER.pickedEntity == MACGUFFIN && this.state !== 1)  
			{
				this.state = 1;
				this.showInsideFeedback();
			}

			if (objectInsideEndzone && PLAYER.pickedEntity == null && this.state !== 2)
			{
				LEVEL_COMPLETE = true;
				this.state = 2;
				this.showCompletedFeedback();
			} 		
		}
	}
}

Endzone.prototype.showOutsideFeedback = function()
{



}



ndzone.prototype.showInsideFeedback = function()
{


	
}


ndzone.prototype.showCompletedFeedback = function()
{


	
}


