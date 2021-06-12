const form = document.getElementById('login-form');

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    var username = formData.get('username');
    var password = formData.get('password');
    console.log(username, password);
    if (username === 'admin' && password === 'admin') {
        location.href = 'Front_page.html';
    } else {
        alert("Username or Password is incorrect!");
    }
});