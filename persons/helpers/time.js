var moment = require('moment');

exports.getDifference = getDifference;
function getDifference(olderDate, newerDate) {

	var then = moment(olderDate);
	var to = moment(newerDate);

	//console.log('Then: ' + then);

	var timeDiff = {};

    // get the difference from now to then in ms
    ms = then.diff(to, 'milliseconds', true);

    //console.log('ms: ' + ms);

    // Years
    timeDiff.years = Math.floor(moment.duration(ms).asYears());
    then = then.subtract('years', timeDiff.years);

    ms = then.diff(to, 'milliseconds', true);

    // Months
    timeDiff.months = Math.floor(moment.duration(ms).asMonths());
    then = then.subtract('months', timeDiff.months).subtract('days', 1);

    ms = then.diff(to, 'milliseconds', true);

    // Days
    timeDiff.days = Math.floor(moment.duration(ms).asDays());
    then = then.subtract('days', timeDiff.days);


    ms = then.diff(to, 'milliseconds', true);

    // Hours
    timeDiff.hours = Math.floor(moment.duration(ms).asHours());
    then = then.subtract('hours', timeDiff.hours);


    ms = then.diff(to, 'milliseconds', true);

    // Minutes
    timeDiff.minutes = Math.floor(moment.duration(ms).asMinutes());
    then = then.subtract('minutes', timeDiff.minutes);

    ms = then.diff(to, 'milliseconds', true);
    timeDiff.seconds = Math.floor(moment.duration(ms).asSeconds());

    return timeDiff;

  }


exports.getAge = function(birthDate)
{

}