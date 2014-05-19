var colors = require('colors');

var mongoose = require('mongoose'),
	Inventory = mongoose.model('villageitems'),
	User = mongoose.model('users'),
	Village = mongoose.model('villages');
	Items = mongoose.model('items');

var villages = require('./villages');

exports.getIndex = function(req, res) {

	if(req.user) {
		username = req.user.username;
	} else {
		username = "Guest";
	}


	villages.getVillageForUser(req.user._id, function(village) {	
	   console.log(village);	
		res.render('index', {
			title: 'The Village',
			username: username,
			village: village
		});
	});

};

