var fs = require('fs');

 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');

/***************************************************************************************
 *	
 *	Get Info
 *
 *
 ***************************************************************************************/

exports.getPersons = function(callback) {
	Person.find({}).populate('familyInfo').exec(function(err, doc) {
		callback (doc);
	});

}

exports.totalPopulation = function(callback) {
	// userModel.count({name: 'anand'}, function(err, c)
	Person.count({}, function(err, c) { callback(c); });
}


exports.getChildrenByFather = function(fatherId, callback) {
	Person.find({ fatherInfo: fatherId }, function(err, children) {
		callback(children);
	});
}



exports.getChildrenByMother = function(motherId, callback) {
	Person.find({ motherId: motherId}, function(err, children) {
		callback(children);
	});
}





/***************************************************************************************
 *	
 *	Actions
 *
 *
 ***************************************************************************************/



exports.giveBirth = function(familyId, familyName, fatherId, motherId, callback) {

						gender = 'M';

						name = getName(pickGender());
  						
					

						//console.log(name);

						var per = new Person({ familyInfo: familyId, 
											   firstName: name.first,
											   middleName:  name.middle,
											   lastName: familyName,
											   gender: gender,
											   dateOfBirth: new Date(),
											   placeOfBirth: null,
											   headOfFamily: 0,
											   fatherInfo: fatherId, 
											   motherInfo: motherId
										     });

						//console.log("U:" + u);
						//console.log("I:" + i);
						//console.log("inv: " + inv);
						//self = this;

						per.save(function (err) {

							// if (err) {
							//  	//console.log("Error Code: " + err);
							//  	// Unique key violation
			    // 				if (11001 === err.code || 11000 === err.code) {

			    // 					Inventory.update({villageInfo: villageId, itemInfo: i._id}, 
							// 			{'$inc': { quantity: amount }, lastUpdated: new Date()}, function( err, doc) {
							// 			//console.log('Updating ' + itemName + ' for ' + u.username);
							// 			callback({messageType: "Updated", message: ""});
							// 		});

									
			    // 				}
			    			
			    // 			} else {
			    // 				//console.log('Added ' + itemName + ' for ' + u.username);
							//	callback({messageType: "Added", message: ""});
			    			//}


						});

}

function pickGender()
{
	var ranNum = (Math.floor(Math.random() * 100));

	if(ranNum < 60) {
		return 'M';
	} else
	{
		return 'F';
	}
}



function getRandomName(filename, line_no) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    line_no = line_no - 1;

    return lines[line_no];
}


function getName(gender) {

	var nameFile;

	if(gender == "M")
	{
		nameFile = 'male_names.txt';
	} else if (gender == "F")
	{
		nameFile = 'female_names.txt';
	}

	var first = getRandomName('./models/' + nameFile, (Math.floor(Math.random() * 100)));
	var middle = getRandomName('./models/' + nameFile, (Math.floor(Math.random() * 100)));

	var name = { first: first, middle: middle };

	return name;
}


