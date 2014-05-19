var inventory = require('../controllers/inventory');

module.exports = function(app) {

	app.get('/inventory', function(req, res){
		console.log("GET: Inventory");
		inventory.getInventory(function (inventory) {
			console.log(inventory);
			res.send(inventory);
		});
	});

	app.get('/inventory/user/:userName', function(req, res){
		console.log("GET: User Inventory");
		inventory.getInventoryByUser(req.params.userName, function (items) {
			console.log("Logged in: " +req.user);
			console.log(items);
			res.send(items);

		});
	  
	});

	app.get('/inventory/user/:id/:item', function(req, res){
		console.log("GET: User Inventory");
		inventory.getInventoryByUserByItem(req.params.id, req.params.item, function (items) {
			console.log(items);
			res.send(items);
		});
	  
	});

}