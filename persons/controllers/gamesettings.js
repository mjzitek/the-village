var mongoose = require('mongoose'),
	GameSetting = mongoose.model('gamesettings');


exports.getValueByKey = function(key, callback) {
	GameSetting.findOne({ setkey: key }, function(err, gs) {
		callback(gs);
	});
}

exports.setValueByKey = function(key, value, callback) {
	var setting = new GameSetting({ setkey: key, setvalue: value });

	setting.save(function (err) {
		if (err) {

			if (11001 === err.code || 11000 === err.code) {
				GameSetting.update({setkey: key}, { setvalue: value }, function(err, doc) {
					callback({message: 'updated'});
				});

			}
		}
	});

}
