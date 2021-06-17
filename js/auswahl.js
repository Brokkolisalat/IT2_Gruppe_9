$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var sensor_loc = "auswahl_sensorik.html";
var wege_loc = "auswahl_wege.html";

document.getElementById("sensor").onclick = function (){
    location.href = sensor_loc;
}
document.getElementById("wege").onclick = function (){
    location.href = wege_loc;
}
