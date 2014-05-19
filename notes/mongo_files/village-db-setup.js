/*

	My huge, unruley scratchpad

*/


var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


mongoose.connect('mongodb://localhost/village');


var InventorySchema = new mongoose.Schema({
	userInfo:     { type: Schema.Types.ObjectId, ref: 'users' },
	itemInfo: 	  { type: Schema.Types.ObjectId, ref: 'items' },		
	quantity:     { type: Number },
	level:        { type: Number },
	lastUpdated:  { type : Date, default: Date.now }
});


var ItemsSchema = new mongoose.Schema({
	name:       { type: String },
	commonName: { type: String },
	type:       { type: String },
	value:      { type: Number },
	limit:      { type: Number }
});

var UserSchema = new mongoose.Schema({
	name:         { type: String, required: true},
	email:        { type: String, required: true}, 
	username:     { type: String, required: true},
	info:         { type: String},
	avatarUrl:    { type: String},
	active:       Boolean,
	lastLogin:    { type: Date},
	hashed_password:     { type: String},
	provider:     { type: String},
	salt:         { type: String},
	facebook:     {},
	twitter:      {},
	google:       {},
});

var BuildingSchema = new mongoose.Schema({
	maxOccupants:    { type: Number },
	type:            { type: String },
	efficiency:    { type: Number },
	itemInfo:        { type: Schema.Types.ObjectId, ref: 'items' },
	requirementInfo: { type: Schema.Types.ObjectId, ref: 'requirements' }
});


var RequirementSchema = new mongoose.Schema({
	requirementInfo: String,
	itemsNeeded: [{
		itemInfo: { type: Schema.Types.ObjectId, ref: 'items' },
		quantity: Number,
		payment: Boolean
	}],
	skillsRequired: [{
		skillInfo: { type: Schema.Types.ObjectId, ref: 'skills' },
		skillLevel: Number 
	}]
});

var SkillSchema = new mongoose.Schema({
	skillName: String,
	skillDescription: String,
	maxLevel: Number,
	previousSkillsRequired: [{
		skillInfo: { type: Schema.Types.ObjectId, ref: 'items' },
		skillLevel: Number
	}]
});


var Inventory = mongoose.model('playeritems', InventorySchema),
    Item = mongoose.model('items', ItemsSchema),
    User = mongoose.model('users', UserSchema),
    Requirement = mongoose.model('requirements', RequirementSchema),
    Skill = mongoose.model('skills', SkillSchema),
    Building = mongoose.model('building', BuildingSchema);    


var me = "532b22bbdf59d1c81040c357";
var woodId = "532a1f8e05e7e28a6593dd1a";

function match(obj, desId, desField) {
    var output = null;
    obj.forEach(function(v) {
        if(v.itemInfo.equals(desId)) {
           output = v[desField];
        }
    });
    return output;
}

function GetBuildingsForUserByType(userId, type, callback) {
	var buildingsByType = [];
	// console.log('********************');
	// console.log("User: " + userId);
	// console.log("Bldg Type: " + type);

	Building.find({type: type }).exec(function(err,bldg) {
		// console.log('********************');	
		// console.log(bldg);
		// console.log('********************');	
		// Inventory.find({itemInfo: { $in: itemsNeeded}, userInfo: req.user._id}).populate('itemInfo').exec(function(err, inv) {
		var bldgs = [];
		var bldgsInfo = [];

		bldg.forEach(function(b) { bldgs.push(b.itemInfo) });

		Inventory.find({userInfo: userId, itemInfo: { $in: bldgs } }).populate('itemInfo').exec(function(err, inv) {
			console.log(inv);
			if(inv) {
				inv.forEach(function(i) {
					buildingsByType.push({
						name: i.itemInfo.name,
						commonName: i.itemInfo.commonName,
						value: i.itemInfo.value,
						quantity: i.quantity,
						maxOccupants: match(bldg, i.itemInfo._id, 'maxOccupants'),
						efficiency: match(bldg, i.itemInfo._id, 'efficiency')
					});
				});

				//console.log(buildingsByType);
				callback(buildingsByType);
			}
		});		
	})


}

GetBuildingsForUserByType(me, 'mining', function(doc) {
	var totalEff = 0;
	console.log(doc);
	console.log('********************');	
	if(doc) {
		doc.forEach(function(b) {
			totalEff += b.efficiency;
		});
	}

	console.log(totalEff);
});


// var wood = new Item({ name: "wood", commonName: "wood", type: "wood", value: 1, limit: 0});
// var food = new Item({ name: "food", commonName: "food", type: "food", value: 1, limit: 0});
// var stone = new Item({ name: "stone", commonName: "stone", type: "ore", value: 1, limit: 0  });
// var iron = new Item({ name: "iron", commonName: "iron", type: "ore", value: 5, limit: 0  });
// var coal = new Item({ name: "coal", commonName: "coal", type: "ore", value: 3, limit: 0  });
// var diamond = new Item({ name: "diamond", commonName: "diamond", type: "ore", value: 10, limit: 0  });
// var woodshack = new Item({ name: "woodshack", commonName: "wood shack", type: "building", value: 50, limit: 0  });
// var huntingcamp = new Item({ name: "huntingcamp", commonName: "hunting camp", type: "building", value: 50, limit: 0  });
// var miningcamp = new Item({ name: "miningcamp", commonName: "mining camp", type: "building", value: 50, limit: 0  });
 
// wood.save(function (err) {
// 	if (err) return handleError(err);
// })


// food.save(function (err) {
// 	if (err) return handleError(err);
// })

// stone.save(function (err) {
// 	if (err) return handleError(err);
// })

// iron.save(function (err) {
// 	if (err) console.log(err);
// })


// coal.save(function (err) {
// 	if (err) console.log(err);
// })

// diamond.save(function (err) {
// 	if (err) console.log(err);
// })

// woodshack.save(function (err) {
// 	if (err) console.log(err);
// })


// huntingcamp.save(function (err) {
// 	if (err) console.log(err);
// })

// miningcamp.save(function (err) {
// 	if (err) console.log(err);
// })


// User.findOne({userName:'mjzitek'}, function(err, u) {
// 	console.log(u);
	
// 	Item.findOne({name : 'wood'}, function(err, i) {
// 		console.log(i);
	
// 		var inv = new Inventory({userId: u._id, itemId: i._id, quantity: 10, level: 0});
	
// 		inv.save(function (err) {
// 			if (err) return handleError(err);
// 		})
// 	});

// }); 


/*  Skills */
// var hunting = new Skill({skillName: "Hunting", skillDescription: "Hunt animals for food", maxLevel: 5, previousSkillsRequired: [ {skillId: null, skillLevel: null}]})

// hunting.save(function (err) { if (err) console.log(err);  });

/* Requirements */

// Item.findOne({name: "wood"}, function (err, i) {
// 	console.log(i);
// 		var woodshackReq = new Requirement({
// 										requirementInfo: "Requirement for building a woodshack", 
// 										itemsNeeded: [{
// 											itemInfo:  i._id,
// 											quantity: 50,
// 											payment: true
// 										}],
// 										skillsRequired: [{
// 											skillInfo: null,
// 											skillLevel: null 
// 										}]										
// 								   });

// 		woodshackReq.save(function (err) { 
// 			if (err) console.log(err);  
// 			console.log('requirement saved');
// 		});

// });


/* Buildings */

// Item.findOne({name: "woodshack"}, function (err, i) {
// 	console.log(i);
	
// 	Requirement.findOne( {_id: "532c743356aec18a591b5fb5" }, function(err, r) {
// 		console.log(r);


// 	})

// var woodshackBldg = new Building(
// 									{
// 										maxOccupents:    5,
// 										type:            'housing',
// 										effienciency:    1,
// 										itemInfo:        "532c5332ad3a53fc4ba30a04",
// 										requirementInfo: "532c743356aec18a591b5fb5"	
// 									}
// 								);

// woodshackBldg.save(function (err) { 	if (err) console.log(err);  });


// });

// Inventory.find({}).populate('itemId userId').exec(function(err, doc) {
// 	console.log(doc);
// });

/* ***************************************************************************************************** */
/* Add a building                                                                                        */



	// Get the building info and requiements

	// Check requirements

	// If meet requirements pay cost and add item to Inv

	// req.params.buildingtype
	// req.user._id

	// var valid = true;
	// var itemsNeeded = [];
	// var itemsArray = [];

	// var buildingToAdd = "miningcamp";

	// Item.findOne({name : buildingToAdd}, function(err, i) {
	// 	Building.findOne({itemInfo: i._id}).populate('requirementInfo').exec(function(err, bldg) {
	// 		console.log('********************');
	// 		console.log("Bldg Info");
	// 		console.log(bldg);
	// 		console.log('********************');	
	// 		bldg.requirementInfo.itemsNeeded.forEach(function(reqitem) {
	// 			itemsNeeded.push(reqitem.itemInfo);
	// 			itemsArray.push({itemInfo: reqitem.itemInfo, quantity: reqitem.quantity});
	// 		});	

	// 		console.log("II: " + itemsNeeded);
	// 		// 	console.log("Req Info");
	// 		// 	console.log(reqitem);
	// 		// 	console.log('********************');
	// 			Inventory.find({itemInfo: { $in: itemsNeeded}, userInfo: me}).populate('itemInfo').exec(function(err, inv) {


	// 				console.log("+++++++++++++++++++++++++++++++");
	// 				console.log(inv);
	// 				console.log("+++++++++++++++++++++++++++++++");
	// 				// itemsNeeded.push({ itemName: doc.itemInfo.name, quantity: reqitem.quantity });
	// 				// console.log(doc);
	// 				// console.log('********************');
	// 				// if(doc.quantity > reqitem.quantity) {
	// 				// 	console.log("You have enough " + doc.itemInfo.name);


	// 				// } else {
	// 				// 	console.log("You do not have enough " + doc.itemInfo.name);
	// 				// 	valid = false;
	// 				// }

	// 				bldg.requirementInfo.itemsNeeded.forEach(function(reqitem) {
	// 					console.log("RRRRR");
	// 					console.log(reqitem);
	// 					inv.forEach(function(i) {
	// 						console.log("IIIIII");
	// 						console.log(i);
	// 						if(reqitem.itemInfo.equals(i.itemInfo._id))
	// 						{
	// 							console.log("+-+-+-+-+-+-+");
	// 							if(i.quantity >= reqitem.quantity)
	// 							{
	// 								console.log("You have enough " + i.itemInfo.name);
	// 							} else {
	// 								var valid = false;
	// 								console.log("You do not have enough " + i.itemInfo.name);
	// 							}
	// 						}
	// 						// } else {

	// 						// 	console.log("+-+-+-+-+-+-+");
	// 						// 	console.log(reqitem.itemInfo + " && " + i.itemInfo._id + " do not match?");
	// 						// }
	// 					});

	// 				});

	// 				if(valid)
	// 				{
	// 					console.log(itemsArray);
	// 					// Pay for it
	// 					itemsArray.forEach(function(reqitem) {
	// 							PayItemFromInventory(me, reqitem.itemInfo, reqitem.quantity);

	// 					});

	// 					// Add item
	// 					AddItemToInventory(me, buildingToAdd ,1);

	// 				}



	// 			});
			//});



			// if(valid)
			// {
			// 	// Pay amount
				
			// 	itemsNeeded.forEach(function(reqitem) {
			// 			PayItemFromInventory(me, reqitem.itemName, reqitem.quantity);

			// 	});
			// 	// Add item
			// 	AddItemToInventory(me, "woodshack" ,1);

			// }

			

	// 	});
	// });



/* ***************************************************************************************************** */




function AddItemToInventory(userId, itemName, amount) {
//	User.findOne({_id: userName}, function(err, u) {
		//console.log(u);
		
		Item.findOne({name : itemName}, function(err, i) {
			//console.log(i);
		
			var inv = new Inventory({userInfo: userId, itemInfo: i._id, quantity: amount, level: 0});
		
			//self = this;
			inv.save(function (err) {

				 if (err) {
				 	console.log(err.code);
				 	// Unique key violation
    				if (11001 === err.code || 11000 === err.code) {

    					Inventory.update({userInfo: userId, itemInfo: i._id}, 
							{'$inc': { quantity: amount }}, function( err, doc) {
							//console.log('Updating ' + itemName + ' for ' + userName);
						});

    					return;	
    				}
    			} else {
    				//console.log('Added ' + itemName + ' for ' + userName);
    			}


			})
		});

//	});

}


function PayItemFromInventory(userId, itemId, amount) {
	console.log("+++ " + userId + " | " + itemId + " | " + amount + " +++");
	//Item.findOne({name : itemName}, function(err, i) {
		Inventory.update({userInfo: userId, itemInfo: itemId}, 
			{'$inc': { quantity: -Math.abs(amount) }}, function( err, doc) {
				console.log('Paid ' + amount + ' of ' + itemId);

				if(err) { console.log(err); }
			//console.log('Updating ' + itemName + ' for ' + userName);
		});
	//});
}


// AddItemToInventory('mjzitek', 'stone', 10);
// AddItemToInventory('mjzitek', 'wood', 10);
// AddItemToInventory('mjzitek', 'food', 10);

// AddItemToInventory('tester1', 'stone', 10);
// AddItemToInventory('tester1', 'wood', 10);
// AddItemToInventory('tester1', 'food', 10);


