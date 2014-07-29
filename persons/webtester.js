
var express = require('express'),
	mongoose = require('mongoose'),
	async = require('async'),
	fs = require('fs');


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

app.get('/details/:data', function(req, res) {
	console.log("Details requested for: " + req.params.data);
  	persons.getPerson(req.params.data, function(persons) {
    return res.jsonp(persons);
  });
});

app.get('/relationships/:data/:gender', function(req, res) {
	console.log("Details requested for: " + req.params.data);
	

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
	async.waterfall([
		function(callback) {
			gamesetting.getValueByKey('time', function(clock) {
				callback(null,clock.setvalue);
			});
		},
		function(clock, callback) {
			persons.populationCountAlive(function(popCount) {
				callback(null, clock, popCount);
			});
		},
		function(clock, popCount, callback) {
			var filter = {
				gender: "M",
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popCountMales) {
				callback(null, clock, popCount, popCountMales);
			});
		},
		function(clock, popCount, popCountMales, callback) {
			var filter = {
				gender: "F",
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popCountFemales) {
				callback(null, clock, popCount, popCountMales, popCountFemales);
			});
		},
		function(clock, popCount, popCountMales, popCountFemales, callback) {
			var filter = {
				dateOfDeath: { $ne : null } 
			}

			persons.populationCountFiltered(filter, function(popCountDead) {
				callback(null, clock, popCount, popCountMales, popCountFemales, popCountDead);
			});
		},
		function(clock, popCount, popCountMales, popCountFemales, popCountDead, callback) {
			var filter = {
				attributes : { married : false },
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				callback(null, clock, popCount, popCountMales, popCountFemales, popCountDead, popSingle);
			});
		},
		function(clock, popCount, popCountMales, popCountFemales, popCountDead, popSingle, callback) {
			var filter = {
				attributes : { married : true },
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popMarried) {
				callback(null, clock, popCount, popCountMales, popCountFemales, popCountDead, popSingle, popMarried);
			});
		}													
	],
	function(err, clock, popCount, popCountMales, popCountFemales, popCountDead, popSingle, popMarried) {
		var data = {
				clock: clock,
				population: popCount,
				men: popCountMales,
				women: popCountFemales,
				dead: popCountDead,
				married: popMarried,
				singles: popSingle,
				children: null,
				adults: null,
				recentBirths: null
		};


		callback(data);
	});
}


/////////////////////////
var server = app.listen(8989, function() {
console.log('Listening on port 8989');
});





