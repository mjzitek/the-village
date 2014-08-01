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

exports.getRandomAllele = getRandomAllele
function getRandomAllele(alleles) {

	var randNum = Math.round(Math.random());

	if(randNum === 0) {
		return alleles.one;
	} else {
		return alleles.two;
	}
}

exports.eyeColor = eyeColor;
function eyeColor(dad, mom) {
	try {
		var dadEyeAlleleBey2 = getRandomAllele(dad.genome.genes.eyes.bey2);
		var dadEyeAlleleGey = getRandomAllele(dad.genome.genes.eyes.gey);

		var momEyeAlleleBey2 = getRandomAllele(mom.genome.genes.eyes.bey2);
		var momEyeAlleleGey = getRandomAllele(mom.genome.genes.eyes.gey);

		var bey2 = {
						one: dadEyeAlleleBey2,
						two: momEyeAlleleBey2
		}

		var gey = {
						one: dadEyeAlleleGey,
						two: momEyeAlleleGey
		}

		var color = determineEyeColor(bey2, gey);

		var eyes = { 
						color : color,
						bey2 : bey2,
						gey : gey,
			   }
    } catch (err) {
    	console.log(err);
    	console.log(dad);
    	console.log(mom);
    }

	return eyes;
}

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
	if((Math.floor(Math.random() * 2) === 1)) {
		return set1;
	} else {
		return set2;
	}
}