
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

// controllers
var persons = require('./controllers/persons');
var families = require('./controllers/families');
var relationships = require('./controllers/relationships');
var gamesetting = require('./controllers/gamesettings');
var personevents = require('./controllers/personevents');

// other libs
var stats = require('./lib/stats');
var familyInfo = require('./lib/familyInfo');


/////////////////////////////////////////////////////////////////////////
//
// Routes

app.get('/', function(req, res) {
 
  persons.getPersons(function(persons) {
      return res.jsonp(persons);
  });
});


app.get('/summary', function(req, res) {
	stats.getSummaryData(function(data) {
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




///////////////////////////////////////////////////
var server = app.listen(8989, function() {
console.log('Listening on port 8989');
});





