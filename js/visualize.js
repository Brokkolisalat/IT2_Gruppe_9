$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var dummy_von = "15.05.2019 12:00:00";
var dummy_bis = "15.05.2019 13:00:00";

function visualizeDiagram(){
	var anlage = getCurrentAnlageText();
	d3.select("#head_text").text('Zusammenfassung ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "diagram");
}

function visualizeHistory(){
	var anlage = getCurrentAnlageText();
	d3.select("#head_text").text('Historie ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "history");
}

function visualizeWege(){
	var anlage = getCurrentAnlageText();
	switch (anlage) {
		case "Hochregallager": 
			$("#id1").attr("src","../bilder/Hochregallager.png");
			break;
		case "Bearbeitungsstation":
			$("#id1").attr("src","../bilder/Bearbeitungsstation.png");
			break;
		case "Vakuum-Sauggreifer":
			$("#id1").attr("src","../bilder/Vakuum-Sauggreifer.png");
			break;
		case "Sortierstrecke": 
			$("#id1").attr("src","../bilder/Sortierstrecke.png");
			break;
		case "Umsetzer":
			$("#id1").attr("src","../bilder/Umsetzer.png");
			break;
		case "Ampel":
			break;
		default:
			break;
	}
	d3.select("#head_text").text('Zurückgelegte Wegstrecke ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "wege");
}

function visualizeHistoricalChanges(){
	var anlage = getCurrentAnlageText();
	d3.select("#head_text").text('Historische Sensoränderungen ' + anlage);
	getData(anlage, dummy_von, dummy_bis, "historicalChanges");
}

document.getElementById("toPDF").onclick = function (){
    var doc = new jsPDF("landscape","pt","a1");
	var anlage = getCurrentAnlageText();
	var text = "Daten von " + anlage;
	//doc.setFontSize(30); 

	doc.text(10,15,text);
	
	doc.fromHTML(document.getElementById("body"),5,5,{
	});
	doc.save(text+".pdf");
}