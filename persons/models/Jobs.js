var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JobSchema = new mongoose.Schema({
	title:          String,
	description:    String,
	levels : [
				{
				    id:          Number,
				    description: String
				}
			 ]
});

mongoose.model('jobs', JobSchema);