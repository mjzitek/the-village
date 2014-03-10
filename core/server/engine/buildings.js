/* Buildings */


var Buildings = {

	Items: {
		'woodshack': {
			title: 'Wood Shack',
			maximum: 100,
			description: 'a small wood shack',
			cnt: 0,
			cost: function() {
				return 'wood:10'	
			}
		},
		'miningCamp': {
			title: 'miningCamp',
			maximum: 100,
			description: 'a mining camp',
			cnt: 0,
			cost: function() {
				return 'wood:200';		
			}
		}
	}
};