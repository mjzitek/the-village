function loadGraph(data)
{
	var width = 960,
	    height = 570;

	var cluster = d3.layout.cluster()
	    .size([height, width - 160]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#basic-modal-content").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(40,0)");

	// var data = { name: "flare", children: [ { name: "cluster", 
	// 				children: [{ name: "AgglomerativeCluster", size: 3938}] }]}

	//d3.json("/data/data.json", function(error, root) {


	   console.log("XXXX");
	   console.log(data);

	  var nodes = cluster.nodes(data),
	      links = cluster.links(nodes);

	  console.log(nodes);


	  var link = svg.selectAll(".link")
	      .data(links)
	    .enter().append("path")
	      .attr("class", "link")
	      .attr("d", diagonal);

	  var node = svg.selectAll(".node")
	      .data(nodes)
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	  node.append("circle")
	      .attr("r", 4.5);

	  node.append("text")
	      .attr("dx", function(d) { return d.children ? 66 : 8; })
	      .attr("dy", function(d) { return d.children ? -10 : 3; })
	      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
	      .text(function(d) { return d.name; });

	  node.append("text")
	      .attr("dx", function(d) { return d.children ? 16 : 8; })
	      .attr("dy", 13)
	      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
	      .attr('class', 'blue')
	      .text(function(d) { return d.relation; });    
	//});

	d3.select(self.frameElement).style("height", height + "px");
}