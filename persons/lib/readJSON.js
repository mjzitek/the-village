var fs = require('fs');

exports.getData = getData;
function getData(filename, callback) {
		var file = 'models/' + filename;
		 
		fs.readFile(file, 'utf8', function (err, data) {
		  	if (err) {
		    	console.log('Error: ' + err);
		    	return;
		  	}

	  		data = JSON.parse(data);
	 		
	  		callback(data);
		});

}
