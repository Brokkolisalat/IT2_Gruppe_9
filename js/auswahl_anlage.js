$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var anlage_sensor_loc = "auswahl_darstellung.html";

// Auswahl bei Sensorik 
document.getElementById("infor-sensor-1").onclick = function (){
	setCurrentAnlage(0);
    location.href = anlage_sensor_loc;
}
document.getElementById("infor-sensor-2").onclick = function (){
	setCurrentAnlage(1);
    location.href = anlage_sensor_loc;
}
document.getElementById("infor-sensor-3").onclick = function (){
	setCurrentAnlage(2);
    location.href = anlage_sensor_loc;
}
document.getElementById("infor-sensor-4").onclick = function (){
    setCurrentAnlage(3);
    location.href = anlage_sensor_loc;
}
document.getElementById("infor-sensor-5").onclick = function (){
    setCurrentAnlage(4);
    location.href = anlage_sensor_loc;
}
document.getElementById("infor-sensor-6").onclick = function (){
    location.href = anlage_sensor_loc;
}