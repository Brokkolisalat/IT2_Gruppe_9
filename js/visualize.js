$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

function visualizeDiagram(){
	var anlage = getCurrentAnlageText();

	getData(anlage);
}

function visualizeHistory(){
	var anlage = getCurrentAnlageText();

	getData(anlage);
}

function visualizeWege(){
	var anlage = getCurrentAnlageText();

	getData(anlage);
}