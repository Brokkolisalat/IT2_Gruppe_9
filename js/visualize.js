$(function () {
    $("#header").load("header.html");
});

var dummy_von = "15.05.2019 12:00:00";
var dummy_bis = "15.05.2019 13:00:00";

function visualizeDiagram(){
	
	var anlage = getCurrentAnlageText();
	d3.select("title").text('Zusammenfassung(Diagramm) ' + anlage);
	d3.select("#head_text").text('Zusammenfassung(Diagramm) ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "diagram");

}

function visualizeHistory(){
	var anlage = getCurrentAnlageText();
	d3.select("title").text('Historie ' + anlage);
	d3.select("#head_text").text('Historie ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "history");
}

function visualizeWege(){
	var anlage = getCurrentAnlageText();
	switch (anlage) {
		case "Hochregallager": 
			$("#id1").attr("src","../views/bilder/Hochregallager.PNG");
			break;
		case "Bearbeitungsstation":
			$("#id1").attr("src","../views/bilder/Bearbeitungsstation.PNG");
			break;
		case "Vakuum-Sauggreifer":
			$("#id1").attr("src","../views/bilder/Vakuum-Sauggreifer.PNG");
			break;
		case "Sortierstrecke": 
			$("#id1").attr("src","../views/bilder/Sortierstrecke.PNG");
			break;
		case "Umsetzer":
			$("#id1").attr("src","../views/bilder/Umsetzer.PNG");
			break;
		case "Ampel":
			break;
		default:
			break;
	}
	d3.select("title").text('Zurückgelegte Wegstrecke ' + anlage);
	d3.select("#head_text").text('Zurückgelegte Wegstrecke ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "wege");
}

function visualizeHistoricalChanges(){
	var anlage = getCurrentAnlageText();
	d3.select("title").text('Historische Sensoränderungen ' + anlage);
	d3.select("#head_text").text('Historische Sensoränderungen ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "historicalChanges");
}

document.getElementById("toPDF").onclick = function (){
    var doc = new jsPDF("landscape","pt","a1");
	var anlage = getCurrentAnlageText();
	var text = "Daten von " + anlage;
	//doc.setFontSize(30); 

	doc.text(10,15,text);
	
	doc.fromHTML(document.getElementById("table"),10,10,{
	});
	doc.save(text+".pdf");
}