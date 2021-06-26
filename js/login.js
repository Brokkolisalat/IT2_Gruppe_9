const form = document.getElementById('login-form');

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    var username = formData.get('username');
    var password = formData.get('password');
    console.log(username, password);
    if (username === 'admin' && password === 'admin') {
        location.href = 'auswahl_anlage.html';
    } else {
        alert("Benutzername oder Passwort sind falsch!");
    }
}
);
document.getElementById("no-access").onclick = function (){
    location.href = 'support.html'};