var mongoose = require('mongoose'),
	Building = mongoose.model('buildings'),
	Item = mongoose.model('items'),
	Inventory = mongoose.model('villageitems'),
	Requirement = mongoose.model('requirements'),
	Village = mongoose.model('villages');


var inventory = require('../controllers/inventory');

//exports.allTypes = function(req, res)

exports.addBuilding = function(req, callback) {
	// Get the building info and requiements

	// Check requirements

	// If meet requirements pay cost and add item to Inv

	// req.params.buildingtype
	// req.user._id

	var valid = true;
	var itemsNeeded = [];
	var itemsArray = [];

	console.log("*********************************");
	console.log("User " + req.user.username + "("+  req.user._id +") / Village " 
		          + req.params.villageId + ", requested to build a " + req.params.buildingtype);
	console.log("*********************************");

	// Check and see if user is owner of village
	Village.findOne({_id: req.params.villageId, owner: req.user._id}, function(err,v) {
		if(v) {
			Item.findOne({name : req.params.buildingtype}, function(err, i) {

					if(i) {
						Building.findOne({itemInfo: i._id}).populate('requirementInfo').exec(function(err, bldg) {	
							if(bldg)
							{
								bldg.requirementInfo.itemsNeeded.forEach(function(reqitem) {
									itemsNeeded.push(reqitem.itemInfo);
									itemsArray.push({itemInfo: reqitem.itemInfo, quantity: reqitem.quantity});
								});	

								Inventory.find({itemInfo: { $in: itemsNeeded}, userInfo: req.user._id}).populate('itemInfo').exec(function(err, inv) {
									if(inv)
									{
										bldg.requirementInfo.itemsNeeded.forEach(function(reqitem) {

											inv.forEach(function(i) {

												if(reqitem.itemInfo.equals(i.itemInfo._id))
												{
													// console.log("+-+-+-+-+-+-+");
													// console.log("Item cost: " + reqitem.quantity);
													// console.log("Amount held: " + i.quantity);

													if(i.quantity >= reqitem.quantity)
													{

														//console.log("You have enough " + i.itemInfo.name);
													} else {
														valid = false;
														//console.log("You do not have enough " + i.itemInfo.name);
													}
												}

											});

										});

										if(valid)
										{
											//console.log(itemsArray);


											// Add item
											inventory.addItemToInventory(req.params.villageId, req.params.buildingtype ,1, function(message) {


												if(message.messageType == "Updated" || message.messageType == "Added")
												{
													message.messageType = "Success";
													message.message = "A " + req.params.buildingtype + " has been built";

													// Pay for it
													itemsArray.forEach(function(reqitem) {
															inventory.payItemFromInventory(req.params.villageId, reqitem.itemInfo, reqitem.quantity);

													});

												} else if (message.messageType == "Error-Time") {
													message.messageType = "Error";
													message.message = "Not enough time has passed to build a " + req.params.buildingtype ;
												}

												callback({ messageType: message.messageType, message: message.message });									
											});

				
										} else 
										{
											callback({ messageType: "Error", message: "Not enough resources to build " + req.params.buildingtype});
										}
									} else {
										callback({ messageType: "Error", message: "There was a problem building " + req.params.buildingtype});
									}

								});
							} else {
								callback({ messageType: "Error", message: "There was a problem building " + req.params.buildingtype});
							}
						});
					} else {
						callback({ messageType: "Error", message: "There was a problem building " + req.params.buildingtype});
					}
				});			
		} else {
			console.log("**** Not valid user for that village");
			callback({ messageType: "Error", message: "You are not that valid user for that village"});
		} 
	})

	

};


exports.getBuildingType = function(id, callback) {
	
	Buildings.findOne({itemId: id}, function(err,doc) {
			//console.log(doc);
			callback(doc);
	});

};	


exports.getBuildingsByType = function(type, callback) {
	
	Buildings.find({type: type}, function(err,doc) {
			//console.log(doc);
			callback(doc);
	});

};	


exports.getBuildingsForVillageByType = function(villageId, type, callback) {
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

		Inventory.find({villageInfo: villageId, itemInfo: { $in: bldgs }, quantity: { $gt: 0 } }).populate('itemInfo').exec(function(err, inv) {
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



function match(obj, desId, desField) {
    var output = null;
    obj.forEach(function(v) {
        if(v.itemInfo.equals(desId)) {
           output = v[desField];
        }
    });
    return output;
}