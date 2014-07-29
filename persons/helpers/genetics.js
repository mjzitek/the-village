/*

	Functions used to set and get values having to do with the
	"genetics" of a person....appearance, attributes, etc


*/

var fs = require('fs');
var _ = require('underscore');


_.mixin({
	isCapital : function(char) {
		return (char === char.toUpperCase() ? true : false)  
	}
});




exports.determineEyeColor = determineEyeColor;
function determineEyeColor(bey2, gey) {

	// brown-brown
	// brown-blue
	// blue-blue

	// green-green
	// green-blue
	// blue-blue

	if(bey2.one === "brown" || bey2.two === "brown") {
		return "brown";
	} else if (gey.one === "green" || gey.two === "green") {
		return "green";
	} else {
		return "blue";
	}

}


exports.determineDominance = determineDominance;
function determineDominance(input1, input2) {
	if(_(input1).isCapital() && !_(input2).isCapital)
	{
		return input1;
	} else if (!_(input1).isCapital() && _(input2).isCapital())
	{
		return input2;
	} else {
		return input1;
	}
}

/**
*  Picks a random set given two inputs 
*  @param {Object} set1 A gene object
*  @param {Object} set2 A gene object
*  @return {Object} Returns one of the two inputed objects
*/
exports.pickRandomGeneSet = pickRandomGeneSet;
function pickRandomGeneSet(set1, set2) {
	// var ranNum = (Math.floor(Math.random() * 100));
	if((Math.floor(Math.random() * 2) === 1) {
		return set1;
	} else {
		return set2;
	}
}