$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

function onLoad(){
	var anlage = getCurrentAnlageText();
	d3.select("title").text('Auswahl Visualisierung für ' + anlage);
	d3.select("#head_text").text('Auswahl Visualisierung für ' + anlage);
}

document.getElementById("diagram").onclick = function (){
    location.href = 'diagram.html';
}
/*document.getElementById("history").onclick = function (){
    location.href = 'history.html';
}*/
document.getElementById("wege").onclick = function (){
    location.href = 'wege.html';
}
document.getElementById("historical_sensorchanges").onclick = function (){
    location.href = 'historical_sensorchanges.html';
}