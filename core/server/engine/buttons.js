var Buttons = {

	DisplayButtons: function(reset) {

		var reset = !!reset || false;

		//console.log(reset);
		if(reset) {
			for (var b in Buttons.AllButtons)
			{
				var button = Buttons.AllButtons[b];
				button.active = 0;
			}

			Buttons.AllButtons.chopWood.active = 1;
		}

		$("#button-area-tasks").html("");
		$("#button-area-buildings").html("");
		$("#button-area-others").html("");

		for (var b in Buttons.AllButtons)
		{
			var button = Buttons.AllButtons[b];
			var buttonArea = null;

			//alert(button.id)

			if(button.type == "task")
			{
				buttonArea = "#button-area-tasks";
			} else if (button.type == "building")
			{
				buttonArea = "#button-area-buildings";
			} else {
				buttonArea = "#button-area-others";
			}

			
			if(button.active == 1)
			{


				$(buttonArea).append("<p><input type='button' id='"+button.id+"' value='"+button.title+"' /></p>");

			}
		}

	},

//	AddButton: function(buttonName) {
//		$("#button-area").append("<p><input type='button' id='"+Buttons.AllButtons[buttonName].id+"' value='"
//			+Buttons.AllButtons[buttonName].title+"' /></p>");
//	},

	AllButtons: {
		'chopWood': {
			id: 'btnAddWood',
			type: 'task',
			active: 1,
			description: 'Chop Wood',
			title: 'Chop Wood',
			cooldown: 30
		},
		'huntFood': {
			id: 'btnHuntFood',
			type: 'task',			
			active: 0,
			description: 'Go Hunting For Food',
			title: 'Hunt Food',
			cooldown: 30
		},
		'mineRock':
		{
			id: 'btnMineRock',
			type: 'task',
			active: 0,
			description: 'Go Mining',
			title: 'Mine',
			cooldown: 30
		},
		'buildWoodShack':
		{
			id: 'btnBuildWoodShack',
			type: 'building',			
			active: 0,
			description: 'Build a small wood shack',
			title: 'Build Wood Shack',
			cooldown: 30
		},
		'buildMiningCamp':
		{
			id: 'btnBuildMiningCamp',
			type: 'building',
			active: 0,
			description: 'Build a small mining camp',
			title: 'Build Mining Camp',
			cooldown: 30
		}



	} 


}