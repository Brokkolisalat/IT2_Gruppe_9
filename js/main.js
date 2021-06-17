function showData(daten, filter) {

	// Anzeige des Filters
	let filter_element = d3.select('#filter');
	var valid_filter = true;
	var filter_text = "Filter: ";
	for(let f of filter){
		valid_filter = isValidFilter(f, daten);
		if(valid_filter) 
		filter_text += f + "; ";
		else{
		filter_text = "Filter ungültig: " + f;
		break;
		}
	}
	filter_element.text(filter_text);
	if(valid_filter){
		
		var myArray = [];
	        daten.forEach(function(d, i){
	            // now we add another data object value, a calculated value.
	            // here we are making strings into numbers using type coercion
	            for(let f in filter){
	            	myArray.push([d.datum, filter[f], d.werte[filter[f]]]);
	            }
	        });
		
		var table = d3.select("#list").append("table");
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
		
	    /*//Rückgabe der d3.selectAll - Methode in variable p speichern.(Alle Kindelemente von content, die p- Elemente sind.) Am Anfang gibt es noch keine.
	    var list = d3.select("#list").selectAll("ul").data(daten);
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
    else{
    
    d3.select('#valid_filters').text( " Gültige Filter: ");
    d3.select("#list").selectAll("ul").data(d3.keys(daten["0"].werte)).enter().append("li")
        .text(function (daten) {
            return daten;
        });
    /*for(i = 0; i < d3.keys(daten["0"].werte).length; i++){
    	d3.select("#list").select("ul").enter().append("li")
        .text(d3.keys(daten["0"].werte);
    }*/
    }
    
}

function callData(datenEmpfangen,error, filter) {
    if (error) {
        console.log(error);
    } else {
        showData(datenEmpfangen, filter);
    }
}

// Einstiegspunkt
function getData(sensor) {
	var filter = getFilterBySensor(sensor);
    d3.json("https://it2wi1.if-lab.de/rest/ft_ablauf").then(function (data, error) {
        callData(data, error, filter)
    });
}

function getFilterBySensor(sensor){
	let filter = [];
	switch (sensor) {
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

function isValidFilter(filter, daten){
	var valid_filters = d3.keys(daten["0"].werte);
	for (i = 0; i < valid_filters.length; i++) {
		if(valid_filters[i] == filter) return true;
	}
	return false;
}

// Parameter einlesen
function processInput()
{
    var parameters = location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    l = unescape(temp[1]);
    getData(l);
}