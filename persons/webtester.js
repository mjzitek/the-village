
var express = require('express'),
	mongoose = require('mongoose'),
	async = require('async'),
	fs = require('fs'),
	moment = require('moment');


var app = express();

var db = mongoose.connect('mongodb://localhost/village');


var models_path = __dirname + '/models';


var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()) {
			if(/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath);
			}
		} else if (stat.isDirectory) {
			walk(newPath);
		}
	});
}

walk(models_path);


var persons = require('./controllers/persons');
var families = require('./controllers/families');
var relationships = require('./controllers/relationships');
var gamesetting = require('./controllers/gamesettings');
var personevents = require('./controllers/personevents');

/////////////////////////
// Import the routes
// fs.readdirSync('./core/server/routes').forEach(function(file) {
//   if ( file[0] == '.' ) return;
//   var routeName = file.substr(0, file.indexOf('.'));
//   require('./core/server/routes/' + routeName)(app, passport);
// });



app.get('/', function(req, res) {
 
  persons.getPersons(function(persons) {
      return res.jsonp(persons);
  });
});


app.get('/summary', function(req, res) {
	getSummaryData(function(data) {
		return res.jsonp(data);
	})

});

app.get('/events/details/:eventid', function(req, res) {
	personevents.getEventDetails(req.params.eventid, function(events) {
		return res.jsonp(events);
	});
});


app.get('/events/:id/:amount', function(req, res) {
	personevents.get(req.params.id, req.params.amount, function(events) {
		return res.jsonp(events);
	});
});



app.get('/details/:data', function(req, res) {
	//console.log("Details requested for: " + req.params.data);
  	persons.getPerson(req.params.data, function(persons) {
    	return res.jsonp(persons);
  });
});

app.get('/relationships/:data/:gender', function(req, res) {
	//console.log("Details requested for: " + req.params.data);
	

	if(req.params.gender == "M")
	{
  		relationships.getWife(req.params.data, function(wife) {
  			persons.getPerson(wife, function(per) {
				return res.jsonp(per);
  			});
  		});
	} else if (req.params.gender == "F")
	{
  		relationships.getHusband(req.params.data, function(husband) {
  			persons.getPerson(husband, function(per) {
				return res.jsonp(per);
  			});
  		});
	} else {

	}
    
  
});


app.get('/details/children/:data/:gender', function(req, res) {
	if(req.params.gender == "M")
	{
		persons.getChildrenByFather(req.params.data, function(children) {
			return res.jsonp(children)
		});
	} else if (req.params.gender == "F")
	{
		persons.getChildrenByMother(req.params.data, function(children) {
			return res.jsonp(children)
		});
	} else {

	}
});

app.get('/details/parents/:id', function (req, res) {
	persons.getParents(req.params.id, function(parents) {
		console.log(parents);
		return res.json(parents);
	})
});

app.get('/siblings/sameparents/:id', function(req, res) {
	persons.getSiblingsSameParents(req.params.id, function(sibs) {
		return res.jsonp(sibs);
	});
});

app.get('/parents/:id', function(req, res) {
	persons.getParents(req.params.id, function(parents) {
		return res.jsonp(parents);
	});
});

app.get('/gameclock/', function(req, res) {
	gamesetting.getValueByKey('time', function(time) {
		console.log(time);
		return res.jsonp(time);
	});
});


app.get('/graphdata/:data', function(req, res) {
	// var data = { name: "flare", children: [ { name: "cluster", 
	// 				children: [{ name: "AgglomerativeCluster", size: 3938}] }]};
  	console.log('Getting graph data...');

  		persons.getChildrenGrandchildren(req.params.data, function(data) {
  			return res.jsonp(data);
  		});			



});


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

function getSummaryData(callback) {
	var data = {
			clock: null,
			population: null,
			men: null,
			women: null,
			dead: null,
			married: null,
			singles: null,
			singlesMen: null,
			singlesWomen: null,
			children: null,
			adults: null,
			recentBirths: null,
			childCutoffDate: null,
			pregnant: null,
			eyes: null
	};

	data.eyes = { brown: null, blue: null, green: null }


	async.waterfall([
		// clock
		function(callback) {
			gamesetting.getValueByKey('time', function(clock) {
				data.clock = moment(clock.setvalue);
				callback(null,data);
			});
		},
		// population
		function(data, callback) {
			persons.populationCountAlive(function(popCount) {
				data.population = popCount;
				callback(null, data);
			});
		},
		// males
		function(data, callback) {
			var filter = {
				gender: "M",
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popCountMales) {
				data.men = popCountMales;
				callback(null, data);
			});
		},
		// females
		function(data, callback) {
			var filter = {
				gender: "F",
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popCountFemales) {
				data.women = popCountFemales;
				callback(null, data);
			});
		},
		// dead
		function(data, callback) {
			var filter = {
				dateOfDeath: { $ne : null } 
			}

			persons.populationCountFiltered(filter, function(popCountDead) {
				data.dead = popCountDead;
				callback(null, data);
			});
		},
		// single
		function(data, callback) {
			var filter = {
				attributes : { married : false },
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				data.singles = popSingle;
				callback(null, data);
			});
		},
		// singlesMen
		function(data, callback) {
			var filter = {
				attributes : { married : false },
				gender: "M",				
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				data.singlesMen = popSingle;
				callback(null, data);
			});
		},
		// singlesWomen
		function(data, callback) {
			var filter = {
				attributes : { married : false },
				gender: "F",				
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				data.singlesWomen = popSingle;
				callback(null, data);
			});
		},
		// married
		function(data, callback) {
			var filter = {
				attributes : { married : true },
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popMarried) {
				data.married = popMarried;
				callback(null, data);
			});
		},
		// childCutoffDate
		function(data, callback) {
			var c2 = moment(data.clock);

			var childCutoffDate = c2.subtract("y", 18).format('YYYY-MM-DD');
			data.childCutoffDate = childCutoffDate;
			callback(null, data)
		},
		// children
		function(data, callback) {

			var filter = {
				dateOfDeath: null,
				dateOfBirth: { $lt : data.childCutoffDate}
			}

			persons.populationCountFiltered(filter, function(children) {
				data.children = children;
				callback(null, data);
			});
		},
		// adults
		function(data, callback) {

			var filter = {
				dateOfDeath: null,
				dateOfBirth: { $gte : data.childCutoffDate}
			}

			persons.populationCountFiltered(filter, function(adults) {
				data.adults = adults;
				callback(null, data);
			});
		},
		// recentBirths
		function(data, callback) {

			var c2 = moment(data.clock);

			var recentBirthCutoffDate = c2.subtract("y", 1).format('YYYY-MM-DD');			

			var filter = {
				dateOfDeath: null,
				dateOfBirth: { $gte : recentBirthCutoffDate}
			}

			persons.populationCountFiltered(filter, function(recentBirths) {
				data.recentBirths = recentBirths
				callback(null, data);
			});
		},
		// pregnant
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"pregnancy.pregnant" : true
			}

			persons.populationCountFiltered(filter, function(preg) {
				data.pregnant = preg
				callback(null, data);
			});			
		},
		// Eye Color - Brown
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"genome.genes.eyes.color" : "brown"
			}

			persons.populationCountFiltered(filter, function(eyesBrown) {
				data.eyes.brown = eyesBrown;
				callback(null, data);
			});			
		},		
		// Eye Color - Green
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"genome.genes.eyes.color" : "green"
			}

			persons.populationCountFiltered(filter, function(eyesGreen) {
				data.eyes.green = eyesGreen;
				callback(null, data);
			});			
		},
		// Eye Color - Blue
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"genome.genes.eyes.color" : "blue"
			}

			persons.populationCountFiltered(filter, function(eyesBlue) {
				data.eyes.blue = eyesBlue;
				callback(null, data);
			});			
		},																									
	],
	function(err, data) {

		data.clock = data.clock.format('MMM DD, YYYY');

		callback(data);
	});
}


/////////////////////////
var server = app.listen(8989, function() {
console.log('Listening on port 8989');
});





