
var items = require('../../../controllers/items');



module.exports = function(app) {

	app.get('/items', function(req, res){
		console.log("GET: Items");
		items.getItems(function (items) {
			console.log(items);
			res.send(items);
		});
	});
		
	app.get('/items/:id', function(req, res){
		console.log("GET: Item");
		items.getItem(req.params.id, function (items) {
			console.log(items);
			res.send(items);
		});
	  
	});

};