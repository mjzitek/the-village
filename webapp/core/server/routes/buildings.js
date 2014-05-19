var colors = require("colors");

var buildings = require('../controllers/buildings');
var inventory = require('../controllers/inventory');

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}



module.exports = function(app) {

	//app.get('/buildings', buildings.allTypes);

	app.post('/buildings/build/:villageId/:buildingtype', isLoggedIn, function(req, res) {
		buildings.addBuilding(req, function(data, err) {
			console.log("DATA: " + data);
			if(err) { 
				console.log("ERROR: ".red + err);
				return res.send(500) 
			};
			res.jsonp(data);
		});	
	});

	// app.get('/buildings', function(req, res){
	// 	console.log("GET: Buildings");
	// 	buildings.getBuildings(function (items) {
	// 		//console.log(items);
	// 		res.send(items);
	// 	});
	// })

	// app.get('/buildings/:userid', function(req, res){
	// 	console.log("GET: Buildings for User " + req.params.userid);

	// 	this.usersBuildings = [];
	// 	this.bbType = "";
		

	// 	models.ItemsData.getBuildings(function (buildingTypes) {
	// 		//console.log(buildingTypes)

	// 		models.InventoryData.getInventoryByUserId(req.params.userid, function (items) {

	// 			//console.log(items);

	// 			buildingTypes.forEach(function(building) {
	// 				items.forEach(function(item) {
						
	// 					if(building.name == item.itemName) {
	// 						console.log(building);
	// 						//console.log(item.quantity);
	// 						models.BuildingsData.getBuildingType(building.itemId, function (btype) {
	// 						//	console.log(btype);
	// 							bbType = btype;
	// 						});

	// 						console.log("YYYY " + bbType);
	// 						this.usersBuildings.push({ "buildingName" : building.name, 
	// 											"buildingType" : "XXXX", "quantity" : item.quantity });
	// 					}
	// 				});
	// 			});

	// 			res.send(usersBuildings);		

	// 		});

	// 	});

	// })


	// app.get('/buildings/:userid/:buildingtype', function(req, res){

	// })

	// app.post('/buildings/build/:building', function(req, res) {
	// 	// Do we have any of the items in the inventory already
	// 		// If so increment

	// 		// Else add


	// 	models.InventoryData.incInventoryItem(1, req.params.building, 1);
	// 	res.send('building ' + req.params.building);
	// 	console.log('building ' + req.params.building);
	// });

};