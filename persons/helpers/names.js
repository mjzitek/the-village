var fs = require("fs");

exports.getNameFromFile = getNameFromFile;
function getNameFromFile(filename, line_no) {
	try {
	    var data = fs.readFileSync(filename, 'utf8');
	    var lines = data.split("\n");

	    line_no = line_no - 1;
	    if(line_no < 0) line_no = 0;

	    return lines[line_no];
	} catch (e) {
		return e;
	}
}

exports.getRandomName = getRandomName;
function getRandomName(type) {

	var nameFile;

	if(type === "M")
	{
		nameFile = 'male_names.txt';
	} else if (type === "F")
	{
		nameFile = 'female_names.txt';
	} else if (type === "S")
	{
		nameFile = 'surname_names.txt';
	}
	else
	{
		return("Error: no type selected");
	}

	if(nameFile) 
	{
		try
		{
			if(type === "M" || type === "F")
			{
				var first = getNameFromFile('./models/' + nameFile, (Math.floor(Math.random() * 900)));
				var middle = getNameFromFile('./models/' + nameFile, (Math.floor(Math.random() * 900)));
				var name = { first: first, middle: middle };
			} else if(type === "S")
			{
				var surname = getNameFromFile('./models/' + nameFile, (Math.floor(Math.random() * 100)));
				var name = surname;
			}



		} catch(e) {
			return e;
		}
	}
	return name;
}