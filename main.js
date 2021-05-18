function showData(daten, sensor) {

	// Anzeige des Filters
	let filter = d3.select('#filter');
	filter.text("Filter: " + sensor);

    //Rückgabe der d3.selectAll - Methode in variable p speichern.(Alle Kindelemente von content, die p- Elemente sind.) Am Anfang gibt es noch keine.
    var list = d3.select("#list").selectAll("ul").data(daten);

    //.enter().append(): Daten hinzufuegen falls es mehr Daten als Elemente im HTML gibt.
    //geschieht hier für jede Zeile von daten.
    list.enter().append("li")
        .text(function (daten) {
            return "Schlüssel: " + d3.keys(daten.werte) + "Wert: " + daten.werte[sensor] + "Uhrzeit: " + daten.datum;
        });
    //.exit().remove(): Daten löschen, falls es mehr Elemente im HTML als Daten gibt.
    list.exit().remove();
}

function callData(datenEmpfangen,error, sensor) {
    if (error || !isValidSensor(sensor, datenEmpfangen)) {
        console.log(error);
    } else {
        showData(datenEmpfangen, sensor);
    }
}

// Einstiegspunkt
function getData() {
   var sensor = "Ampel rot"
    d3.json("https://it2wi1.if-lab.de/rest/ft_ablauf").then(function (data, error) {
        callData(data, error, sensor)
    });
}

function isValidSensor(sensor, daten){
	var valid_sensors = d3.keys(daten.werte);
	for (i = 0; i < valid_sensors.length; i++) {
		if(valid_sensors[i] == sensor) return true;
	}
	return false;
}

/*
SCHLÜSSELWERTE IN JSON:
H-vertikal
H-horizontal
V-vertikal	
V-drehen	
V-horizontal
B-Referenzschalter Drehkranz (Pos. Sauger)	" false"
B-Referenzschalter Drehkranz (Pos. Foerderband)	" false"
B-Lichtschranke Ende Foerderband	" true"
B-Referenzschalter Drehkranz (Pos. Saege)	" false"
B-Referenzschalter Sauger (Pos. Drehkranz)	" true"
B-Referenzschalter Ofenschieber Innen	" false"
B-Referenzschalter Ofenschieber Aussen	" true"
B-Referenzschalter Sauger (Pos. Brennofen)	" false"
B-Lichtschranke Brennofen	" true"
S-Lichtschranke Eingang	" true"
S-Lichtschranke nach Farbsensor	" true"
S-Lichtschranke weiss	" true"
S-Lichtschranke rot	" true"
S-Lichtschranke blau	" true"
Umsetzer Endanschlag 1 (3B1)	" false"
Umsetzer Endanschlag 2 (3B2)	" false"
Referenztaster horizontal	" true"
Lichtschranke innen	" true"
Lichtschranke aussen	" true"
Referenztaster vertikal	" true"
Referenztaster Ausleger vorne	" false"
Referenztaster Ausleger hinten	" true"
V-Referenzschalter vertikal	" true"
V-Referenzschalter horizontal	" true"
V-Referenzschalter drehen	" true"
B-Motor Drehkranz im Uhrzeigersinn	" false"
B-Motor Drehkranz gegen Uhrzeigersinn	" false"
B-Motor Foerderband vorwaerts	" false"
B-Motor Saege	" false"
B-Motor Ofenschieber Einfahren	" false"
B-Motor Ofenschieber Ausfahren	" false"
B-Motor Sauger zum Ofen	" false"
B-Motor Sauger zum Drehkranz	" false"
B-Leuchte Ofen	" false"
S-Motor Foerderband	" false"
Ampel rot	" false"
Ampel orange	" false"
Ampel gruen	" false"
Ampel weiss
*/