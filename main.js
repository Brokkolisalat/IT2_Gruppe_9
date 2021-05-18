function showData(daten, filter) {

	// Anzeige des Filters
	let filter_element = d3.select('#filter');
	var valid_filter = true;
	var filter_text = "Filter: ";
	for(let f in filter){
		valid_filter = isValidFilter(f, daten);
		if(valid_filter) 
		filter_text += f;
		else{
		filter_text = "Filter ungültig: " + f;
		break;
		}
	}
	filter_element.text(filter_text);
	if(valid_filter){
    //Rückgabe der d3.selectAll - Methode in variable p speichern.(Alle Kindelemente von content, die p- Elemente sind.) Am Anfang gibt es noch keine.
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
    list.exit().remove();
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
	if(sensor == 1){ 
		filter[0] = "Ampel rot";
		filter[1] = "Ampel gelb";}
	else{ 
		filter[0] = "Ampel roat";}
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
}