$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

document.getElementById("sensor").onclick = function (){
    location.href = 'auswahl_sensorik.html';
}
document.getElementById("wege").onclick = function (){
    location.href = 'auswahl_wege.html';
}