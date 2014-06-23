var expect = require("chai").expect;

var genetics = require('../helpers/genetics');


describe.only("Helpers - Genetics - Eye Color", function() {


	/////////////////////////////////////

	// brown-brown
	// brown-blue
	// blue-blue

	// green-green
	// green-blue
	// blue-blue

	describe("#determineEyeColor({brown, brown}, { green, green})", function() {
		it("should return 'brown'", function(done) {

			var bey2 = { one: "brown", two: "brown"};
			var gey = { one: "green", two: "green" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("brown");
			done();
		});
	});		

	describe("#determineEyeColor({brown, blue}, { green, green})", function() {
		it("should return 'brown'", function(done) {

			var bey2 = { one: "brown", two: "blue"};
			var gey = { one: "green", two: "green" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("brown");
			done();
		});
	});	

	describe("#determineEyeColor({blue, brown}, { green, green})", function() {
		it("should return 'brown'", function(done) {

			var bey2 = { one: "brown", two: "blue"};
			var gey = { one: "green", two: "green" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("brown");
			done();
		});
	});	


	describe("#determineEyeColor({blue, blue}, { green, green})", function() {
		it("should return 'green'", function(done) {

			var bey2 = { one: "blue", two: "blue"};
			var gey = { one: "green", two: "green" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("green");
			done();
		});
	});	

	describe("#determineEyeColor({blue, blue}, { green, blue})", function() {
		it("should return 'green'", function(done) {

			var bey2 = { one: "blue", two: "blue"};
			var gey = { one: "green", two: "blue" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("green");
			done();
		});
	});	

	describe("#determineEyeColor({blue, blue}, { blue, green})", function() {
		it("should return 'green'", function(done) {

			var bey2 = { one: "blue", two: "blue"};
			var gey = { one: "blue", two: "green" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("green");
			done();
		});
	});		

	describe("#determineEyeColor({blue, blue}, { blue, blue})", function() {
		it("should return 'blue'", function(done) {

			var bey2 = { one: "blue", two: "blue"};
			var gey = { one: "blue", two: "blue" };

			var eyeColor = genetics.determineEyeColor(bey2, gey);
			
			expect(eyeColor).to.equal("blue");
			done();
		});
	});	
});