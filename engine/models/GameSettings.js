 var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSettingsSchema = new mongoose.Schema({
	key: 	String,
	value: 	String,
	notes: 	String


});



mongoose.model('gamesettings', GameSettingsSchema);



