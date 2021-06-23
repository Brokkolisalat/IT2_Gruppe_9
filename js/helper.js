/* VERFÜGBARE ANLAGEMODULE */
var anlage_name = ["Hochregallager", "Bearbeitungsstation", "Vakuum-Sauggreifer", "Sortierstrecke", "Umsetzer", "Ampel"];


function init(){
	
}

/* SETZE AUSGEWÄHLTES ANLAGEMODUL GLOBAL */
function setCurrentAnlage(id){
	if(id >= anlage_name.length) return;
	sessionStorage.setItem("anlage", id);
}

function getCurrentAnlage(){
	var id = sessionStorage.getItem("anlage");
	if(id == null) return -1;
	else return id;
}

function getCurrentAnlageText(){
	return anlage_name[getCurrentAnlage()];	
}

/* DATENFUNKTIONEN */
/* Einstiegspunkt für JSON-Daten */
function getData(anlage, von_datum, bis_datum, caller) {
	var filter = getFilterByAnlage(anlage);
    d3.json("https://it2wi1.if-lab.de/rest/ft_ablauf").then(function (data, error) {
        callData(data, error, filter, von_datum, bis_datum, caller);
    });
}

/* D3-Aufruffunktion */
function callData(datenEmpfangen,error, filter, von_datum, bis_datum, caller) {
    if (error) {
        console.log(error);
		return null;
    } else {    	
		if(caller == "diagram") {
			displayDiagram(parseData(datenEmpfangen, filter, von_datum, bis_datum));
		}
		else if(caller == "history")
			displayTable(parseData(datenEmpfangen, filter, von_datum, bis_datum));
		else if(caller == "wege")
			displayDistance(parseData(datenEmpfangen, filter, von_datum, bis_datum));		
    }
}

/* Umwandeln der JSON-Daten in zweidimensionalem Array
	zeilen[0] -> 1. JSON-Zeile 
	zeilen[0][0] -> 1. Wert der 1. JSON-Zeile
	zeilen[1] -> 2. JSON-Zeile
	zeilen[1][0] -> 1. Wert der 2. JSON-Zeile
	zeilen[1][1] -> 2. Wert der 2. JSON-Zeile
	zeilen[0][0][0] Datum
	zeilen[0][0][1] JSON-Key
	zeilen[0][0][2] JSON-Wert
	 */
function parseData(daten, filter, von_datum, bis_datum){
	var zeilen = [];
	/* Schleife durch sämtliche JSON-Einträge */
	daten.forEach(function(json_zeile, i){
		/* Nur Einträge in entsprechendem Zeitraum */
		//if(eintrag.datum >= von_datum && eintrag.datum <= bis_datum){
			/* Schleife durch gültige JSON-Keys (Filter) */
			var value_changed = false;
			var werte_pro_zeile = [];
	        for(let f in filter){
				/* Timestamp, Filtername (z.B. H-Vertikal), Filterwert (z.B. 0)*/
				if(i == 0 || daten[i-1].werte[filter[f]] != json_zeile.werte[filter[f]]) value_changed = true;
				werte_pro_zeile.push([json_zeile.datum, filter[f], json_zeile.werte[filter[f]]]);
			}
			/* NUR ZEILEN MIT VERÄNDERTEN WERTEN WEGSCHREIBEN */
			if(value_changed)
				zeilen.push(werte_pro_zeile);
		//}
    });
	return zeilen;
}

/* ERHALTE GÜLTIGE JSON-KEYS PRO ANLAGEMODUL */
function getFilterByAnlage(anlage){
	let filter = [];
	switch (anlage) {
		case "Hochregallager": 
			filter.push("H-vertikal");
			filter.push("H-horizontal");
			filter.push("Referenztaster horizontal");
			filter.push("Lichtschranke innen");
			filter.push("Lichtschranke aussen");
			filter.push("Referenztaster vertikal");
			filter.push("Referenztaster Ausleger vorne");
			filter.push("Referenztaster Ausleger hinten");
			break;
		case "Bearbeitungsstation":
			filter.push("B-Referenzschalter Drehkranz (Pos. Sauger)");
			filter.push("B-Referenzschalter Drehkranz (Pos. Foerderband)");
			filter.push("B-Lichtschranke Ende Foerderband");
			filter.push("B-Referenzschalter Drehkranz (Pos. Saege)");
			filter.push("B-Referenzschalter Sauger (Pos. Drehkranz)");
			filter.push("B-Referenzschalter Ofenschieber Innen");
			filter.push("B-Referenzschalter Ofenschieber Aussen");
			filter.push("B-Referenzschalter Sauger (Pos. Brennofen)");
			filter.push("B-Lichtschranke Brennofen");
			filter.push("B-Motor Drehkranz im Uhrzeigersinn");
			filter.push("B-Motor Drehkranz gegen Uhrzeigersinn");
			filter.push("B-Motor Foerderband vorwaerts");
			filter.push("B-Motor Saege");
			filter.push("B-Motor Ofenschieber Einfahren");
			filter.push("B-Motor Ofenschieber Ausfahren");
			filter.push("B-Motor Sauger zum Ofen");
			filter.push("B-Motor Sauger zum Drehkranz");
			filter.push("B-Leuchte Ofen");
			break;
		case "Vakuum-Sauggreifer": 
			filter.push("V-vertikal");
			filter.push("V-drehen");
			filter.push("V-horizontal");
			filter.push("V-Referenzschalter vertikal");
			filter.push("V-Referenzschalter horizontal");
			filter.push("V-Referenzschalter drehen");
			break;
		case "Sortierstrecke": 
			filter.push("S-Lichtschranke Eingang");
			filter.push("S-Lichtschranke nach Farbsensor");
			filter.push("S-Lichtschranke weiss");
			filter.push("S-Lichtschranke rot");
			filter.push("S-Lichtschranke blau");
			filter.push("S-Motor Foerderband");
			break;
		case "Umsetzer":
			filter.push("Umsetzer Endanschlag 1 (3B1)");
			filter.push("Umsetzer Endanschlag 2 (3B2)");
			break;
		case "Ampel":
			filter.push("Ampel rot");
			filter.push("Ampel orange");
			filter.push("Ampel gruen");
			filter.push("Ampel weiss");
			break;
		default:
			break;
	}
	return filter;
}

/* PRÜFE ANGEGEBENEN FILTER AUF GÜLTIGKEIT (JSON->Werte->Key) */
function isValidFilter(filter, daten){
	var valid_filters = d3.keys(daten["0"].werte);
	for (i = 0; i < valid_filters.length; i++) {
		if(valid_filters[i] == filter) return true;
	}
	return false;
}

/* LEGT ANGEGEBENE ANLAGE ÜBERHAUPT WEGE ZURÜCK? */
function hasWegeOption(anlage){
	return anlage == anlage_name[0] 
		|| anlage == anlage_name[1]
		|| anlage == anlage_name[2]
		|| anlage == anlage_name[3];
}

/* FUNKTIONEN FÜR DARSTELLUNGSFORMEN DER DATEN */
function displayDiagram(input){
	var current_anlage = getCurrentAnlageText();
	console.log(current_anlage); //print
	/*aggregierte Daten in arrays packen
	statiChanges[0] -> 1. Sensor
	statiChanges[0][0] -> Name des 1. Sensors
	statiChanges[0][1] -> Stati-Änderungen des 1. Sensors
	statiChanges[1] -> 2. Sensor
	statiChanges[1][0] -> Name des 2. Sensors
	statiChanges[1][1] -> Stati-Änderungen des 2. Sensors
	...
	*/
	var statiChanges = countStatusChangeWrapper(input);
	for(k = 0; k < statiChanges.length; k++) { //test print
		console.log(statiChanges[k][0]+": "+statiChanges[k][1]);
	}

	/* siehe https://www.d3-graph-gallery.com/graph/histogram_basic.html */
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 30, bottom: 30, left: 40},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;
	
	// append the svg object to the body of the page
	var svg = d3.select("#diagram")
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
	
	var table = d3.select("#table").append("table");
    var header = table.append("thead").append("tr");
    header
            .selectAll("th")
            .data(["Zeitpunkt", "Sensor/Aktor", "Status"])
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
}

function displayDistance(input) {
	var current_anlage = getCurrentAnlageText();
	console.log(current_anlage); //print
	/*aggregierte Daten in arrays packen
	cumulativeDistance[0] -> 1. Sensor falls vorhanden
	cumulativeDistance[0][0] -> Name des 1. Sensors
	cumulativeDistance[0][1] -> kumulierte Wegstrecke des 1. Sensors
	cumulativeDistance[1] -> 2. Sensor falls vorhanden
	cumulativeDistance[1][0] -> Name des 2. Sensors
	cumulativeDistance[1][1] -> kumulierte Wegstrecke des 2. Sensors
	...
	*/
	var cumulativeDistance = cumulativeDistanceWrapper(input);
	for(k = 0; k < cumulativeDistance.length; k++) { //test print
		console.log(cumulativeDistance[k][0]+": "+cumulativeDistance[k][1]);
	}
}

//Wegstrecke kumulieren
function cumulativeDistance(zeilen, index) {
	var sumDis = 0;
	for (i = 0; i < zeilen.length; i++) {
		sumDis = sumDis + Number(zeilen[i][index][2]);
	}
	return sumDis;
}

function cumulativeDistanceWrapper(zeilen) {
	var current_anlage = getCurrentAnlageText();
	var retArray = [];
	switch (current_anlage) {
		case "Hochregallager": 
			for(j = 0; j < 2; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(cumulativeDistance(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		case "Bearbeitungsstation":
			break;
		case "Vakuum-Sauggreifer": 
			for(j = 0; j < 3; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(cumulativeDistance(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		case "Sortierstrecke": 
			break;
		case "Umsetzer":
			break;
		case "Ampel":
			break;
		default:
			break;
	}
	return retArray;
}

//Statiänderungen checken
function checkStatusChange(firstValue,secondValue) {
	if(firstValue != secondValue) {
		return 1;
	} else {
		return 0;
	}
}

//Statiänderungen zählen
function countStatusChange(zeilen, index) {
	var sum = 0;
	if(zeilen.length == 1) return 0; //can not count changes if there is only one value
	for (i = 1; i < zeilen.length; i++) {
		sum = sum + checkStatusChange(zeilen[i-1][index][2],zeilen[i][index][2]);
	}
	return sum;
}

function countStatusChangeWrapper(zeilen) {
	var current_anlage = getCurrentAnlageText();
	var retArray = [];
	switch (current_anlage) {
		case "Hochregallager": 
			for(j = 2; j < zeilen[0].length; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(countStatusChange(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		case "Bearbeitungsstation":
			for(j = 0; j < zeilen[0].length; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(countStatusChange(zeilen,j)); //changes
				retArray.push(retArrayInArray); 
			}
			break;
		case "Vakuum-Sauggreifer": 
			for(j = 3; j < zeilen[0].length; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(countStatusChange(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		case "Sortierstrecke": 
			for(j = 0; j < zeilen[0].length; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(countStatusChange(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		case "Umsetzer":
			for(j = 0; j < zeilen[0].length; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(countStatusChange(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		case "Ampel":
			for(j = 0; j < zeilen[0].length; j++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[0][j][1]); //sensor name
				retArrayInArray.push(countStatusChange(zeilen,j)); //changes
				retArray.push(retArrayInArray);
			}
			break;
		default:
			break;
	}
	return retArray;
}


/* Parameter einlesen
function processInput()
{
    var parameters = location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    l = unescape(temp[1]);
    getData(l);
} */

/*
function showTable(daten, filter) {
	// Anzeige des Filters
	//let filter_element = d3.select('#filter');
	var valid_filter = true;
	//var filter_text = "Filter: ";
	for(let f of filter){
		valid_filter = isValidFilter(f, daten);
		if(!valid_filter) {
		//filter_text += f + "; ";
		//else{
		//filter_text = "Filter ungültig: " + f;
		console.log("Filter ungültig: " + f);
		break;
		}
	}
	//filter_element.text(filter_text);
	if(valid_filter){
		
		var myArray = [];
	        daten.forEach(function(d, i){
	            // now we add another data object value, a calculated value.
	            // here we are making strings into numbers using type coercion
	            for(let f in filter){
	            	myArray.push([d.datum, filter[f], d.werte[filter[f]]]);
	            }
	        });
		
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
	    list.exit().remove();
    }
	
    else{
    
   // d3.select('#valid_filters').text( " Gültige Filter: ");
    d3.select("#grid-container").selectAll("ul").data(d3.keys(daten["0"].werte)).enter().append("li")
        .text(function (daten) {
            return daten;
        });
    for(i = 0; i < d3.keys(daten["0"].werte).length; i++){
    	d3.select("#list").select("ul").enter().append("li")
        .text(d3.keys(daten["0"].werte);
    }
    }
    
}*/