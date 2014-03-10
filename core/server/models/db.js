var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("DB file not found");
  //console.log("Creating DB file.");
  //fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


//var dbSelectStmt = db.prepare("SELECT username, email FROM users WHERE userId = 1");

function User() {
	this.username = null;
	this.email = null;
}

var user1 = new User();

var users = [];

db.serialize(function() {
	db.each("SELECT username, email FROM users", function (err, row) {
		users.push(row);
	});

	console.log(users);
});


db.close();





//module.exports = db;