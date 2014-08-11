var expect = require("chai").expect;

var readJSON = require('../lib/readJSON');


describe("ReadJSON", function() {

	describe("getData('heightToWeight.json')", function() {
		it("expects data.men[0].year to equal 0", function(done) {
			readJSON.getData('heightToWeight.json', function(data) {
				expect(data.men[0].year).to.equal[0];			
			});

			done();
		});
	});

});