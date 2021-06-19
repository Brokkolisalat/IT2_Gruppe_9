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
	displayTable(data);
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



function displayTable(daten) {
	var myArray = daten;
	
	var table = d3.select("#grid-container").append("table");
    var header = table.append("thead").append("tr");
    header
            .selectAll("th")
            .data(["Zeitpunkt", "Schlüssel", "Wert"])
            .enter()
            .append("th")
            .text(function(d) { return d; });
    var tablebody = table.append("tbody");
    rows = tablebody
            .selectAll("tr")
            .data(myArray)
            .enter()
            .append("tr");
    // We built the rows using the nested array - now each row has its own array.
    cells = rows.selectAll("td")
        // each row has data associated; we get it and enter it for the cells.
            .data(function(d) {
                console.log(d);
                return d;
            })
            .enter()
            .append("td")
            .text(function(d) {
                return d;
            });
	/*
    //Rückgabe der d3.selectAll - Methode in variable p speichern.(Alle Kindelemente von content, die p- Elemente sind.) Am Anfang gibt es noch keine.
    var list = d3.select("#grid-container").selectAll("ul").data(daten);
    //.enter().append(): Daten hinzufuegen falls es mehr Daten als Elemente im HTML gibt.
    //geschieht hier für jede Zeile von daten.
    list.enter().append("li")
        .text(function (daten) {
        	var text = "Uhrzeit: " + daten.datum;
        	for(i = 0; i < filter.length; i++){
        		text +=", Schlüssel " + i + ": " + filter[i] + ", Wert: " + daten.werte[filter[i]];
        	}
            return text;
        });
    //.exit().remove(): Daten löschen, falls es mehr Elemente im HTML als Daten gibt.
    list.exit().remove();*/
    
}