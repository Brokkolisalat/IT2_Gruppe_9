$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

function loadDiagram(){
	var anlage = getCurrentAnlageText();

	getData(anlage);
}