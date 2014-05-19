var colors = require('colors');

var mongoose = require('mongoose'),
	Inventory = mongoose.model('villageitems'),
	User = mongoose.model('users'),
	Village = mongoose.model('villages');
	Items = mongoose.model('items');


exports.getInventory = function(callback) {

	Inventory.find({}, function(err,doc) {
			callback(doc);
			//console.log(doc);
	});

};


exports.getInventoryByVillage = function(villageId, callback) {
	Village.findOne({_id: villageId}, function(err, v) {

		Inventory.find({villageInfo:v._id}).populate('itemInfo').exec(function(err,doc) {
			//console.log(doc);
			callback(doc);
		});
	});

};	


exports.getInventoryByItem = function(itemName, callback) {

	Inventory.find({item:itemName}, function(err,doc) {
			callback(doc);
			console.log(doc);
	});

};

// exports.getInventoryByVillageByItem = function(villageId, itemName, callback) {

// 	//console.log("UserId: " + userId + "| Item: " + itemName)

// 	Inventory.findOne({villageInfo: villageId, itemName:itemName}, function(err,doc) {
// 			callback(doc);
// 			//console.log(doc);
// 	});

// };

// exports.incInventoryItem = function(userId, itemName, amount, callback) {
// 	Inventory.update({userId: userId, itemName: itemName}, 
// 		{'$inc': { quantity: amount }}, function( err, doc) {
// 		//console.log(doc);
// 	});

// 	this.getInventoryByUserByItem(userId, itemName, function (items) {
// 		//console.log(items);
// 		//console.log("  Item " + itemName + " updated to " + items.quantity );
// 	});

// }


exports.addItemToInventory = function(villageId, itemName, amount, callback) {
	//Village.findOne({_id: userId}, function(err, u) {
		var valid = true;
		
		Items.findOne({name : itemName}, function(err, i) {
			Inventory.findOne({itemInfo: i._id, villageInfo: villageId}, function(err, invTime) {
				if(invTime) {
					// i.cooloff (time in seconds)
					// invTime.lastUpdated
					var enoughTimeElapsed = false;

					// var t = new Date();
					// var rate = 60;

					// var t2 = new Date(t.getTime() + (rate*1000));

					var currTime = new Date()
					var neededTime = new Date(invTime.lastUpdated.getTime() + (i.cooloff * 1000));
					// console.log("##################################");
					// console.log("User " + userId + " | " + itemName);

					// console.log("Last Updated: " + invTime.lastUpdated);
					// console.log("Current Time: " + currTime);
					// console.log("Time needed: " + neededTime);

					if(currTime < neededTime)
					{
						valid = false;
					}
				}	
				
				if(valid) {	
						//console.log('Time is good to go'.green);


						//console.log("##################################");
						
						var inv = new Inventory({villageInfo: villageId, itemInfo: i._id, quantity: amount, level: 0 });

						//console.log("U:" + u);
						//console.log("I:" + i);
						//console.log("inv: " + inv);
						//self = this;

						inv.save(function (err) {

							if (err) {
							 	//console.log("Error Code: " + err);
							 	// Unique key violation
			    				if (11001 === err.code || 11000 === err.code) {

			    					Inventory.update({villageInfo: villageId, itemInfo: i._id}, 
										{'$inc': { quantity: amount }, lastUpdated: new Date()}, function( err, doc) {
										//console.log('Updating ' + itemName + ' for ' + u.username);
										callback({messageType: "Updated", message: ""});
									});

									
			    				}
			    			
			    			} else {
			    				//console.log('Added ' + itemName + ' for ' + u.username);
								callback({messageType: "Added", message: ""});
			    			}


						});

					} else {
						// console.log('Not enough time yet'.red);
						callback({messageType: "Error-Time", message: "Not enough time yet"});
					}					
				


			});
		
			
		});

	//});

}

exports.getBuildingsByVillage = function(id, callback) {

	Inventory.find({villageInfo:id, type: "building"}, function(err,doc) {
			callback(doc);
	});

};	


exports.getBuildingQuantityByVillage = function(id, buildingType, callback) {

	Inventory.find({villageInfo:id, type: buildingType}, function(err,doc) {
			callback(doc);
	});

};	


exports.payItemFromInventory = function(villageId, itemId, amount) {
	console.log("+++".red + " Paid: " + villageId + " | " + itemId + " | " + amount + " +++".red);
	//Item.findOne({name : itemName}, function(err, i) {
		Inventory.update({villageInfo: villageId, itemInfo: itemId}, 
			{'$inc': { quantity: -Math.abs(amount) }}, function( err, doc) {
				console.log('Paid ' + amount + ' of ' + itemId);

				if(err) { console.log(err); }
			//console.log('Updating ' + itemName + ' for ' + userName);
		});
	//});
}