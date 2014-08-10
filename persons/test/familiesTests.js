/* Unit and Intergration tests for families controller */

var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");


var config = require('../config/config');
var tMoment = require('../lib/time.js');
var settings = require('../config/settings');

//var db = mongoose.connect(config.db);

var models_path = __dirname + '/../models';

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

var families = require('../controllers/families');



// ===================================================

var familyId;
var familyName;

describe("Family", function() {

  	after(function(done){    
		families.remove(familyId, function(doc) {
			done();
		});	

//		done();
  

  	}); 

  	///////////////////////////////////////////////////////////////////

  	var id1 = mongoose.Types.ObjectId();
	var id2 = mongoose.Types.ObjectId();


	////////////////////////////////////////
	describe("#create()", function() {
		it("should return family id", function(done) {

			families.create("", function(fam) {
				expect(fam._id).to.not.match(/^Error:/);
				expect(fam._id).to.not.be.empty;
				familyId = fam._id;
				familyName = fam.familyName;
				done();
			});

		});
	});

	describe("#getFamilyName()", function() {
		it("#should return familyName", function(done) {
			families.getFamilyName(familyId, function(fam) {
				expect(fam).to.not.be.empty;
				expect(fam).to.equal(familyName);
				done();
			});
		});
	});

	describe("#get()", function() {
		it("#should return family", function(done) {
			families.get(familyId, function(fam) {
				expect(fam.familyName).to.equal(familyName);
				done();
			});
		});
	});

	describe("#remove()", function() {
		it("should not return error", function(done) {
			families.remove(familyId, function(doc) {
				expect(doc).to.not.match(/^Error:/);
				done();
			});
		});
	});


/////////////////////////////
});