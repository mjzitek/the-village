


var Mining = function(Ores) {
    this.minedItem = 'rock';
    this.ores = Ores;
}

Mining.prototype.GetMinedItem = function() {

    oresTotal = 0;
    oresArray = [];
    
    $.each(this.ores, function(t, v) {

        var oValue = v.value;
        var oTimes = Math.floor(100 / oValue);
        for(var i = 0; i < oTimes; i++)
        {
            oresArray.push(v.name);
            oresTotal++;
        }
        
    });
    
    var rand = Math.floor((Math.random()*oresTotal));
    this.minedItem = oresArray[rand];
    
    return this.minedItem;   
    
}


