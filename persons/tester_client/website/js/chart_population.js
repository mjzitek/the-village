
function loadPopulationChart() {
  $("#population-chart").html("");

  var xTickInterval = 5;

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 450 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);





  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#population-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("http://" + Config.hostserver + ":" + Config.hostport + "/stats/population", function(error, data) {
    data.forEach(function(d) {
      //console.log(d);
      d.date = parseDate(d.date);
      //d.value = +d.value;
    });

    var dateRange = d3.extent(data, function(d) { return d.date; });

    var a = moment(dateRange[0]);
    var b = moment(dateRange[1]);

    if(b.diff(a, 'years') < 10) {
        xTickInterval = 1; 
    } else {
        xTickInterval = 5;
    }

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.value; }));

    var maxDataPoint = d3.max(dateRange[1]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(d3.time.years, xTickInterval)    
      .orient("bottom");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  });
}

loadPopulationChart();

setInterval(loadPopulationChart, 30000);