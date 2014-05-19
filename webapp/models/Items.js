
var mongoose = require('mongoose');

var ItemsSchema = new mongoose.Schema({
	name:       { type: String },
	commonName: { type: String },
	type:       { type: String },
	value:      { type: Number },
	limit:      { type: Number },
	cooloff:    { type: Number } 
});

mongoose.model('items', ItemsSchema);



/*  Methods  */







	

