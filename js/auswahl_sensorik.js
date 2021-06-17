$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var anlage_sensor_loc = "auswahl_sensorik_darstellung.html";

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