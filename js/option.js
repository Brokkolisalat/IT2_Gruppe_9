$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

document.getElementById("sensor").onclick = function (){
    location.href = 'auswahl_sensorik.html';
}
document.getElementById("wege").onclick = function (){
    location.href = 'auswahL_wege.html';
}

// TODO: Übergabe aktueller Sensor, damit aufgerufende HTML-Page nur einmal erstellt werden muss!
document.getElementById("diagram").onclick = function (){
    location.href = 'diagramm.html';
}
// TODO: Übergabe aktueller Sensor, damit aufgerufende HTML-Page nur einmal erstellt werden muss!
document.getElementById("history").onclick = function (){
    location.href = 'historie.html';
}