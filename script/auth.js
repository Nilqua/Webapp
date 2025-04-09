function register() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    if (localStorage.getItem(username)) {
        document.getElementById("message").innerText = "User already exists!";
    } else {
        localStorage.setItem(username, password);
        document.getElementById("message").innerText = "Registered successfully!";
        window.location.href = "index.html";
    }
}

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const storedPassword = localStorage.getItem(username);

    if (storedPassword === password) {
        document.getElementById("message").innerText = "Login successful!";
        window.location.href = "index.html";
    } else {
        document.getElementById("message").innerText = "Invalid username or password!";
    }
}
