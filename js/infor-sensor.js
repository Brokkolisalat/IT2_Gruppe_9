$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

document.getElementById("diagram").onclick = function (){
    location.href = 'diagram.html';
}
document.getElementById("history").onclick = function (){
    location.href = 'history.html';
}