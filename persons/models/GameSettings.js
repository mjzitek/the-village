 var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSettingsSchema = new mongoose.Schema({
	setkey: 	String,
	setvalue: 	String,
	notes: 		String


});



mongoose.model('gamesettings', GameSettingsSchema);



