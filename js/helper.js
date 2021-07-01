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
		else if(caller == "historicalChanges")
			displayHistoricalChanges(parseData(datenEmpfangen, filter, von_datum, bis_datum));	
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
	//var builtString = "Zusammenfassung " + current_anlage; //Notlösung für Überschrift
	//document.getElementById("header").innerHTML = builtString; //Notlösung für Überschrift
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

	data = [];
	for(l = 0; l < statiChanges.length; l++) {
		data.push({sensor: statiChanges[l][0], value: statiChanges[l][1]});
	}

	/* siehe https://www.d3-graph-gallery.com/graph/histogram_basic.html */
	// set the dimensions and margins of the graph
	var margin = {top: 200, right: 0, bottom: 170, left: 250},
		width = 1000 - margin.left - margin.right,
    	height = 600 - margin.top - margin.bottom;
	
	// append the svg object to the body of the page
	var svg = d3.select("#diagram")
	  .append("svg")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");
	
	// X ais
	var x = d3.scaleBand()
  	  .range([ 0, width ])
  	  .domain(data.map(function(d) { return d.sensor; }))
  	  .padding(0.2);
	svg.append("g")
  	  .attr("transform", "translate(0," + height + ")")
  	  .call(d3.axisBottom(x))
  	  .selectAll("text")
    	.attr("transform", "translate(-10,0)rotate(-45)")
    	.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
      .domain([0, 20])
      .range([ height, 0]);
	svg.append("g")
      .call(d3.axisLeft(y));

	// Bars
	svg.selectAll("mybar")
  	  .data(data)
  	  .enter()
  	  .append("rect")
       	.attr("x", function(d) { return x(d.sensor); })
    	.attr("y", function(d) { return y(d.value); })
    	.attr("width", x.bandwidth())
    	.attr("height", function(d) { return height - y(d.value); })
    	.attr("fill", "#69b3a2")
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

	var builtString =""
	for(k = 0; k < cumulativeDistance.length; k++) {
		builtString = builtString + cumulativeDistance[k][0]+": "+cumulativeDistance[k][1]+" Umdrehungen;"+"\n"; //"Umdreuhungen" as metric according to Sascha Oks
	}
	document.getElementById("cDistance").innerHTML = builtString;
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
	if(firstValue == " false" && secondValue == " true") { //space before value in String, according to Sascha Oks count only false --> true
		return 1;
	} else {
		return 0;
	}
}

//Statiänderungen zählen
function countStatusChange(zeilen, index) {
	var sum = 0;
	//can not count changes if there is only one value
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

function displayHistoricalChanges(input) {
	var myArray_unformated = computeHistoricalChanges(input);
	var beschriftung = [];
	beschriftung.push("Zeitpunkt");
	for(m = 1; m < myArray_unformated[0].length; m=m+2) {
		beschriftung.push(myArray_unformated[0][m]);
	}

	var myArray = [];
	for(m = 0; m < myArray_unformated.length; m++) {
		var myArrayinArray = [];
		myArrayinArray.push(myArray_unformated[m][0])
		for(n = 2; n < myArray_unformated[m].length; n=n+2) {
			myArrayinArray.push(myArray_unformated[m][n]);
		}
		myArray.push(myArrayinArray);
	}
	
	var table = d3.select("#table").append("table")
				  .style("border-collapse", "collapse")
				  .style("border","2px black solid");
    var header = table.append("thead").append("tr");
    header
            .selectAll("th")
            .data(beschriftung)
            .enter()
            .append("th")
            .text(function(d) { return d; })
			.style("border", "1px black solid")
			.style("padding", "5px")
			.style("background-color", "lightgray")
			.style("font-weight", "bold")
    var tablebody = table.append("tbody");
    rows = tablebody
            .selectAll("tr")
            .data(myArray)
            .enter()
            .append("tr")
    // We built the rows using the nested array - now each row has its own array.
    cells = rows.selectAll("td")
        // each row has data associated; we get it and enter it for the cells.
            .data(function(d) {
                console.log(d);
                return d;
            })
            .enter()
            .append("td")
			.style("border", "1px black solid")
			.style("padding", "5px")
			.on("mouseover", function() {
				d3.select(this).style("background-color", "powderblue");
			})
			.on("mouseout", function(){
				d3.select(this).style("background-color", "#717e87");
			})
            .text(function(d) {
                return d;
            });
}

function computeHistoricalChanges(zeilen) {
	var current_anlage = getCurrentAnlageText();
	var retArray = [];
	switch (current_anlage) {
		case "Hochregallager":
			for(i = 0; i < zeilen.length; i++) {

				var retArrayInArray = [];
				retArrayInArray.push(zeilen[i][0][0]);
				var slicedZeilen = zeilen.slice(0,i+1);
				for(j = 0; j < 2; j++) {
					retArrayInArray.push(zeilen[0][j][1]); //sensor name
					retArrayInArray.push(cumulativeDistance(slicedZeilen,j)); //changes
				}

				for(j = 2; j < zeilen[0].length; j++) {
					retArrayInArray.push(zeilen[0][j][1]); //sensor name
					retArrayInArray.push(countStatusChange(slicedZeilen,j)); //changes
				}
				retArray.push(retArrayInArray);
				console.log(retArrayInArray);
				/* Prüfung auf Änderungen nicht mehr notwendig, da "zeilen" bereits nur veränderte Zeilen enthält*/
			}
			break;
		case "Vakuum-Sauggreifer": 
			for(i = 0; i < zeilen.length; i++) {

				var retArrayInArray = [];
				retArrayInArray.push(zeilen[i][0][0]);
				var slicedZeilen = zeilen.slice(0,i+1);
				for(j = 0; j < 3; j++) {
					retArrayInArray.push(zeilen[0][j][1]); //sensor name
					retArrayInArray.push(cumulativeDistance(slicedZeilen,j)); //changes
				}
				for(j = 3; j < zeilen[0].length; j++) {
					retArrayInArray.push(zeilen[0][j][1]); //sensor name
					retArrayInArray.push(countStatusChange(slicedZeilen,j)); //changes
				}
				retArray.push(retArrayInArray);
				console.log(retArrayInArray);
			}	
			break;
		case "Sortierstrecke":
		case "Bearbeitungsstation":
		case "Umsetzer":
		case "Ampel":

			for(i = 0; i < zeilen.length; i++) {
				var retArrayInArray = [];
				retArrayInArray.push(zeilen[i][0][0]);
				var slicedZeilen = zeilen.slice(0,i+1);
				for(j = 0; j < zeilen[0].length; j++) {
					retArrayInArray.push(zeilen[0][j][1]); //sensor name
					retArrayInArray.push(countStatusChange(slicedZeilen,j)); //changes
				}
				retArray.push(retArrayInArray);
				console.log(retArrayInArray);
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