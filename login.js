const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');


loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    if (enteredUsername === 'admin' && enteredPassword === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        
        window.location.href = 'main.html';
    } else {
        alert('Invalid credentials! Please use Username: admin and Password: admin123');
        
        passwordInput.value = '';
    }
});