$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var sensor_loc = "auswahl_sensorik.html";
var wege_loc = "auswahl_wege.html";
var anlage_sensor_loc = "auswahl_sensorik_darstellung.html";
var anlage_wege_loc = "wege.html";

document.getElementById("sensor").onclick = function (){
    location.href = sensor_loc;
}
document.getElementById("wege").onclick = function (){
    location.href = wege_loc;
}

// Auswahl bei Sensorik 
document.getElementById("infor-sensor-1").onclick = function (){
    location.href = anlage_sensor_loc;
    setCurrentAnlage(1);
}
document.getElementById("infor-sensor-2").onclick = function (){
    location.href = anlage_sensor_loc;
    setCurrentAnlage(2);
}
document.getElementById("infor-sensor-3").onclick = function (){
    location.href = anlage_sensor_loc;
    setCurrentAnlage(3);
}
document.getElementById("infor-sensor-4").onclick = function (){
    location.href = anlage_sensor_loc;
    setCurrentAnlage(4);
}
document.getElementById("infor-sensor-5").onclick = function (){
    location.href = anlage_sensor_loc;
    setCurrentAnlage(5);
}
document.getElementById("infor-sensor-6").onclick = function (){
    location.href = anlage_sensor_loc;
}
// Auswahl bei Wegstrecke
document.getElementById("infor-wege-1").onclick = function (){
    location.href = anlage_wege_loc;
    setCurrentAnlage(1);
}
document.getElementById("infor-wege-2").onclick = function (){
    location.href = anlage_wege_loc;
    setCurrentAnlage(2);
}
document.getElementById("infor-wege-3").onclick = function (){
    location.href = anlage_wege_loc;
    setCurrentAnlage(3);
}
document.getElementById("infor-wege-4").onclick = function (){
    location.href = anlage_wege_loc;
    setCurrentAnlage(4);
}
document.getElementById("infor-wege-6").onclick = function (){
    location.href = anlage_wege_loc;
}