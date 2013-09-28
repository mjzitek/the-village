var Buttons = {

	DisplayButtons: function() {

		$("#button-area").html("");

		for (var b in Buttons.AllButtons)
		{
			var button = Buttons.AllButtons[b];

			//alert(button.id)


			
			if(button.active == 1)
			{

				$("#button-area").append("<p><input type='button' id='"+button.id+"' value='"+button.title+"' /></p>");

			}
		}

	},

	AddButton: function(buttonName) {
		$("#button-area").append("<p><input type='button' id='"+Buttons.AllButtons[buttonName].id+"' value='"
			+Buttons.AllButtons[buttonName].title+"' /></p>");

	},

	AllButtons: {
		'chopWood': {
			id: 'btnAddWood',
			active: 1,
			description: 'Chop Wood',
			title: 'Chop Wood',
			cooldown: 30
		},
		'huntFood': {
			id: 'btnHuntFood',
			active: 0,
			description: 'Go Hunting For Food',
			title: 'Hunt Food',
			cooldown: 30

		},
		'buildWoodShack':
		{
			id: 'btnBuildWoodShack',
			active: 0,
			description: 'Build a small wood shack',
			title: 'Build Wood Shack',
			cooldown: 30
		},
		'buildMiningCamp':
		{
			id: 'btnBuildMiningCamp',
			active: 0,
			description: 'Build a small mining camp',
			title: 'Build Mining Camp',
			cooldown: 30
		},
		'mineRock':
		{
			id: 'btnMineRock',
			active: 0,
			description: 'Go Mining',
			title: 'Mine',
			cooldown: 30
		}


	} 


}