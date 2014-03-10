var express = require('express');
var server = express();
var engines = require('consolidate');
var slashes = require('connect-slashes');
var fs = require('fs');
var paths = require('paths');
//var when = require('when');
var Q = require('q');
var hbs = require('express-hbs');
var db = require("./core/server/models/db");
var routes = require("./core/server/routes");


server.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/core/server/views/partials',
  contentHelperName: 'content',
}));
server.set('view engine', 'hbs');
server.set('views', __dirname + '/core/server/views');

server.use(express.static(__dirname + '/core/client/assests/', { redirect : false }));
server.use(slashes(false));


var partialsDir = __dirname + '/core/server/views/partials';
 
var filenames = fs.readdirSync(partialsDir);
 
filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

server.get('/', routes.frontpage(db));




server.listen(3000);
console.log('Listening on port 3000');