$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var dummy_von = "15.05.2019 12:00:00";
var dummy_bis = "15.05.2019 13:00:00";

function visualizeDiagram(){
	var anlage = getCurrentAnlageText();
	getData(anlage, dummy_von, dummy_bis);
}

function visualizeHistory(){
	var anlage = getCurrentAnlageText();

	getData(anlage, dummy_von, dummy_bis);
}

function visualizeWege(){
	var anlage = getCurrentAnlageText();

	getData(anlage, dummy_von, dummy_bis);
}