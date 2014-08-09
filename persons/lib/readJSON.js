var fs = require('fs');


function getData(filename) {
		var file = '../models/' + filename;
		 
		fs.readFile(file, 'utf8', function (err, data) {
		  	if (err) {
		    	console.log('Error: ' + err);
		    	return;
		  	}
	 
	  		data = JSON.parse(data);
	 	
	  		return data;
		});

}
