$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var dummy_von = "15.05.2019 12:00:00";
var dummy_bis = "15.05.2019 13:00:00";

function visualizeDiagram(){
	var anlage = getCurrentAnlageText();
	d3.select("#head_text").text('Zusammenfassung ' + anlage);
	var data = getData(anlage, dummy_von, dummy_bis);

	displayDiagram(data);
}

function visualizeHistory(){
	var anlage = getCurrentAnlageText();
	d3.select("#head_text").text('Historie ' + anlage);
	var data = getData(anlage, dummy_von, dummy_bis);
}

function visualizeWege(){
	var anlage = getCurrentAnlageText();
	d3.select("#head_text").text('Zurückgelegte Wegstrecke ' + anlage);
	var data = getData(anlage, dummy_von, dummy_bis);
}


/* FUNKTIONEN FÜR DARSTELLUNGSFORMEN DER DATEN */
function displayDiagram(input){
	/* siehe https://www.d3-graph-gallery.com/graph/histogram_basic.html */
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 30, bottom: 30, left: 40},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;
	
	// append the svg object to the body of the page
	var svg = d3.select("#grid-container")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");
	
	/* TEST */
	data = [];
	input.forEach(function(d,i){
		if(d[1])
			data.push({value: 1});
		else 
			data.push({value: 0});
	});
		
		
	// X axis: scale and draw:
	var x = d3.scaleLinear()
	    .domain([0, 1])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
	    .range([0, width]);
	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	 // set the parameters for the histogram
	var histogram = d3.histogram()
	    .value(function(d) { return d.value; })   // I need to give the vector of value
	    .domain(x.domain())  // then the domain of the graphic
	    .thresholds(x.ticks(70)); // then the numbers of bins
	
	// And apply this function to data to get the bins
	var bins = histogram(data);
	
	// Y axis: scale and draw:
	var y = d3.scaleLinear()
	    .range([height, 0]);
	    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
	svg.append("g")
	    .call(d3.axisLeft(y));
	
	// append the bar rectangles to the svg element
	svg.selectAll("rect")
	    .data(bins)
	    .enter()
	    .append("rect")
	      .attr("x", 1)
	      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
	      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
	      .attr("height", function(d) { return height - y(d.length); })
	      .style("fill", "#69b3a2")

}