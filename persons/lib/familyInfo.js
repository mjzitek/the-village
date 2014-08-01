var async = require('async'),
	fs = require('fs'),
	moment = require('moment');

var persons = require('./controllers/persons');
var families = require('./controllers/families');
var relationships = require('./controllers/relationships');
var gamesetting = require('./controllers/gamesettings');
var personevents = require('./controllers/personevents');



function getGraphData(personId, callback) {
		var data = {}
		var children = [];
		console.log("Getting data for " + personId);
		async.waterfall([
			function(callback) {
				  	persons.getPerson(personId, function(per) {
				  		callback(null, per);
				  	});
			},
			function(per, callback)
			{
				var data = {}
				data['id'] = per._id;
				data['name'] = per.firstName + ' ' + per.lastName;
				callback(null, per, data)
			},
			function(person, data, callback)
			{

				if(person.gender == "M")
				{
					persons.getChildrenByFather(person._id, function(childern) {
						callback(null, person, children, data);
					});
				} else if (person.gender == "F")
				{
					persons.getChildrenByMother(person._id, function(children) {
						callback(null, person, children, data);
					});
				}
			},
			function(person, children, data, callback)
			{
				var waiting = 0;
				var childrenArray = [];

				children.forEach(function(c) {
					waiting++;
					var grandchildrenArray = [];
					console.log("waiting++ " + waiting);
					if(c.gender == "M")
					{
						persons.getChildrenByFather(c._id, function(gc) {
							
							gc.forEach(function(gcc) {
								console.log('gc: ' + gcc._id);
								grandchildrenArray.push({ 'id' : gcc._id, 'name' : gcc.firstName + ' ' + gcc.lastName, 'relation' : 'grandchild' });
							});
							waiting--;
							console.log("waiting-- " + waiting);
							childrenArray.push({ 'id' : c._id, 'name' : c.firstName + ' ' + c.lastName, 'gender' : c.gender, 
												 'relation': 'child', 'children' : grandchildrenArray});

							if(waiting == 0)
							{
								console.log(childrenArray);
								callback(null, person, childrenArray, data);
							}

						});
					} else if (c.gender == "F")
					{
						persons.getChildrenByMother(c._id, function(gc) {
							
							gc.forEach(function(gcc) {
								console.log('gc: ' + gcc._id);
								grandchildrenArray.push({ 'id' : gcc._id, 'name' : gcc.firstName + ' ' + gcc.lastName, 'gender' : gcc.gender, 
														  'relation' : 'grandchild' });
							});
							waiting--;
							console.log("waiting-- " + waiting);
								childrenArray.push({ 'id' : c._id, 'name' : c.firstName + ' ' + c.lastName, 'gender' : c.gender, 
												     'relation': 'child', 'children' : grandchildrenArray });
							if(waiting == 0)
							{
								console.log(childrenArray);
								callback(null, person, childrenArray, data);
							}

						});
					}
				});

			}
		],
		function(err, per, childrenArray, data) {
			data['children'] = childrenArray;
	    	if(err) {
	    		callback(err);
	    	} else
	    	{
	    		callback(data);    		
	    	}

		});

}