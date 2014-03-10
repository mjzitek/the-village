
var Inventory = function(db, userId){

		this.db = db;


		this.userId = userId;

		this.items = {

			wood: 0,
			food: 0,
			leather: 0,

			// Ores/ 
			stone: 0,
			coal: 0,
			iron: 0,
			diamond: 0
		}


	
}

Inventory.prototype.GetInventory = function() {

}


Inventory.prototype.AddItem = function(itemId, amount) {

}