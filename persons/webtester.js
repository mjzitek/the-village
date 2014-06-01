
var express = require('express'),
	mongoose = require('mongoose'),
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


app.get('/siblings/sameparents/:id', function(req, res) {
	persons.getSiblingsSameParents(req.params.id, function(sibs) {
		return res.jsonp(sibs);
	});
});



app.get('/gameclock/', function(req, res) {
	gamesetting.getValueByKey('time', function(time) {
		console.log(time);
		return res.jsonp(time);
	});
});


/////////////////////////
var server = app.listen(8989, function() {
console.log('Listening on port 8989');
});





