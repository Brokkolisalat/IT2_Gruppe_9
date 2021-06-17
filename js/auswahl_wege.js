$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

var anlage_wege_loc = "wege.html";
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