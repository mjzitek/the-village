var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TileTypeSchema = new mongoose.Schema({
		name:  String,
		buildOn: Boolean
});

mongoose.model('tiletypes', TileTypeSchema);