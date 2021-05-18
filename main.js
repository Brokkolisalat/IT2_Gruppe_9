function showData(daten, filter) {

	// Anzeige des Filters
	let filter_element = d3.select('#filter');
	valid_filter = isValidFilter(filter, daten);
	if(valid_filter){ 
	filter_element.text("Filter: " + filter);
    //Rückgabe der d3.selectAll - Methode in variable p speichern.(Alle Kindelemente von content, die p- Elemente sind.) Am Anfang gibt es noch keine.
    var list = d3.select("#list").selectAll("ul").data(daten);
    //.enter().append(): Daten hinzufuegen falls es mehr Daten als Elemente im HTML gibt.
    //geschieht hier für jede Zeile von daten.
    list.enter().append("li")
        .text(function (daten) {
            return "Schlüssel: " + filter + ", Wert: " + daten.werte[filter] + ", Uhrzeit: " + daten.datum;
        });
    //.exit().remove(): Daten löschen, falls es mehr Elemente im HTML als Daten gibt.
    list.exit().remove();
    }
    else{
    filter_element.text("Filter ungültig: " + filter);
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
	if(sensor == 1) filter = "Ampel rot";
	else filter = "Ampel roat";
    d3.json("https://it2wi1.if-lab.de/rest/ft_ablauf").then(function (data, error) {
        callData(data, error, filter)
    });
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
    //document.getElementById("sensor").innerHTML = l;   
}