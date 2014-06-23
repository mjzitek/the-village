var fs = require('fs');
var _ = require('underscore');



// _.mixin({
//   capitalize: function(string) {
//     return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
//   }
// });
// _("fabio").capitalize();

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


exports.determineDominance = determineDominance
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