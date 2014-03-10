var when = require('when');




exports.frontpage = function(db){
  	console.log('Front Page requested');
  	return function(req, res) {


		res.render('index');


  		
  	}
};