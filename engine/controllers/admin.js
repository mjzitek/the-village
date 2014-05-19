var mongoose = require('mongoose'),
	User = mongoose.model('users'),
	Item = mongoose.model('items'),
	Inventory = mongoose.model('villageitems'),
	Village = mongoose.model('villages'),
	Building = mongoose.model('buildings');


exports.useredit = function(req, res) {	
	res.render('admin/usereditor', {
		user : req.user
	});
}