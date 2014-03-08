var Ore = function(name, value, hardness, commonName) {
        this.name = name;
        this.value = value || 0;
        this.hardness = hardness || 0;
        this.commonName = commonName || "Ore";
};

Ore.prototype.GetValue = function()
{
    return this.value;
}

var Ores = {
    stone: new Ore('stone',1,1,'Stone'),
    coal: new Ore('coal',8,1,'Coal'),
    iron: new Ore('iron',10,2,'Iron'),
    diamond: new Ore('diamond',40,5,'Diamond')
}